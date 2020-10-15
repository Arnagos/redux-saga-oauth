// @flow
import type { AuthToken, AuthParams } from "./types";

export const AUTH_RESTORE = `AUTH_RESTORE`;

export const AUTH_LOGIN = `AUTH_LOGIN`;
export const AUTH_LOGIN_REQUEST = `AUTH_LOGIN_REQUEST`;
export const AUTH_LOGIN_ERROR = `AUTH_LOGIN_ERROR`;

export const AUTH_LOGOUT = `AUTH_LOGOUT`;
export const AUTH_LOGOUT_REQUEST = `AUTH_LOGOUT_REQUEST`;

export const AUTH_REFRESH = `AUTH_REFRESH`;
export const AUTH_REFRESH_SUCCESS = `AUTH_REFRESH_SUCCESS`;
export const AUTH_REFRESH_ERROR = `AUTH_REFRESH_ERROR`;

export const AUTH_INVALID_ERROR = `AUTH_INVALID_ERROR`;

export const authRestore = () => ({
  type: AUTH_RESTORE,
});

export const authLogin = (payload: AuthToken) => ({
  type: AUTH_LOGIN,
  payload,
});
export const authLoginRequest = (
  payload: AuthParams,
  onSuccess: ?Function,
  onError: ?Function
) => ({
  type: AUTH_LOGIN_REQUEST,
  payload,
  onSuccess,
  onError,
});
export const authLoginError = (errors: ?any) => ({
  type: AUTH_LOGIN_ERROR,
  payload: {
    errors,
  },
});

export const authLogout = () => ({
  type: AUTH_LOGOUT,
});
export const authLogoutRequest = () => ({
  type: AUTH_LOGOUT_REQUEST,
});

export const authRefreshSuccess = (payload: AuthToken) => ({
  type: AUTH_REFRESH_SUCCESS,
  payload,
});
export const authRefreshError = (errors: ?any) => ({
  type: AUTH_REFRESH_ERROR,
  payload: {
    errors,
  },
});

export const authInvalidError = (errors: ?any) => ({
  type: AUTH_INVALID_ERROR,
  payload: {
    errors,
  },
});
