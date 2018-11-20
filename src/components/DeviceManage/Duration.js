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
export default class Duration extends PureComponent {
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
      <FormItem key="title" {...this.formLayout} label="厂家时长类型">
        {form.getFieldDecorator('title', {
          initialValue: 0
        })(
          <Select style={{ width: 360 }}>
            <Option value={0}>以小时计</Option>
            <Option value={1}>无限时间</Option>
          </Select>
        )}
      </FormItem>,
      <FormItem key="duration" {...this.formLayout} label="厂家时长">
        <InputGroup compact style={{ paddingTop: 4 }}>
          <InputNumber min={0} style={{ width: 300, textAlign: 'center' }} placeholder="请输入" />
          <Input style={{ width: 60, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="小时" disabled />
        </InputGroup>
      </FormItem>
    ];
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
    const { durationVisible, handleVisibleModal } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title="设置时长"
        visible={durationVisible}
        footer={this.renderFooter()}
        onCancel={() => handleVisibleModal('duration')}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}
