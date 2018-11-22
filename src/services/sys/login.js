import request from '@/utils/request';
import qs from 'qs';

export async function login(params) {
  return request(`/yixian/login/pcLogin.do?${qs.stringify(params)}`, { mode: 'cors' });
}

