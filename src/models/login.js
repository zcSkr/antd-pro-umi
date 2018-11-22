import { routerRedux } from 'dva/router';
import { stringify } from 'qs';
import { getPageQuery } from '@/utils/utils';
import * as service_login from '@/services/sys/login';
import app from '@/config/app';
import { notification } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
    logining: false
  },

  effects: {
    *login({ payload }, { select, call, put }) {
      yield put({ type: 'save', payload: { logining: true } });
      const response = yield call(service_login.login, { account: 'dev', password: 'dev', ...payload });
      if (response) {
        if (response.resultState == '1') {
          app.setToken(response.data.token);
          app.setUnionuser(response.data.user);
          yield put({ type: 'save', payload: { logining: false, status: 'success' } });
          const urlParams = new URL(window.location.href);
          const params = getPageQuery();
          let { redirect } = params;
          // console.log(urlParams, params)
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
        } else {
          yield put({ type: 'save', payload: { status: 'error' } });
        }
        notification.destroy()
      } else {
        yield put({ type: 'save', payload: { logining: false, status: 'error' } });
      }
    },

    *logout(_, { put }) {
      localStorage.removeItem('unionuser')
      localStorage.removeItem('token')
      const params = getPageQuery();
      let { redirect } = params;
      if (redirect) return
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
    }
  },
};
