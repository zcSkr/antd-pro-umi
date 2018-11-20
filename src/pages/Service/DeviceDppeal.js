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

import styles from '../Sys/RoleManage.less';

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

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {
        account: props.values.account,
        description: props.values.description,
        modules: '0',
      },
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],
    };

    this.formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const defaultFormValues = { state: 1 }
    if (isEmpty(nextProps.values)) {
      return { formVals: defaultFormValues }
    } else if (!isEqual(prevState.formVals, nextProps.values)) {
      return { formVals: { ...prevState.formVals, ...nextProps.values } }
    }
    return null;
    return null;
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
    const { form, roleList } = this.props;
    roleList.forEach(item => {
      item.value = item.id
      item.label = item.roleName
    })
    return [
      <FormItem key="account" hasFeedback {...this.formLayout} label="登录账号">
        {form.getFieldDecorator('account', {
          rules: [{ required: true, message: '请输入登录账号！' }],
          initialValue: formVals.account,
        })(<Input placeholder="请输入昵称" />)}
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
      <FormItem key="role" {...this.formLayout} label="角色">
        {form.getFieldDecorator('roleIds', {
          rules: [{ required: true, message: '请选择角色！' }],
          initialValue: formVals.roleIds ? formVals.roleIds.split(',') : [],
        })(<CheckboxGroup options={roleList} />)}
      </FormItem>
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return (
      <div style={{ textAlign: 'center' }}>
        {/* <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
          取消
    </Button> */}
        <Button key="forward" type="primary" onClick={this.handleConfirm}>
          提交
        </Button>
      </div>
    );
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title={isEmpty(this.props.values) ? '添加厂家' : '编辑厂家'}
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => handleUpdateModalVisible()}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ role, manager, loading }) => ({
  role,
  manager,
  loading: loading.effects['role/query'],
}))
@Form.create()
export default class DeviceDppeal extends PureComponent {
  state = {
    updateModalVisible: false,
    selectedRows: [],
    expandForm: false,
    formValues: {},
    stepFormValues: {},
    roleList: [],
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
      width: 200,
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


  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

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
    const { selectedRows, updateModalVisible, stepFormValues, roleList, directoryModalVisible, directoryFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    const MyIcon = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_900467_07qyp7gznw9p.js', // 在 iconfont.cn 上生成
    });

    return (
      <PageHeaderWrapper title="设备申诉">
        {/* <MyIcon type="icon-wahaha" style={{fontSize: 40}} /> */}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
                添加厂家
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
              </div> */}
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
          </div>
        </Card>
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          roleList={roleList}
        />
      </PageHeaderWrapper>
    );
  }
}
