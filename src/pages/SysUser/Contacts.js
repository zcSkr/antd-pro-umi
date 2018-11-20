import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Popconfirm,
  Tree,
  Tag,
  Spin,
  Switch,
  Checkbox,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isEqual, isEmpty } from 'underscore';

import styles from '../Sys/RoleManage.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;

/* eslint react/no-multi-comp:0 */
@connect(({ role, manager, loading }) => ({
  role,
  manager,
  loading: loading.effects['role/query'],
}))
@Form.create()
export default class Contacts extends PureComponent {
  state = {
    selectedRows: [],
    directoryModalVisible: false,
    dataDicRecord: {},
  };

  columns = [
    {
      title: '序号',
      key: 'index',
      width: "10%",
      render: (val, record, index) => index + 1,
    },
    {
      title: '名称',
      dataIndex: 'account',
      width: "45%",
    },
    {
      title: '电话',
      dataIndex: 'nickname',
      width: '45%',
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'manager/query' });
  }

  handleDeleteRecord(record) {
    console.log(record)
    const { dispatch } = this.props
    dispatch({
      type: 'role/service',
      payload: {
        service: 'remove',
        data: { id: record.id }
      },
      onSuccess: res => {
        console.log(res)
        if (res.resultState == '1') {
          dispatch({ type: 'manager/query' })
          message.success(res.msg);
        } else {
          message.error(res.msg);
        }
      }
    })

  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleDirectoryModal = (flag, record) => {
    this.setState({
      directoryModalVisible: !!flag,
      dataDicRecord: record || {},
    });
  }

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/add',
      payload: {
        desc: fields.desc,
      },
    });

    message.success('添加成功');
    this.handleModalVisible();
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });

    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  renderForm() {
    const { record } = this.props;
    // console.log(record, 666)
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={24} sm={24}>
          <div style={{ textAlign: 'center', fontSize: 26 }}>通讯录</div>
        </Col>
      </Row>
    );
  }
  renderContent = (formVals) => {
    const { form } = this.props;
    return [
      <FormItem key="account" hasFeedback {...this.formLayout} label="登录账号">
        {form.getFieldDecorator('account', {
          rules: [{ required: true, message: '请输入登录账号！' }],
          initialValue: formVals.account,
        })(<Input placeholder="请输入角色名称" />)}
      </FormItem>,
      <FormItem key="nickname" hasFeedback {...this.formLayout} label="昵称">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: true, message: '请输入昵称！' }],
          initialValue: formVals.nickname,
        })(<Input placeholder="请输入昵称" />)}
      </FormItem>,
      <FormItem key="state" {...this.formLayout} label="状态">
        {form.getFieldDecorator('state', {
          initialValue: formVals.state || 1,
        })(
          <Select style={{ width: '100%' }}>
            <Option value={1}>启用</Option>
            <Option value={0}>冻结</Option>
          </Select>
        )}
      </FormItem>,
    ];
  };
  render() {
    const {
      manager: { data: { list, pagination } },
      loading,
    } = this.props;
    const { selectedRows, updateModalVisible, stepFormValues } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <Modal
        width={640}
        // destroyOnClose
        title="通讯录"
        centered
        visible={this.props.directoryModalVisible}
        footer={null}
        onCancel={() => this.props.handleDirectoryModal()}
      >
        <StandardTable
          isCheckBox={false}
          selectedRows={selectedRows}
          loading={loading}
          list={list}
          pagination={pagination}
          columns={this.columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}
