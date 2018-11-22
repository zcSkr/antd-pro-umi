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

  renderContent = (formVals) => {
    const { form } = this.props;
    return (
      <Fragment>
        <Row type="flex" justify="center" style={{marginBottom: 20,fontSize: 18}}>
          <Col span={8}>2018-10-20 09:20:20</Col>
          <Col span={2}><span style={{ color: '#a0d911' }}>正常</span></Col>
        </Row>
        <Row style={{textAlign: 'center'}}>
          <Col span={8}>电压偏低:&nbsp;<span style={{ color: '#ffc53d' }}>AC160V</span></Col>
          <Col span={8}>通信方式:&nbsp;wifi</Col>
          <Col span={8}>设备信号:&nbsp;<span style={{ color: '#a0d911' }}>高</span></Col>
        </Row>
        <Divider key='divider' style={{fontSize: 14}}>主机一</Divider>
        <Row style={{textAlign: 'center'}}>
          <Col span={6}>开机状态:&nbsp;<span style={{ color: '#a0d911' }}>压缩机正常</span></Col>
          <Col span={6}>压缩机:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
          <Col span={6}>风机散热:&nbsp;<span style={{ color: '#f5222d' }}>异常</span></Col>
          <Col span={6}>散热状态:&nbsp;<span style={{ color: '#a0d911' }}>正常</span></Col>
        </Row>
      </Fragment>
    )
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
        footer={null}
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
export default class HistoryWarn extends PureComponent {
  state = {
    updateModalVisible: false,
    formValues: {},
    stepFormValues: {},
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({ type: 'manager/query' });
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
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
  render() {
    const {
      manager: { data: { list, pagination } },
      loading,
    } = this.props;
    const { updateModalVisible, stepFormValues } = this.state;

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
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
              loading={loading}
              list={list}
              pagination={pagination}
              columns={this.columns}
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
