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
    return [
      <FormItem key="account" {...this.formLayout} label="数据名称">
        {form.getFieldDecorator('account', {
          rules: [{ required: true, message: '请输入数据名称！' }],
          initialValue: formVals.account,
        })(<Input placeholder="请输入数据名称" />)}
      </FormItem>,
      <FormItem key="nickname" {...this.formLayout} label="数据值">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: true, message: '请输入数据值！' }],
          initialValue: formVals.nickname,
        })(<Input placeholder="请输入数据值" />)}
      </FormItem>,
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
        centered
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title="添加数据"
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
export default class DicList extends PureComponent {
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
      title: '数据名',
      dataIndex: 'account',
      width: "40%",
    },
    {
      title: '数据值',
      dataIndex: 'nickname',
      width: '40%',
    },
    {
      title: '操作',
      width: 40,
      render: (text, record) => (
        <Popconfirm title="确定删除?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
          <Tag color="#f50" style={{ margin: 0 }}>删除</Tag>
        </Popconfirm>
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
    const { record } = this.props;
    // console.log(record, 666)
    return (
      <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
        <Col md={12} sm={24}>
          <div>字典名称: 123</div>
        </Col>
        <Col md={12} sm={24}>
          <div className={styles.tableListOperator} style={{ textAlign: 'right' }}>
            <Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
              添加
          </Button>
          </div>
        </Col>
      </Row>
    );
  }
  renderContent = (formVals) => {
    const { form } = this.props;
    return [
      <FormItem key="account" hasFeedback {...this.formLayout} label="数据名称">
        {form.getFieldDecorator('account', {
          rules: [{ required: true, message: '请输入数据名称！' }],
          initialValue: formVals.account,
        })(<Input placeholder="请输入数据名称" />)}
      </FormItem>,
      <FormItem key="nickname" hasFeedback {...this.formLayout} label="数据值">
        {form.getFieldDecorator('nickname', {
          rules: [{ required: true, message: '请输入数据值！' }],
          initialValue: formVals.nickname,
        })(<Input placeholder="请输入数据值" />)}
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
        width={700}
        // destroyOnClose
        title={null}
        centered
        visible={this.props.dataDicModalVisible}
        footer={null}
        onCancel={() => this.props.handleDataDicModal()}
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
