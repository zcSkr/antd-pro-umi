import React from 'react';
import { Layout, Tabs } from 'antd';
import DocumentTitle from 'react-document-title';
import { isEqual } from 'lodash';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
// import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';
import { routerRedux } from 'dva/router';
import underscore from 'underscore';
const { Content } = Layout;
const { TabPane } = Tabs;
// Conversion router to menu.
function formatter(data, parentAuthority, parentName) {
  // console.log(data, parentAuthority, parentName)
  return data
    .map(item => {
      // let locale = 'menu';
      // if (parentName && item.name) {
      //   locale = `${parentName}.${item.name}`;
      // } else if (item.name) {
      //   // locale = `menu.${item.name}`;
      //   locale = item.name
      // } else if (parentName) {
      //   locale = parentName;
      // }
      if (item.path) {
        const result = {
          ...item,
          // locale,
          authority: item.authority || parentAuthority,
        };
        if (item.routes) {
          // const children = formatter(item.routes, item.authority,locale);
          const children = formatter(item.routes, item.authority);
          // Reduce memory usage
          result.children = children;
        }
        // console.log(result)
        // delete result.routes;
        return result;
      }

      return null;
    })
    .filter(item => item);
}

const memoizeOneFormatter = memoizeOne(formatter, isEqual);

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
@connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))
class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    this.newTabIndex = 0;
    const panes = [
      { title: '首页', content: 'Content of Tab Pane 0', key: '/' },
      // { title: '系统管理', content: 'Content of Tab Pane 2', key: '2' },
      // { title: 'Tab 3', content: 'Content of Tab Pane 3', key: '3' },
      // { title: 'Tab 4', content: 'Content of Tab Pane 4', key: '4' },
      // { title: 'Tab 5', content: 'Content of Tab Pane 5', key: '5' },
      // { title: 'Tab 6', content: 'Content of Tab Pane 6', key: '6' },
      // { title: 'Tab 7', content: 'Content of Tab Pane 7', key: '7' },
      // { title: 'Tab 8', content: 'Content of Tab Pane 8', key: '8' },
      // { title: 'Tab 9', content: 'Content of Tab Pane 9', key: '9' },
      // { title: 'Tab 10', content: 'Content of Tab Pane 10', key: '10' },
      // { title: 'Tab 11', content: 'Content of Tab Pane 11', key: '11' },
      // { title: 'Tab 12', content: 'Content of Tab Pane 12', key: '12' },
      // { title: 'Tab 13', content: 'Content of Tab Pane 13', key: '13' },
      // { title: 'Tab 14', content: 'Content of Tab Pane 14', key: '14' },
    ];
    this.state = {
      activeKey: panes[0] ? panes[0].key : '',
      panes,
      rendering: true,
      isMobile: false,
      menuData: this.getMenuData(),
    };
  }

  // state = {
  //   rendering: true,
  //   isMobile: false,
  //   menuData: this.getMenuData(),
  // };
  handleMenuClick = ({ item, key, keyPath }) => {
    const { panes } = this.state;
   
    // const name = formatMessage({ id: 'menu' + key.replace(/\//g, '.') })
    const name = 'haha'
    console.log(key,name)
    // console.log(panes)
    var stooge = {name: 'moe', age: 32};
    let isExist = false
    panes.map(item => {
      // console.log(underscore.isEqual(item, { title: name, content: '', key: key }))
      if (underscore.isEqual(item, { title: name, content: '', key: key })) {
        isExist = true
        return;
      }
    })
    // console.log(isExist)
    if(!isExist) {
      panes.push({ title: name, content: '', key: key })
    }
    this.setState({ panes,activeKey: key });
    // console.log(includes(panes,{ title: name, content: '', key: key }))
    // console.log(includes([1,2,3],4))
    // panes.push({ title: name, content: '', key: key });
    // this.setState({ panes, activeKey: key });
    // if(indexOf(panes,{ title: name, content: '', key: key }) === -1){
    //   panes.push({ title: name, content: '', key: key });
    //   this.setState({ panes, activeKey: key });
    //   console.log(name,key)
    // }
  }
  onChange = key => {
    this.setState({ activeKey: key });
    if(this.state.activeKey !== key) {
      this.props.dispatch(routerRedux.push(key))
    }
  };
  onEdit = (targetKey, action) => {
    this[action](targetKey);
  }
  // add = () => {
  //   const panes = this.state.panes;
  //   const activeKey = `newTab${this.newTabIndex++}`;
  //   panes.push({ title: 'New Tab', content: 'New Tab Pane', key: activeKey });
  //   this.setState({ panes, activeKey });
  // }
  remove = (targetKey) => {
    let activeKey = this.state.activeKey;
    let lastIndex;
    this.state.panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1;
      }
    });
    const panes = this.state.panes.filter(pane => pane.key !== targetKey);
    if (lastIndex >= 0 && activeKey === targetKey) {
      activeKey = panes[lastIndex].key;
    }
    this.setState({ panes, activeKey });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(preProps) {
    // After changing to phone mode,
    // if collapsed is true, you need to click twice to display
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
    const { isMobile } = this.state;
    const { collapsed } = this.props;
    if (isMobile && !preProps.isMobile && !collapsed) {
      this.handleMenuCollapse(false);
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    // console.log(memoizeOneFormatter(routes))
    // let arr = memoizeOneFormatter(routes)
    return memoizeOneFormatter(routes);
  }
  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    // console.log(routerMap)
    return routerMap;
  }

  matchParamsPath = pathname => {
    const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
      pathToRegexp(key).test(pathname)
    );
    return this.breadcrumbNameMap[pathKey];
  };

  getPageTitle = pathname => {
    const currRouterData = this.matchParamsPath(pathname);

    if (!currRouterData) {
      return '当家师';
    }
    // const message = formatMessage({
    //   id: currRouterData.locale || currRouterData.name,
    //   defaultMessage: currRouterData.name,
    // });
    const message = currRouterData.name
    return `${message} - 当家师`;
  };

  getLayoutStyle = () => {
    const { isMobile } = this.state;
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
      // paddingTop: fixedHeader ? 64 + 56 - 24 : 0,
      overFlowY: 'auto'
    };
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };
  renderSettingDrawer() {
    // Do not render SettingDrawer in production
    // unless it is deployed in preview.pro.ant.design as demo
    const { rendering } = this.state;
    if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  }

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
    } = this.props;
    const { isMobile, menuData } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const routerConfig = this.matchParamsPath(pathname);
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            onClick={this.handleMenuClick}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            {...this.props}
          />
          {/* <Tabs
            style={{ background: '#fff', position: 'fixed', top: 64, right: 0, zIndex: 9 }}
            hideAdd
            onChange={this.onChange}
            activeKey={this.state.activeKey}
            type="editable-card"
            onEdit={this.onEdit}
          >
            {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}></TabPane>)}
          </Tabs> */}
          <Content style={this.getContentStyle()}>
            <Authorized
              authority={routerConfig && routerConfig.authority}
              noMatch={<Exception403 />}
            >
              {children}
            </Authorized>
          </Content>
          {/* <Footer /> */}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}


export default BasicLayout