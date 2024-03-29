import * as common from './Common'
import * as types from '../redux/types'
import axios, { AxiosResponse } from 'axios';

export const performLoginMiddleware = store => next => action => {
  if (!action.meta || action.meta.type !== types.DO_LOGIN) {
    return next(action);
  }
  const app = action.meta.app;
  axios.post(action.meta.url, {}, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  }).then((response: AxiosResponse) => {
    const responseJson = response.data;
    let loginKey: string = '';
    let loginSuccess: boolean = false;

    if (responseJson.code != null && responseJson.code === "00") {
      loginKey = response.headers['access-token'];
      console.log("api_token: ", loginKey);
      loginSuccess = true;
    }
    common.updateAccessToken(response);
    let newAction = Object.assign({}, action, {
      payload: {
        loginStatus: loginSuccess,
        loginKey: loginKey,
        loggedUser: responseJson.user
      }
    });
    delete newAction.meta;
    store.dispatch(newAction);
  })
    .catch(console.log)
    .finally(() => { if (app.endLoading) { app.endLoading(); } });

}

export const getLoggedUserMiddleware = store => next => action => {
  if (!action.meta || action.meta.type !== types.GET_LOGGED_USER) { return next(action); }

  let headers = common.commonAuthorizedHeader();
  const { app } = action.meta;
  axios.post(action.meta.url, (action.payload), {
    headers: headers
  })
    .then((response: AxiosResponse) => {
      const data = response.data;

      if (!data) {
        alert("Error performing request");
        return;
      }

      let newAction = Object.assign({}, action, { payload: { data } });
      delete newAction.meta;
      store.dispatch(newAction);
    })
    .catch(console.log)
    .finally(() => {
      if (app.endLoading) { app.endLoading(); };
      if (app.refresh) { app.refresh(); }
    });
}


export const performLogoutMiddleware = store => next => action => {
  if (!action.meta || action.meta.type !== types.DO_LOGOUT) {
    return next(action);
  }
  const app = action.meta.app;

  axios.post(action.meta.url, (action.payload), {
    headers: common.commonAuthorizedHeader()
  })
    .then((response: AxiosResponse) => {
      const responseJson = response.data;
      let logoutSuccess = false;
      if (responseJson.code === "00") {
        logoutSuccess = true;
      } else {
        alert("Logout Failed");
      }

      let newAction = Object.assign({}, action, {
        payload: {
          loginStatus: !logoutSuccess
        }
      });
      delete newAction.meta;
      store.dispatch(newAction);
    })
    .catch(console.log)
    .finally(() => { if (app.endLoading) { app.endLoading(); } });
}

export const setLoggedUserMiddleware = store => next => action => {
  if (!action.meta || action.meta.type !== types.SET_LOGGED_USER) { return next(action); }
  let newAction = Object.assign({}, action, { payload: action.payload });
  delete newAction.meta;
  store.dispatch(newAction);
}