// @flow
import reducer from "./../src/reducer";
import {
  authLogin,
  authLogout,
  authRefreshSuccess,
} from "./../src/actions";

describe("Auth Reducer", () => {

  const token = {
    created_at: Math.round(new Date().getTime() / 1000),
    expires_in: 7200,
    refresh_token: "eyJhbGciOiJIUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICI0NGM3MTczYi1hZWU5LTRmNzAtOGE0MC1mNDU3MGI4MjAyZTUifQ.eyJqdGkiOiI4ZjlmNDFhMy1kODczLTQxYWEtOTIwMS01MGZhN2E0MmJhZWEiLCJleHAiOjE1Nzc3MjAxNTksIm5iZiI6MCwiaWF0IjoxNTc3NzE4MzU5LCJpc3MiOiJodHRwczovL2xvZ2luLmlhdXRoLmFwcC9hdXRoL3JlYWxtcy9jYXJnb2Jyb2tlcm1hcmtldCIsImF1ZCI6Imh0dHBzOi8vbG9naW4uaWF1dGguYXBwL2F1dGgvcmVhbG1zL2NhcmdvYnJva2VybWFya2V0Iiwic3ViIjoiY2E4YjVjNWItMTM5NS00ZjM5LThmOTUtMTRiYTdhZDE0ZTg3IiwidHlwIjoiUmVmcmVzaCIsImF6cCI6ImRlZmF1bHQtY2xpZW50IiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiNDMxMDBjZTItNzhlYS00ZWI5LTkwMmItNzk0YzkyNTZhZjVhIiwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwifQ.3-16N1US-yfo09UCZ4OnJkRhW3tzcXYek2_gaGvhNdw",
    access_token: "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJqU0hXU1YwcURXUkVyWENHOHNQOUJ4YWNJWnRVSXNsOVpocTdWUjZ2R2pRIn0.eyJqdGkiOiIzZmM0MmQxNC03N2FlLTRiNTMtOWFmMy1lMGEzNWVmYzNlZjAiLCJleHAiOjE1Nzc3MTg2NTksIm5iZiI6MCwiaWF0IjoxNTc3NzE4MzU5LCJpc3MiOiJodHRwczovL2xvZ2luLmlhdXRoLmFwcC9hdXRoL3JlYWxtcy9jYXJnb2Jyb2tlcm1hcmtldCIsImF1ZCI6ImFjY291bnQiLCJzdWIiOiJjYThiNWM1Yi0xMzk1LTRmMzktOGY5NS0xNGJhN2FkMTRlODciLCJ0eXAiOiJCZWFyZXIiLCJhenAiOiJkZWZhdWx0LWNsaWVudCIsImF1dGhfdGltZSI6MCwic2Vzc2lvbl9zdGF0ZSI6IjQzMTAwY2UyLTc4ZWEtNGViOS05MDJiLTc5NGM5MjU2YWY1YSIsImFjciI6IjEiLCJhbGxvd2VkLW9yaWdpbnMiOlsiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cHM6Ly9jYXJnb2Jyb2tlcm1hcmtldC5jb20iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsInByZWZlcnJlZF91c2VybmFtZSI6ImRlbW8iLCJlbWFpbCI6ImRlbW9AdGVzdC5jb20ifQ.HDToPgJ-6NiSAakBV5_DKipf4BM_5uiFU92fsfCaSs1-R5XurJM9KzOCYzkew1EWSZC-gBumApM66MrxJp30UmjmIBRPkXhju5kpfmjJIhVHgZCT3foVE21rDcRi9QtnWkBwDxlpOrp8BF7RnpzyDGdLYsksDVWuWiBNmPdm85I1Q3LYnSHiq7agKRJG_Nh28UnJ3HTXNTLsdjX-najZwq1IoEr7I2A8AqHHpGEKqfX1ZOLIhPisqauT6Ok76DBF8WX2SgGkkShZ4LVVQl1hsMuxEOX2qUKiR6s2-LuR6V--vDZMFOSJwCVkAb54hQUiexgpdgCYZPbW_L3sUjf98A",
    token_type: "bearer",
  };

  const initialState = {
    loggedIn: false,
    access_token: null,
    token_type: null,
    refresh_token: null,
    expires_in: null,
    created_at: null,
  };

  it("should return an initial state", () => {
    const state = undefined;
    const action = {};
    const expectedState = {
      loggedIn: false,
      access_token: null,
      token_type: null,
      refresh_token: null,
      expires_in: null,
      created_at: null,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it("should handle authLogin()", () => {
    const state = {
      ...initialState,
    };
    const action = authLogin(token);
    const expectedState = {
      loggedIn: true,
      access_token: token.access_token,
      token_type: token.token_type,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in,
      created_at: token.created_at,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it("should handle authLogout()", () => {
    const state = {
      loggedIn: true,
      ...token,
    };
    const action = authLogout();
    const expectedState = {
      loggedIn: false,
      access_token: null,
      token_type: null,
      refresh_token: null,
      expires_in: null,
      created_at: null,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

  it("should handle authRefreshSuccess()", () => {
    //const refreshToken = token;
    const state = {
      loggedIn: true,
      access_token: token.access_token,
      token_type: token.token_type,
      refresh_token: token.refresh_token,
      //expires_in: token.expires_in,
      //created_at: token.created_at,
    };
    const action = authRefreshSuccess(token);
    const expectedState = {
      loggedIn: true,
      access_token: token.access_token,
      token_type: token.token_type,
      refresh_token: token.refresh_token,
      expires_in: token.expires_in,
      created_at: token.created_at,
    };

    expect(reducer(state, action)).toEqual(expectedState);
  });

});
