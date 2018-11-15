import * as service_module from '@/services/sys/module';
export default {
  namespace: 'module',

  state: {
    data: {
      list: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0 
      },
    },
  },
  effects: {
    *query({ payload, onSuccess, onComplete }, { select, call, put }) {
      let { data } = yield select(state => state.role);
      let { current, pageSize } = data.pagination;
      const response = yield call(service_module.query, { draw:current, limit:pageSize, ...payload });
      // console.log(response)
      if (response) {
        yield put({
          type: 'save',
          payload: {
            data: {
              list: response.data,
              pagination: {
                current: 1,
                pageSize: 10,
                total: 100,
              },
            },
          },
        });
      }
    },
    *service({ payload, onSuccess, onComplete }, { select, call, put }) {
      const { service, params, data } = payload;
      const response = yield call(service_module[service], params, data);
      if (response) {
        if (onSuccess) yield onSuccess(response);
      }
      if (onComplete) yield onComplete();
    },
  },

  reducers: {
    save(state, action) {
      return { ...state, ...action.payload };
    },
  },
};
