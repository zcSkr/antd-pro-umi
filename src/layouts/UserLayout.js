import React, { Fragment } from 'react';
import Link from 'umi/link';
import { Icon } from 'antd';
import DocumentTitle from 'react-document-title';
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
      <DocumentTitle title="当家师">
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>当家师后台管理系统</span>
                </Link>
              </div>
              <div className={styles.desc}></div>
            </div>
            {children}
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
