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
const { RangePicker } = DatePicker;
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isEqual, isEmpty } from 'underscore';

import styles from '../Table.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TreeNode = Tree.TreeNode;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const statusMap = ['success', 'error'];
const status = ['启用', '冻结'];

/* eslint react/no-multi-comp:0 */
@connect(({ role, manager, loading }) => ({
  role,
  manager,
  loading: loading.effects['role/query'],
}))
@Form.create()
export default class DeviceDppeal extends PureComponent {
  state = {
    expandForm: false,
    formValues: {},
  };

  columns = [
    {
      title: '序号',
      key: 'index',
      width: "10%",
      render: (val, record, index) => index + 1,
    },
    {
      title: '用户账号',
      dataIndex: 'account',
      width: "15%",
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      width: '15%',
    },
    {
      title: '设备编号',
      dataIndex: 'password',
      width: '15%',
    },
    {
      title: '设备串号',
      dataIndex: 'userType',
      width: "15%",
    },
    {
      title: '处理情况',
      dataIndex: 'state',
      width: "15%",
      render: val => <Badge status={statusMap[val]} text={status[val]} />
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: "20%",
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      render: (text, record) => (
        <div style={{ minWidth: 100 }}>
          <Popconfirm title="确定处理?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <Tag color="#108ee9" style={{ margin: 0 }}>处理</Tag>
          </Popconfirm>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <Tag color="#f50" style={{ margin: 0 }}>删除</Tag>
          </Popconfirm>
        </div>
      ),
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({ type: 'manager/query' });
  };

  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        // updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'manager/query',
        payload: {
          account: values.account,
          nickName: values.nickName,
          draw: 1,
          length: 10,
          userType: 'admin'
        },
      });
    });
  };

  toggleForm = () => {
    const { expandForm } = this.state;
    this.setState({
      expandForm: !expandForm,
    });
  };
  renderSimpleForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户账号">
              {getFieldDecorator('account')(<Input placeholder="请输入用户账号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('deviceNo')(<Input placeholder="请输入设备编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
              <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                展开 <Icon type="down" />
              </a>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  renderAdvancedForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="用户账号">
              {getFieldDecorator('account')(<Input placeholder="请输入用户账号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('deviceNo')(<Input placeholder="请输入设备编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="处理情况">
              {getFieldDecorator('state')(
                <Select placeholder='不限'>
                  <Option value={0}>未处理</Option>
                  <Option value={3}>同意</Option>
                  <Option value={4}>拒绝</Option>
                </Select>
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={16} sm={24}>
            <FormItem label="反馈时间">
              {getFieldDecorator('account')(
                <RangePicker
                  style={{ width: '100%' }}
                  showTime={{ format: 'HH:mm' }}
                  format="YYYY-MM-DD HH:mm"
                  placeholder={['Start Time', 'End Time']}
                // onChange={onChange}
                // onOk={onOk}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
            <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
              收起 <Icon type="up" />
            </a>
          </div>
        </div>
      </Form>
    );
  }
  renderForm() {
    const { expandForm } = this.state;
    return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    const {
      manager: { data: { list, pagination } },
      loading,
    } = this.props;
    return (
      <PageHeaderWrapper title="设备申诉">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              loading={loading}
              list={list}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}
