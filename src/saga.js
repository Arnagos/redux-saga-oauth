// @flow
import {call, cancel, delay, fork, put, race, select, take, takeLatest } from "redux-saga/effects";
import axios from "axios";
import qs from "querystring";
import {
  AUTH_INVALID_ERROR,
  AUTH_LOGIN_ERROR,
  AUTH_LOGIN_REQUEST,
  AUTH_LOGOUT_REQUEST,
  AUTH_REFRESH,
  AUTH_RESTORE,
  authInvalidError,
  authLogin,
  authLoginError,
  authLogout,
  authRefreshError,
  authRefreshSuccess,
  authRestore
} from './actions';

const tokenHasExpired = (expires_in): boolean => {
  return 1000 * expires_in - (new Date()).getTime() < 5000
};

const createAuthSaga = (options: {
  loginActions?: Object,
  reducerKey: string,
  OAUTH_URL: string,
  OAUTH_LOGOUT_URL: string,
  OAUTH_CLIENT_ID: string,
  OAUTH_CLIENT_SECRET: string,
}) => {
  const {
    loginActions,
    OAUTH_URL,
    OAUTH_LOGOUT_URL,
    OAUTH_CLIENT_ID,
    OAUTH_CLIENT_SECRET,
    reducerKey,
  } = options;

  const getAuth = state => state[reducerKey];

  /**
   * @return {boolean}
   */
  function* RefreshToken(refresh_token) {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
      const params = {
        refresh_token,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
        grant_type: "refresh_token",
      };
      const { data: token } = yield call(axios.post, OAUTH_URL, qs.stringify(params), config);
      yield put(authRefreshSuccess(token));
      return true;
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          yield put(authInvalidError(error.response));
        } else {
          yield put(authRefreshError(error.response));
        }
      } else {
        yield put(authRefreshError(error));
      }
      return false;
    }
  }

  function* RefreshLoop() {
    const maxRetries = 5;
    let retries = 0;

    while (true) {
      const {expires_in, refresh_token} = yield select(getAuth);

      // if the token has expired, refresh it
      if (
          expires_in !== null &&
          tokenHasExpired(expires_in)
      ) {
        const refreshed = yield call(RefreshToken, refresh_token);

        // if the refresh succeeded set the retires to 0
        // if the refresh failed, log a failure
        if (refreshed) {
          // if the token has been refreshed, and their had been retries
          // let the user know everything is okay
          if (retries > 0) {
            // @TODO add hook
          }
          retries = 0;
        } else {
          retries = retries + 1;
        }

        if (retries > 0 && retries < maxRetries) {
          // @TODO add hook
        }

        if (retries === maxRetries) {
          // @TODO add hook
          return;
        }
      }

      // check again in 5 seconds
      // this will also replay failed refresh attempts
      yield delay(5000);
    }
  }

  function* Authorize(action) {
    try {
      const { onSuccess, payload } = action;

      const params = {
        ...payload,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
      };

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      const { data: token } = yield call(axios.post, OAUTH_URL, qs.stringify(params), config);

      yield put(authLogin(token));

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      const { onError } = action;

      if (onError) {
        onError(error.response ? error.response.data : error);
      }

      if (error.response) {
        yield put(authLoginError(error.response.data));
      } else {
        yield put(authLoginError(error));
      }
    }
  }

  function* Authentication(): Generator<*, *, *> {
    while (true) {
      // wait for a user to request to login
      // or any custom login actions
      const actions = yield race({
        login: take(AUTH_LOGIN_REQUEST),
        refresh: take(AUTH_REFRESH),
        ...loginActions,
      });

      const {loggedIn, refresh_token, expires_in} = yield select(getAuth);
      let authorizeTask = null;

      // if the users is logged in, we can skip over this bit
      if (!loggedIn) {
        if (actions.login) {
          // in the background, run a task to log them in
          authorizeTask = yield fork(Authorize, actions.login);
        } else {
          continue;
        }
      } else {
        if (tokenHasExpired(expires_in)) {
          const refreshed = yield call(RefreshToken, refresh_token);
          if (!refreshed) {
            yield call(Logout);
            continue;
          }
        }

        // dispatch an action so we know the user is back into an
        // authenticated state
        yield put(authRestore());
      }

      // wait for...
      // the user to logout (AUTH_LOGOUT_REQUEST)
      // OR an error to occur during login (AUTH_LOGIN_ERROR)
      // OR the user to become unauthorized (AUTH_INVALID_ERROR)
      // but while they are logged in, begin the refresh token loop
      yield race({
        logout: take(AUTH_LOGOUT_REQUEST),
        loginError: take(AUTH_LOGIN_ERROR),
        unauthorized: take(AUTH_INVALID_ERROR),
        refresh: call(RefreshLoop),
      });

      // cancel the authorizeTask task if it's running and exists
      if (authorizeTask !== null) {
        yield cancel(authorizeTask);
      }

      // finally log the user out
      yield call(Logout);
    }
  }

  function* Logout() {

    const {refresh_token} = yield select(getAuth);

    if (refresh_token) {

      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };

      const params = {
        refresh_token,
        client_id: OAUTH_CLIENT_ID,
        client_secret: OAUTH_CLIENT_SECRET,
      };

      if (OAUTH_LOGOUT_URL) {
        yield call(axios.post, OAUTH_LOGOUT_URL, qs.stringify(params), config);
      }

      yield put(authLogout());
    }
  }

  return Authentication;
};

export default createAuthSaga;
