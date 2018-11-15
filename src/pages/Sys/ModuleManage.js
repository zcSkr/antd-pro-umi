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
  Tag
} from 'antd';

import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isEqual, isEmpty } from 'underscore';

import styles from './RoleManage.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;
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
        moduleName: props.values.moduleName,
        description: props.values.description,
      },
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
      console.log(err, fieldsValue)
      if (err) return;
      this.setState({ formVals: { ...fieldsValue } });
    });
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }

  onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    this.setState({ checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    this.setState({ selectedKeys });
  }
  renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    });
  }
  handleSelectChange = (value) => {
    console.log(`selected ${value}`);
    this.props.form.setFieldsValue({
      // pid: `Hi, ${value === 'male' ? 'man' : 'lady'}!`,
    })
  }
  renderContent = (formVals) => {
    const { form, list } = this.props;
    console.log(formVals)
    return [
      <FormItem key="pid" {...this.formLayout} label="父级模块">
        {form.getFieldDecorator('pid', {
          rules: [{ required: true, message: '请选择父级模块！' }],
          initialValue: formVals.pid,
        })(
          <Select style={{ width: '100%' }} onChange={this.handleSelectChange}>
            <Option value='0'>顶级模块</Option>
            {
              list.map(item => <Option key={item.id} value={item.id}>{item.moduleName}</Option>)
            }
          </Select>
        )}
      </FormItem>,
      <FormItem key="name" {...this.formLayout} label="模块名称">
        {form.getFieldDecorator('moduleName', {
          rules: [{ required: true, message: '请输入模块名称！' }],
          initialValue: formVals.moduleName,
        })(<Input placeholder="请输入模块名称" />)}
      </FormItem>,
      <FormItem key="requestUrl" {...this.formLayout} label="请求路径">
        {form.getFieldDecorator('requestUrl', {
          initialValue: formVals.requestUrl,
        })(<Input placeholder="请输入请求路径" />)}
      </FormItem>,
      <FormItem key="number" {...this.formLayout} label="序号">
        {form.getFieldDecorator('number', {
          rules: [{ required: true, message: '序号不能为空！' }],
          initialValue: formVals.number,
        })(<InputNumber style={{ width: '100%' }} min={1} />)}
      </FormItem>,
      <FormItem key="desc" {...this.formLayout} label="描述">
        {form.getFieldDecorator('description', {
          initialValue: formVals.description,
        })(<TextArea rows={4} placeholder="请输入描述" />)}
      </FormItem>
    ];
  };

  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return [
      <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
        取消
      </Button>,
      <Button key="forward" type="primary" onClick={this.handleConfirm}>
        确定
      </Button>,
    ];
  };

  render() {
    const { updateModalVisible, handleUpdateModalVisible, values } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title={isEmpty(formVals) ? '添加模块' : '编辑模块'}
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
@connect(({ module, loading }) => ({
  module,
  loading: loading.effects['module/query'],
}))
@Form.create()
export default class ModuleManage extends PureComponent {
  state = {
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };

  columns = [
    {
      title: '模块名称',
      dataIndex: 'moduleName',
      width: "30%"
    },
    {
      title: '请求路径',
      dataIndex: 'requestUrl',
      width: "20%"
    },
    {
      title: '序号',
      dataIndex: 'number',
      width: "10%",
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: "20%",
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      width: 200,
      render: (text, record) => (
        <Fragment>
          <Tag color="#108ee9" onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</Tag>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
            <Tag color="#f50">删除</Tag>
          </Popconfirm>

        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'module/query' });
  }
  handleDeleteRecord(record) {
    console.log(record)
    const { dispatch } = this.props
    dispatch({
      type: 'module/service',
      payload: {
        service: 'remove',
        data: { id: record.id }
      },
      onSuccess: res => {
        console.log(res)
        if (res.resultState == '1') {
          dispatch({ type: 'module/query' })
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
    dispatch({
      type: 'module/query',
      payload: {
        draw: 1,
        limit: 1,
      },
    });
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
        type: 'module/query',
        payload: {
          moduleName: values.moduleName,
          moduleNames: values.bkName,
          draw: 1,
          limit: 10,
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

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模块名称">
              {getFieldDecorator('bkName')(<Input placeholder="请输入模块名称" />)}
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
      module: { data: { list, pagination } },
      loading,
    } = this.props;
    const { selectedRows, updateModalVisible, stepFormValues } = this.state;
    console.log(list)
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
    return (
      <PageHeaderWrapper title="角色管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
                添加模块
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
            </div>
            <StandardTable
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
        {/* stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null */}
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          list={list}
        />
      </PageHeaderWrapper>
    );
  }
}
