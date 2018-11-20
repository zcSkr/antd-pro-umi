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
  Timeline,
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
    if (!isEqual(prevState.formVals, nextProps.values)) {
      prevState.formVals = nextProps.values
    }
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
    const { form } = this.props;
    return (
      <Timeline>
        <Timeline.Item color="green" >
          <Row><Col span={6}>2018-10-20 09:20:20</Col><Col span={6}><span style={{ color: '#a0d911' }}>正常</span></Col></Row>
          <Row>
            <Col span={8}>电压偏低:&nbsp;<span style={{ color: '#ffc53d' }}>AC160V</span></Col>
            <Col span={8}>通信方式:&nbsp;wifi</Col>
            <Col span={8}>设备信号:&nbsp;<span style={{ color: '#a0d911' }}>高</span></Col>
          </Row>
          <Divider style={{fontSize: 12}}>主机一</Divider>
          <Row>
            <Col span={6}>开机状态:&nbsp;<span style={{ color: '#a0d911' }}>压缩机正常</span></Col>
            <Col span={6}>压缩机:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
            <Col span={6}>风机散热:&nbsp;<span style={{ color: '#f5222d' }}>异常</span></Col>
            <Col span={6}>散热状态:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item color="green">
          <Row><Col span={6}>2018-10-20 09:20:20</Col><Col span={6}><span style={{ color: '#a0d911' }}>正常</span></Col></Row>
          <Row>
            <Col span={8}>电压偏低:&nbsp;<span style={{ color: '#ffc53d' }}>AC160V</span></Col>
            <Col span={8}>通信方式:&nbsp;wifi</Col>
            <Col span={8}>设备信号:&nbsp;<span style={{ color: '#a0d911' }}>高</span></Col>
          </Row>
          <Divider style={{fontSize: 12}}>主机一</Divider>
          <Row>
            <Col span={6}>开机状态:&nbsp;<span style={{ color: '#a0d911' }}>压缩机正常</span></Col>
            <Col span={6}>压缩机:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
            <Col span={6}>风机散热:&nbsp;<span style={{ color: '#f5222d' }}>异常</span></Col>
            <Col span={6}>散热状态:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
          </Row>
        </Timeline.Item>
        <Timeline.Item color="red">
          <p>Solve initial network problems 1</p>
          <p>Solve initial network problems 2</p>
          <p>Solve initial network problems 3 2015-09-01</p>
        </Timeline.Item>
      </Timeline>
    );
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
        centered
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title="报警详情"
        visible={updateModalVisible}
        footer={null && this.renderFooter()}
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
export default class HistoryWarn extends PureComponent {
  state = {
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    dataDicModalVisible: false,
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
      title: '记录时间',
      dataIndex: 'createTime',
      width: "40%",
      render: val => <span>{moment(val).format('YYYY-MM-DD hh:mm:ss')}</span>
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: '40%',
    },
    {
      title: '操作',
      render: (text, record) => <Tag onClick={() => this.handleUpdateModalVisible(true, record)} style={{ margin: 0 }}>详情</Tag>,
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

  handleDataDicModal = (flag, record) => {
    this.setState({
      dataDicModalVisible: !!flag,
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
    const { form: { getFieldDecorator }, record } = this.props;
    // console.log(record, 666)
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={9} sm={24}>
            <FormItem label="开始时间">
              {getFieldDecorator('startTime')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择结束时间"
                // onChange={onChange}
                // onOk={onOk}
                />
              )}
            </FormItem>
          </Col>
          <Col md={9} sm={24}>
            <FormItem label="结束时间">
              {getFieldDecorator('endTime')(
                <DatePicker
                  style={{ width: '100%' }}
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder="请选择开始时间"
                // onChange={onChange}
                // onOk={onOk}
                />
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
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
        width={900}
        // destroyOnClose
        title={null}
        centered
        visible={this.props.historyVisible}
        footer={null}
        onCancel={() => this.props.handleVisibleModal('history')}
      >
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
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
            <UpdateForm
              {...updateMethods}
              updateModalVisible={updateModalVisible}
              values={stepFormValues}
            />
          </div>
        </Card>
      </Modal>
    );
  }
}
