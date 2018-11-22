import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
} from 'antd';
import { isEqual, isEmpty } from 'underscore';

const FormItem = Form.Item;

@Form.create()
export default class UpdatePsd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
    };

    this.formLayout = {
      labelCol: { span: 6 },
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

  renderContent = (formVals) => {
    const { form } = this.props;
    return [
      <FormItem key="password" hasFeedback {...this.formLayout} label="新密码">
        {form.getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入新密码！' }],
        })(<Input placeholder="请输入新密码！" />)}
      </FormItem>,
      <FormItem key="againPsd" hasFeedback {...this.formLayout} label="确认密码">
        {form.getFieldDecorator('againPsd', {
          rules: [{ required: true, message: '请输入确认密码！' }],
        })(<Input placeholder="请输入确认密码" />)}
      </FormItem>
    ];
  };

  renderFooter = () => {
    const { handlePsdModal } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Button key="cancel" onClick={() => handlePsdModal()}>
          取消
    </Button> */}
        <Button key="forward" type="primary" onClick={this.handleConfirm}>
          提交
        </Button>
      </div>
    );
  };

  render() {
    const { psdModalVisible, handlePsdModal } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title="修改密码"
        visible={psdModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handlePsdModal()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}
