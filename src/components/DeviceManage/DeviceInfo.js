import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  Divider,
  Row,
  Col,
  Icon,
} from 'antd';
import { isEqual, isEmpty } from 'underscore';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

@Form.create()
export default class DeviceInfo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
    };

    this.formLayout = {
      labelCol: { span: 5 },
      wrapperCol: { span: 16 },
    };
  }
  handleConfirm = () => {
    const { form } = this.props;
    const { formVals } = this.state
    form.validateFields((err, fieldsValue) => {
      // console.log(err, fieldsValue)
      if (err) return;
      this.setState({ formVals: { ...fieldsValue } });
    });
  }
  handleRefresh = () => {
    console.log('refresh')
  }

  renderContent = (formVals) => {
    const { form } = this.props;
    return (
      <Fragment>
        <Icon onClick={this.handleRefresh} type="reload" style={{ fontSize: 20, cursor: 'pointer' }} />
        <Divider>基本信息</Divider>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="space-between" style={{marginBottom: 10}}>
          <Col span={6}>总时长:&nbsp;200小时</Col>
          <Col span={6}>本次时长:&nbsp;10小时</Col>
          <Col span={6}>现场操作:&nbsp;<span style={{ color: '#f5222d' }}>锁定</span></Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="space-between">
          <Col span={6}>电压偏低:&nbsp;<span style={{ color: '#ffc53d' }}>AC160V</span></Col>
          <Col span={6}>通信方式:&nbsp;wifi</Col>
          <Col span={6}>设备信号:&nbsp;<span style={{ color: '#a0d911' }}>高</span></Col>
        </Row>
        <Divider>主机一</Divider>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="space-between" style={{marginBottom: 10}}>
          <Col span={6}>开机状态:&nbsp;<span style={{ color: '#a0d911' }}>压缩机正常</span></Col>
          <Col span={6}>压缩机:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
          <Col span={6}>风机散热:&nbsp;<span style={{ color: '#f5222d' }}>异常</span></Col>
          <Col span={6}>散热状态:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }} type="flex" justify="space-between">
          <Col span={12}>制冷系统:&nbsp;<span style={{ color: '#096dd9' }}>-38.8℃</span><span style={{ color: '#a0d911',marginLeft: 20 }}>正常</span></Col>
        </Row>
        <Divider>备注</Divider>
        <Row>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viverra justo commodo. Proin sodales pulvinar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulputate, felis tellus mollis orci, sed rhoncus sapien nunc eget.</Row>
        <Divider>封面</Divider>
        <Row>
          <img src="https://svn.ccyskj.com/svn/ccys/trunk/product/HTML/product/%E5%BD%93%E5%AE%B6%E5%B8%88/images/%E8%AE%BE%E5%A4%87%E8%AF%A6%E6%83%85_1/u2072.jpg" alt="" style={{maxWidth: '100%'}} />
        </Row>
      </Fragment>
    );
  };

  renderFooter = () => {
    return (
      <div style={{ textAlign: 'center' }}>
        <Button key="forward" type="primary" onClick={this.handleConfirm}>
          提交
        </Button>
      </div>
    );
  };

  render() {
    const { infoVisible, handleVisibleModal } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={700}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        // title="设备详情"
        visible={infoVisible}
        footer={null}
        onCancel={() => handleVisibleModal('info')}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}
