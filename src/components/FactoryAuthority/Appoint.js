import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Select,
  InputNumber,
} from 'antd';
import { isEqual, isEmpty } from 'underscore';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;

@Form.create()
export default class Appoint extends PureComponent {
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

  renderContent = (formVals) => {
    const { form } = this.props;
    return (
      <FormItem key="title" {...this.formLayout} label="商家">
        {form.getFieldDecorator('title')(
          <Select placeholder="请选择商家" style={{width:'100%'}}>
            <Option value={0}>商家一</Option>
            <Option value={1}>商家二</Option>
          </Select>
        )}
      </FormItem>
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
    const { appointVisible, handleVisibleModal } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title="设备指派"
        visible={appointVisible}
        footer={this.renderFooter()}
        onCancel={() => handleVisibleModal('appoint')}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}
