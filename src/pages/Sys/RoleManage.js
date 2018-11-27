import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  Modal,
  message,
  Divider,
  Popconfirm,
  Tree,
  Tag,
  Spin,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { isEqual, isEmpty } from 'underscore';

import styles from '../Table.less';

const FormItem = Form.Item;
const { TextArea } = Input;
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
      autoExpandParent: true,
    };

    this.formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    return { formVals: { ...nextProps.values, ...prevState.formVals  } }
  }

  handleConfirm = () => {
    const { form } = this.props;
    const { formVals } = this.state
    // console.log(formVals)
    form.setFieldsValue({ moduleIds: formVals.moduleIds })
    form.validateFields((err, fieldsValue) => {
      // console.log(err, fieldsValue)
      if (err) return;
      console.log(err, fieldsValue)
      this.setState({ formVals: { ...fieldsValue } });
    });
  }

  onCheck = (checkedKeys) => {
    // console.log('onCheck', checkedKeys);
    this.setState({ formVals: { moduleIds: checkedKeys.join(',') } });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys);
    this.setState({ checkedKeys: selectedKeys });
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
  };
  renderContent = (formVals) => {
    const { checkedKeys } = this.state;
    const { form, moduleList, moduleLoading, values } = this.props;
    moduleList.forEach(item => {
      item.title = item.moduleName;
      item.key = item.id;
      item.children ? item.children.forEach(childItem => {
        childItem.title = childItem.moduleName;
        childItem.key = childItem.id;
      }) : null
    })
    // console.log(moduleList,666)
    return (
      <Row style={{ height: '100%' }}>
        <Col span={16}>
          <FormItem key="name" hasFeedback {...this.formLayout} label="角色名称">
            {form.getFieldDecorator('roleName', {
              rules: [{ required: true, message: '请输入角色名称！' }],
              initialValue: formVals.roleName,
            })(<Input placeholder="请输入角色名称" />)}
          </FormItem>
          <FormItem key="desc" {...this.formLayout} label="角色描述">
            {form.getFieldDecorator('description', {
              initialValue: formVals.description,
            })(<TextArea rows={4} placeholder="请输入角色描述" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          {
            moduleLoading ? <Spin /> :
            <FormItem key="moduleIds" {...this.formLayout} validateStatus="error">
              {form.getFieldDecorator('moduleIds', {
                rules: [{ required: true, message: '请选择模块！' }]
              })(<Tree
                checkable
                multiple={true}
                defaultExpandAll={true}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={formVals.moduleIds ? formVals.moduleIds.split(',') : []}
                // onSelect={this.onSelect}
                selectedKeys={[]}
              >
                {this.renderTreeNodes(moduleList)}
              </Tree>)}
            </FormItem>
          }
        </Col>
      </Row>
    );
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
    // console.log(formVals)
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title={isEmpty(formVals) ? '添加角色' : '编辑角色'}
        visible={updateModalVisible}
        footer={this.renderFooter()}
        onCancel={() => { this.setState({formVals: {},checkedKeys: []});handleUpdateModalVisible() }}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}

/* eslint react/no-multi-comp:0 */
@connect(({ role, module, loading }) => ({
  role,
  module,
  loading: loading.effects['role/query'],
  moduleLoading: loading.effects['module/service']
}))
@Form.create()
export default class RoleManage extends PureComponent {
  state = {
    updateModalVisible: false,
    formValues: {},
    stepFormValues: {},
    moduleList: [],

    fileList: [{
      uid: '0',
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }, {
      uid: '1',
      name: 'xxx.png',
      status: 'done',
      url: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1542249636&di=e62f4d745dc358a5d678d56f52e53391&imgtype=jpg&er=1&src=http%3A%2F%2Fimgsrc.baidu.com%2Fimgad%2Fpic%2Fitem%2F86d6277f9e2f0708fda62627e324b899a901f272.jpg',
    }],
    totalNum: 6
  };

  columns = [
    {
      title: '序号',
      key: 'index',
      width: "10%",
      render: (val,record,index) => index + 1,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      width: "15%",
    },
    {
      title: '拥有板块',
      dataIndex: 'moduleNames',
      width: '30%',
      render: (text, record) => <Ellipsis length={80} fullWidthRecognition tooltip>{text}</Ellipsis>
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      width: "15%",
      render: (text, record) => <Ellipsis length={80} fullWidthRecognition tooltip>{text}</Ellipsis>
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
        <div style={{ minWidth: 115 }}>
          {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> */}
          <Tag color="#108ee9" style={{margin: 0}} onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</Tag>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
            {/* <a style={{color: '#ff4d4f'}}>删除</a> */}
            {/* <Button size="small" type="danger">删除</Button> */}
            <Tag color="#f50" style={{margin: 0}}>删除</Tag>
          </Popconfirm>

        </div>
      ),
    },
  ];
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'role/query' });
    //获取模块数据
    dispatch({
      type: 'module/service',
      payload: {
        service: 'query',
      },
      onSuccess: res => {
        if (res.resultState == '1') {
          this.setState({ moduleList: res.data })
        }
      }
    });
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
          dispatch({ type: 'role/query' })
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
      type: 'role/query',
      payload: {
        draw: 1,
        limit: 1,
      },
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
        type: 'role/query',
        payload: {
          roleName: values.roleName,
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
            <FormItem label="角色名称">
              {getFieldDecorator('roleName')(<Input placeholder="请输入角色名称" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="板块名称">
              {getFieldDecorator('bkName')(<Input placeholder="请输入板块名称" />)}
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
      role: { data: { list, pagination } },
      loading,
      moduleLoading
    } = this.props;
    const { updateModalVisible, stepFormValues, moduleList } = this.state;
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      moduleLoading
    };

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
                添加角色
              </Button>
            </div>
            <StandardTable
              isCheckBox={false}
              loading={loading}
              list={list}
              pagination={pagination}
              columns={this.columns}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
        <UpdateForm
          {...updateMethods}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
          moduleList={moduleList}
        />
      </PageHeaderWrapper>
    );
  }
}
