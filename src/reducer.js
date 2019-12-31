// @flow
import {
  AUTH_LOGIN,
  AUTH_LOGOUT,
  AUTH_REFRESH_SUCCESS,
} from "./actions";
import type {AuthToken, AuthTokenResponse} from "./types";
import jwt from 'jsonwebtoken';

export type State = {
  loggedIn: boolean,
  access_token: null|string,
  created_at: null|number,
  expires_in: null|number,
  refresh_token: null|string,
  token_type: null|string,
};

type Action = {
  type?: string,
  payload?: AuthToken,
};

const initialState: State = {
  loggedIn: false,
  access_token: null,
  created_at: null,
  expires_in: null,
  refresh_token: null,
  token_type: null,
};

const reducer = (state: State = initialState, action: Action): State => {
  switch(action.type) {
    case AUTH_LOGIN:
    case AUTH_REFRESH_SUCCESS:
      if (action.payload) {
        let responseToken: AuthTokenResponse = action.payload;
        let decodedAuthToken = jwt.decode(responseToken.access_token);
        return {
          ...state,
          loggedIn: true,
          access_token: responseToken.access_token,
          token_type: responseToken.token_type,
          refresh_token: responseToken.refresh_token,
          expires_in: decodedAuthToken.exp,
          created_at: decodedAuthToken.iat,
        };
      }

    case AUTH_LOGOUT:
      return {
        ...initialState,
      };

    // this is for debugging, there is no public action to call this
    case "AUTH_EXPIRE_TOKEN":
      return {
        ...state,
        expires_in: 0,
      };

    default:
      return state;
  }
};

export default reducer;
