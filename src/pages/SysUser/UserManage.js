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
import Contacts from '@/pages/SysUser/Contacts';
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
export default class UserManage extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
    directoryModalVisible: false,
    directoryFormValues: {},
  };

  columns = [
    {
      title: '序号',
      key: 'index',
      width: "10%",
      render: (val, record, index) => index + 1,
    },
    {
      title: '登录账号',
      dataIndex: 'account',
      width: "15%",
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      width: '15%',
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: "15%",
      render: (text, record) => <Switch onChange={() => this.handleSwicthChange(record)} loading={record.loading} checkedChildren="启用" unCheckedChildren="冻结" checked={text ? true : false} />
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
        <div style={{ minWidth: 110 }}>
          <Tag color="#87d068" style={{ margin: 0 }} onClick={() => this.handleDirectoryModal(true, record)}>通讯录</Tag>
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
    //获取角色数据
    dispatch({
      type: 'role/service',
      payload: {
        service: 'query',
      },
      onSuccess: res => {
        if (res.resultState == '1') {
          this.setState({ roleList: res.data.data })
        }
      }
    });
  }
  handleSwicthChange = (record) => {
    console.log(record)
    let { manager: { data: { list } }, dispatch } = this.props;
    console.log(list)
    list.forEach(item => {
      if (isEqual(item, record)) {
        item.loading = true
        setTimeout(() => {
          list.forEach(item => {
            if (isEqual(item, record)) {
              item.loading = false
              item.state = item.state ? 0 : 1
              return;
            }
          })
          dispatch({ type: 'manager/save', payload: { list } })
        }, 1000)
        // dispatch({
        //   type: 'manager/service',
        //   payload: {
        //     service: 'update',
        //     data: {
        //       id: item.id,
        //       state: item.state ? 0 : 1
        //     },
        //   },
        //   onSuccess: res => {
        //     console.log(res)
        //   }
        // })
        return
      }
    })
    dispatch({ type: 'manager/save', payload: { list } })
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


  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            key: selectedRows.map(row => row.key),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
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

  
  handleDirectoryModal = (flag, record) => {
    this.setState({
      directoryModalVisible: !!flag,
      directoryFormValues: record || {},
    });
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="登录账号">
              {getFieldDecorator('account')(<Input placeholder="请输入登录账号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="昵称">
              {getFieldDecorator('nickName')(<Input placeholder="请输入昵称" />)}
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
            </span>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const {
      manager: { data: { list, pagination } },
      loading,
    } = this.props;
    const { selectedRows, directoryModalVisible, directoryFormValues } = this.state;

    const directoryMethods = {
      handleDirectoryModal: this.handleDirectoryModal,
    };
    return (
      <PageHeaderWrapper title="用户管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              list={list}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <Contacts
          {...directoryMethods}
          directoryModalVisible={directoryModalVisible}
          values={directoryFormValues}
        />
      </PageHeaderWrapper>
    );
  }
}
