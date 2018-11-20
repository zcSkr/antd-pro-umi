import React, { Fragment } from 'react';
// import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import { Icon } from 'antd';

import styles from './UserLayout.less';
import logo from '../assets/logo.svg';


class UserLayout extends React.PureComponent {
  // @TODO title
  // getPageTitle() {
  //   const { routerData, location } = this.props;
  //   const { pathname } = location;
  //   let title = '当家师';
  //   if (routerData[pathname] && routerData[pathname].name) {
  //     title = `${routerData[pathname].name} - 当家师`;
  //   }
  //   return title;
  // }

  render() {
    const { children } = this.props;
    return (
      // @TODO <DocumentTitle title={this.getPageTitle()}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <Link to="/">
                <img alt="logo" className={styles.logo} src={logo} />
                <span className={styles.title}>当家师后台管理系统</span>
              </Link>
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }
}

export default UserLayout;
