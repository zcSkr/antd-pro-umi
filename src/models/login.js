import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { setAuthority } from '@/utils/authority';
import { getPageQuery } from '@/utils/utils';
import { reloadAuthorized } from '@/utils/Authorized';
import * as service_login from '@/services/sys/login';
import app from '@/config/config';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    logining: false
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      });
      // Login successfully
      if (response.status === 'ok') {
        reloadAuthorized();
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        console.log(urlParams,params)
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      }
    },
    *login1({ payload }, { select, call, put }) {
      yield put({ type: 'save', payload: { logining: true } });
      const response = yield call(service_login.login, { account: 'dev', password: 'dev' });
      if (response) {
        console.log(response)
        // const urlParams = new URL(window.location.href);
        // const params = getPageQuery();
        // let { redirect } = params;
        // console.log(urlParams,params)
        app.setToken(response.data.token);
        app.setUnionuser(response.data.user);
        yield put({ type: 'save', payload: { logining: false } });
        yield put(routerRedux.push('/'));
      } else {
        yield put({ type: 'save', payload: { logining: false } });
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          currentAuthority: 'guest',
        },
      });
      reloadAuthorized();
      yield put(
        routerRedux.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type,
      };
    },
  },
};
