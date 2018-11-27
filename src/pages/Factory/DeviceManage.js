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
import UploadImg from '@/components/UploadImg/UpLoadImg';
import Prompt from '@/components/DeviceManage/Prompt';
import Settings from '@/components/DeviceManage/Settings';
import Duration from '@/components/FactoryAuthority/Duration';
import DeviceInfo from '@/components/DeviceManage/DeviceInfo';
import Appoint from '@/components/FactoryAuthority/Appoint';
import HistoryWarn from '@/pages/Device/HistoryWarn';
import OperationRecord from '@/pages/Device/OperationRecord';
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

@Form.create()
class UpdateForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      selectedKeys: [],

      fileList: [],
    };

    this.formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return { formVals: { ...nextProps.values, ...prevState.formVals } }
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

  handleUpLoadChange = ({ file, fileList, event }) => {
    this.setState({ fileList: fileList.filter(item => item) })
  }
  beforeUpload = (file, fileList) => {
    // console.log(fileList, 'before')
    if (fileList.length + this.state.fileList.length > this.state.totalNum) {
      message.warning('图片不能超过6张')
      return false
    }
    return true
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ fileList: arrayMove(this.state.fileList, oldIndex, newIndex) });
  }

  renderContent = (formVals) => {
    const { form } = this.props;
    return [
      <FormItem key="deviceNo" {...this.formLayout} label="设备编号">
        456464556
      </FormItem>,
      <FormItem key="deviceIMEI" {...this.formLayout} label="设备串号">
        48789
      </FormItem>,
      <FormItem key="duration" {...this.formLayout} label="使用时长">
        66
      </FormItem>,
      <FormItem key="deviceNickname" {...this.formLayout} label="设备别名">
        {form.getFieldDecorator('deviceNickname', {
          initialValue: formVals.deviceNickname,
        })(<Input placeholder="请输入设备别名" />)}
      </FormItem>,
      <FormItem key="warranty" {...this.formLayout} label="保修期至">
        {form.getFieldDecorator('warranty', {
          initialValue: formVals.warranty,
        })(
          <DatePicker
            style={{ width: '100%' }}
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            placeholder="请选择保修期"
          // onChange={onChange}
          // onOk={onOk}
          />
        )}
      </FormItem>,
      <FormItem key="img" {...this.formLayout} label="封面图片">
        {form.getFieldDecorator('state', {
          initialValue: formVals.img || 1,
        })(
          <UploadImg
            action="//jsonplaceholder.typicode.com/posts/"
            totalNum={1}
            multiple={false}
            supportSort={true}
            fileList={this.state.fileList}
            beforeUpload={this.beforeUpload}
            onChange={this.handleUpLoadChange}
            onSortEnd={this.onSortEnd}
          />
        )}
      </FormItem>,
      <FormItem key="title" {...this.formLayout} label="保修标题">
        {form.getFieldDecorator('title', {
          initialValue: formVals.title,
        })(<Input placeholder="请输入保修标题" />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="保修说明">
        {form.getFieldDecorator('desc', {
          initialValue: formVals.desc,
        })(<TextArea rows={4} placeholder="请输入保修说明" />)}
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
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title='编辑设备'
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => { this.setState({ formVals: {} }); handleUpdateModalVisible() }}
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
export default class DeviceManage extends PureComponent {
  state = {
    updateModalVisible: false,
    selectedRows: [],
    expandForm: false,
    formValues: {},
    stepFormValues: {},
    roleList: [],

    promptVisible: false,
    durationVisible: false,
    appointVisible: false,
    settingsVisible: false,

    infoVisible: false,
    historyVisible: false,
    recordVisible: false,
  };

  columns = [
    {
      title: '序号',
      key: 'index',
      width: "10%",
      render: (val, record, index) => index + 1,
    },
    {
      title: '设备编号',
      key: 0,
      dataIndex: 'nickname',
      width: '10%',
    },
    {
      title: '设备串号',
      dataIndex: 'userType',
      width: "10%",
    },
    {
      title: '设备别名',
      key: 1,
      dataIndex: 'nickname',
      width: '10%',
    },
    {
      title: '是否激活',
      dataIndex: 'state',
      width: "10%",
      render: val => <Badge status={statusMap[val]} text={status[val]} />
    },
    {
      title: '所属商家',
      key: 3,
      dataIndex: 'nickname',
      width: '10%',
    },
    {
      title: '认领人',
      key: 4,
      dataIndex: 'nickname',
      width: '10%',
    },
    {
      title: '商家时长',
      key: 6,
      dataIndex: 'state',
      width: "10%",
    },
    {
      title: '用户到期',
      key: 7,
      dataIndex: 'createTime',
      width: "20%",
      render: val => <div style={{ width: 72 }}>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '激活日期',
      key: 8,
      dataIndex: 'createTime',
      width: "20%",
      render: val => <div style={{ width: 72 }}>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '创建时间',
      key: 9,
      dataIndex: 'createTime',
      width: "20%",
      render: val => <div style={{ width: 72 }}>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</div>,
    },
    {
      title: '操作',
      fixed: 'right',
      render: (text, record) => {
        const menu = (
          <Menu onClick={this.handleActionClick.bind(this, record)} style={{textAlign: 'center'}} selectedKeys={[]}>
            <Menu.Item key="info">详情</Menu.Item>
            <Menu.Item key="history">历史报警</Menu.Item>
            <Menu.Item key="record">操作记录</Menu.Item>
          </Menu>
        );
        return (
          <div style={{ minWidth: 190 }}>
            <Tag color="#108ee9" style={{ margin: 0 }} onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</Tag>
            <Divider type="vertical" />
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
              <Tag color="#f50" style={{ margin: 0 }}>删除</Tag>
            </Popconfirm>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a>
                更多操作 <Icon type="down" />
              </a>
            </Dropdown>
          </div>
        )
      },
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

  handleActionClick = (record, e) => {
    switch (e.key) {
      case 'info':
        this.setState({ infoVisible: true })
        break;
      case 'history':
        this.setState({ historyVisible: true })
        break;
      case 'record':
        this.setState({ recordVisible: true })
        break;
      default:
        break;
    }
  }
  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;
    switch (e.key) {
      case 'prompt':
        this.setState({ promptVisible: true })
        break;
      case 'duration':
        this.setState({ durationVisible: true })
        break;
      case 'appoint':
        this.setState({ appointVisible: true })
        break;
      case 'settings':
        this.setState({ settingsVisible: true })
        break;
      default:
        break;
    }
  };

  handleVisibleModal = (type) => {
    const { dispatch } = this.props;
    switch (type) {
      case 'prompt':
        this.setState({ promptVisible: false })
        break;
      case 'duration':
        this.setState({ durationVisible: false })
        break;
      case 'appoint':
        this.setState({ appointVisible: false })
        break;
      case 'settings':
        this.setState({ settingsVisible: false })
        break;
      case 'info':
        this.setState({ infoVisible: false })
        break;
      case 'history':
        this.setState({ historyVisible: false })
        break;
      case 'record':
        this.setState({ recordVisible: false })
        break;

      default:
        break;
    }
  }

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
            <FormItem label="设备编号">
              {getFieldDecorator('deviceNo')(<Input placeholder="请输入设备编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备别名">
              {getFieldDecorator('deviceNickname')(<Input placeholder="请输入设备别名" />)}
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
            <FormItem label="设备编号">
              {getFieldDecorator('deviceNo')(<Input placeholder="请输入设备编号" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="设备别名">
              {getFieldDecorator('deviceNickname')(<Input placeholder="请输入设备别名" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="用户电话">
              {getFieldDecorator('phone')(<Input placeholder="请输入用户电话" />)}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="所属商家">
              {getFieldDecorator('merchant')(
                <Select placeholder='不限'>
                  <Option value={1}>商家一</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否激活">
              {getFieldDecorator('isActive')(
                <Select placeholder='不限'>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="是否认领">
              {getFieldDecorator('state')(
                <Select placeholder='不限'>
                  <Option value={1}>是</Option>
                  <Option value={0}>否</Option>
                </Select>
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
    const { selectedRows, updateModalVisible, stepFormValues } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="prompt">设置提示</Menu.Item>
        <Menu.Item key="duration">设置时长</Menu.Item>
        <Menu.Item key="appoint">设备指派</Menu.Item>
        <Menu.Item key="settings">设备设置</Menu.Item>
      </Menu>
    );

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              {selectedRows.length > 0 && (
                <span>
                  <Popconfirm title="确定解除?" onConfirm={() => console.log('确定')} okText="确定" cancelText="取消">
                    <Button>解除认领</Button>
                  </Popconfirm>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <StandardTable
              isCheckBox={true}
              scroll={{ x: 1300 }}
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
        />
        <Prompt
          promptVisible={this.state.promptVisible}
          handleVisibleModal={this.handleVisibleModal}
        />
        <Settings
          settingsVisible={this.state.settingsVisible}
          handleVisibleModal={this.handleVisibleModal}
          factoryAuthority={true}
        />
        <Duration
          durationVisible={this.state.durationVisible}
          handleVisibleModal={this.handleVisibleModal}
        />
        <Appoint
          appointVisible={this.state.appointVisible}
          handleVisibleModal={this.handleVisibleModal}
        />
        <DeviceInfo
          infoVisible={this.state.infoVisible}
          handleVisibleModal={this.handleVisibleModal}
        />
        <HistoryWarn
          historyVisible={this.state.historyVisible}
          handleVisibleModal={this.handleVisibleModal}
        />
        <OperationRecord
          recordVisible={this.state.recordVisible}
          handleVisibleModal={this.handleVisibleModal}
        />
      </PageHeaderWrapper>
    );
  }
}
