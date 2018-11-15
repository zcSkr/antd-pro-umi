import request from '@/utils/request';
import qs from 'qs';

export async function login(params) {
  return request(`http://182.140.221.130:8080/yixian/login/pcLogin.do?${qs.stringify(params)}`, { mode: 'cors' });
}

