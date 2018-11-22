import request from '@/utils/request';
import qs from 'qs';

export async function query(params,data) {
  return request(`/yixian/sys/user/findListByLimitPage.do?${qs.stringify(params)}`, { mode: 'cors',  method: 'post', body: JSON.stringify(data), });
}
export async function create(params, data) {
  return request(`/adminapi/teach/classroom/add?${qs.stringify(params)}`, { mode: 'cors', method: 'post', body: JSON.stringify(data), });
}
export async function update(params, data) {
  return request(`/yixian/sys/user/changeEntity.do?${qs.stringify(params)}`, { mode: 'cors', method: 'post', body: JSON.stringify(data), });
}
export async function remove(params,data) {
  return request(`/yixian/sys/module/deleteEntity.do?${qs.stringify(params)}`, { mode: 'cors', method: 'post', body: JSON.stringify(data), });
}
export async function info(params) {
  return request(`/adminapi/teach/classroom/info?${qs.stringify(params)}`, { mode: 'cors' });
}
