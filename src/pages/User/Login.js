import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import app from '@/config/app';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends PureComponent {
  state = {};

  handleSubmit = (err, values) => {
    console.log(err, values)
    if (!err) {
      const { dispatch } = this.props;
      dispatch({ 
        type: 'login/login',
        payload: values
      })
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey='account'
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab="账户密码登录">
            {login.status === 'error' &&
              !submitting &&
              this.renderMessage('账号/密码错误')}
            <UserName 
              name="account" 
              placeholder="用户名"
              rules={[{ required: true, message: '请输入用户名！' }]}
            />
            <Password
              name="password"
              placeholder="密码"
              rules={[{ required: true, message: '请输入密码！' }]}
              onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
            />
          </Tab>
          <Submit loading={submitting}>
            登录
          </Submit>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
