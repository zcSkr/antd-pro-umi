import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import router from 'umi/router';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';
import UpdatePsd from '@/components/UpdatePsd/UpdatePsd';
import app from '@/config/app';
const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
    psdModalVisible: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(`${formatMessage({ id: 'component.noticeIcon.cleared' })} ${formatMessage({ id: `component.globalHeader.${type}` })}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'updatePsd') {
      this.setState({psdModalVisible: true})
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  handlePsdModal = (flag, record) => {
    this.setState({
      psdModalVisible: !!flag,
    });
  }

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
          this.scrollTop = scrollTop;
          return;
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
    this.ticking = false;
  };

  render() {
    const { isMobile, handleMenuCollapse, setting } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            {...this.props}
          />
        )}
      </Header>
    ) : null;
    return [
      <Animate key="Animate" component="" transitionName="fade">
        {HeaderDom}
      </Animate>,
      <UpdatePsd
          key="UpdatePsd"
          handlePsdModal={this.handlePsdModal}
          psdModalVisible={this.state.psdModalVisible}
      />
    ];
  }
}

export default connect(({ user, global, setting, loading }) => ({
  currentUser: app.getUnionuser(),
  collapsed: global.collapsed,
  setting,
}))(HeaderView);
