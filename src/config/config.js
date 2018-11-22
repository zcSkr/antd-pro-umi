export default {
  baseRoute: '', //平台基础路由
  rootUrl: 'http://182.140.221.130:8080', //http://localhost:8040    https://ceshi.conpanda.cn
  logo: 'http://via.placeholder.com/256x256',
  version: '1.0.0', //版本
  description: '', //说明
  loginRoute: '/user/login', //登录路由
  getToken: function() {
    return localStorage.token ? localStorage.token : null;
  },
  setToken: function(token) {
    localStorage.token = token;
  },
  getUnionuser: function() {
    try {
      return localStorage.unionuser ? JSON.parse(localStorage.unionuser) : null;
    } catch (ex) {
      return null;
    }
  },
  setUnionuser: function(unionuser) {
    localStorage.unionuser = JSON.stringify(unionuser);
  }
};