// @flow

export type AuthTokenResponse = {
  access_token: string,
  expires_in: number,
  refresh_expires_in: number,
  refresh_token: string,
  token_type: string,
  session_state: string,
  scope: string
}

export type AuthToken = {
  access_token: string,
  created_at: number,
  expires_in: number,
  refresh_token: string,
  token_type: string,
};

export type AuthParams = {
  grant_type: string,
};
