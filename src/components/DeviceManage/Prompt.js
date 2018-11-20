import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
} from 'antd';
const { TextArea } = Input;
import { isEqual, isEmpty } from 'underscore';

const FormItem = Form.Item;

@Form.create()
export default class Prompt extends PureComponent {
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
      <FormItem key="title" {...this.formLayout} label="电压异常标题">
        {form.getFieldDecorator('title', {
        })(<Input placeholder="请输入电压异常标题" maxLength="10" />)}
      </FormItem>,
      <FormItem key="prompt" {...this.formLayout} label="电压异常提示">
        {form.getFieldDecorator('prompt', {
        })(<TextArea rows={4} placeholder="请输入电压异常提示" />)}
      </FormItem>,
      <FormItem key="title1" {...this.formLayout} label="通讯异常标题">
        {form.getFieldDecorator('title', {
        })(<Input placeholder="请输入通讯异常标题" maxLength="10" />)}
      </FormItem>,
      <FormItem key="prompt1" {...this.formLayout} label="通讯异常提示">
        {form.getFieldDecorator('prompt', {
        })(<TextArea rows={4} placeholder="请输入通讯异常提示" />)}
      </FormItem>,
      <FormItem key="title2" {...this.formLayout} label="压缩机异常标题">
        {form.getFieldDecorator('title', {
        })(<Input placeholder="请输入压缩机异常标题" maxLength="10" />)}
      </FormItem>,
      <FormItem key="prompt2" {...this.formLayout} label="压缩机异常提示">
        {form.getFieldDecorator('prompt', {
        })(<TextArea rows={4} placeholder="请输入压缩机异常提示" />)}
      </FormItem>,
      <FormItem key="title3" {...this.formLayout} label="风机异常标题">
        {form.getFieldDecorator('title', {
        })(<Input placeholder="请输入风机异常标题" maxLength="10" />)}
      </FormItem>,
      <FormItem key="prompt3" {...this.formLayout} label="风机异常提示">
        {form.getFieldDecorator('prompt', {
        })(<TextArea rows={4} placeholder="请输入风机异常提示" />)}
      </FormItem>,
      <FormItem key="title4" {...this.formLayout} label="散热异常标题">
        {form.getFieldDecorator('title', {
        })(<Input placeholder="请输入散热异常标题" maxLength="10" />)}
      </FormItem>,
      <FormItem key="prompt4" {...this.formLayout} label="散热异常提示">
        {form.getFieldDecorator('prompt', {
        })(<TextArea rows={4} placeholder="请输入散热异常提示" />)}
      </FormItem>,
      <FormItem key="title5" {...this.formLayout} label="制冷异常标题">
        {form.getFieldDecorator('title', {
        })(<Input placeholder="请输入制冷异常标题" maxLength="10" />)}
      </FormItem>,
      <FormItem key="prompt5" {...this.formLayout} label="制冷异常提示">
        {form.getFieldDecorator('prompt', {
        })(<TextArea rows={4} placeholder="请输入制冷异常提示" />)}
      </FormItem>,
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
    const { promptVisible, handleVisibleModal } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title="设置提示"
        visible={promptVisible}
        footer={this.renderFooter()}
        onCancel={() => handleVisibleModal('prompt')}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}
