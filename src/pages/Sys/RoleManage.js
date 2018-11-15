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
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { arrayMove } from 'react-sortable-hoc';
import UploadImg from '@/components/UploadImg/UpLoadImg';
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
        roleName: props.values.roleName,
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
    this.setState({ checkedKeys, selectedKeys: checkedKeys });
  }

  onSelect = (selectedKeys, info) => {
    console.log('onSelect', selectedKeys);
    this.setState({ selectedKeys, checkedKeys: selectedKeys });
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
    const treeData = [{
      title: '0-0',
      key: '0-0',
      children: [{
        title: '0-0-0',
        key: '0-0-0',
        children: [
          { title: '0-0-0-0', key: '0-0-0-0' },
          { title: '0-0-0-1', key: '0-0-0-1' },
          { title: '0-0-0-2', key: '0-0-0-2' },
        ],
      }, {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          { title: '0-0-1-0', key: '0-0-1-0' },
          { title: '0-0-1-1', key: '0-0-1-1' },
          { title: '0-0-1-2', key: '0-0-1-2' },
        ],
      }, {
        title: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: '0-1',
      key: '0-1',
      children: [
        { title: '0-1-0-0', key: '0-1-0-0' },
        { title: '0-1-0-1', key: '0-1-0-1' },
        { title: '0-1-0-2', key: '0-1-0-2' },
      ],
    }, {
      title: '0-2',
      key: '0-2',
    }];
    const { form, moduleList, moduleLoading } = this.props;

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
          <FormItem key="desc " hasFeedback {...this.formLayout} label="角色描述">
            {form.getFieldDecorator('description', {
              initialValue: formVals.description,
            })(<TextArea rows={4} placeholder="请输入角色描述" />)}
          </FormItem>
        </Col>
        <Col span={8}>
          {
            moduleLoading ? <Spin /> :
            <FormItem key="modules" {...this.formLayout}>
              {form.getFieldDecorator('modules', {
                rules: [{ required: true, message: '请选择模块！' }]
              })(<Tree
                checkable
                // onExpand={this.onExpand}
                // expandedKeys={this.state.expandedKeys}
                multiple={true}
                defaultExpandAll={true}
                autoExpandParent={this.state.autoExpandParent}
                onCheck={this.onCheck}
                checkedKeys={this.state.checkedKeys}
                onSelect={this.onSelect}
                selectedKeys={this.state.selectedKeys}
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
    const { updateModalVisible, handleUpdateModalVisible } = this.props;
    const { formVals } = this.state;
    return (
      <Modal
        width={640}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        title={isEmpty(formVals) ? '添加角色' : '编辑角色'}
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
    selectedRows: [],
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
      title: '角色名称',
      dataIndex: 'roleName',
      width: "15%"
    },
    {
      title: '拥有板块',
      dataIndex: 'moduleNames',
      width: '20%',
      render: (text, record) => <Ellipsis length={14} fullWidthRecognition tooltip>{text}</Ellipsis>
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      width: "15%"
    },
    {
      title: '状态',
      dataIndex: 'state',
      width: "10%",
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },
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
        <div style={{ minWidth: 115 }}>
          {/* <a onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</a> */}
          <Tag color="#108ee9" onClick={() => this.handleUpdateModalVisible(true, record)}>编辑</Tag>
          <Divider type="vertical" />
          <Popconfirm title="确定删除?" onConfirm={() => this.handleDeleteRecord(record)} okText="确定" cancelText="取消">
            {/* <a style={{color: '#ff4d4f'}}>删除</a> */}
            {/* <Button size="small" type="danger">删除</Button> */}
            <Tag color="#f50">删除</Tag>
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

  handleUpLoadChange = ({ file, fileList, event }) => {
    this.setState({ fileList: fileList.filter(item => item) })
  }
  beforeUpload = (file, fileList) => {
    // console.log(fileList, 'before')
    if(fileList.length + this.state.fileList.length > this.state.totalNum){
      message.warning('图片不能超过6张')
      return false
    }
    return true
  }
  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState({ fileList: arrayMove(this.state.fileList, oldIndex, newIndex) });
  }

  render() {
    const {
      role: { data: { list, pagination } },
      loading,
      moduleLoading
    } = this.props;
    const { selectedRows, updateModalVisible, stepFormValues, moduleList, fileList, totalNum } = this.state;
    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
      moduleLoading
    };
    const MyIcon = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_900467_07qyp7gznw9p.js', // 在 iconfont.cn 上生成
    });

    return (
      <PageHeaderWrapper title="角色管理">
        {/* <MyIcon type="icon-wahaha" style={{fontSize: 40}} /> */}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
                添加角色
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
            {/* <UploadImg
              action="//jsonplaceholder.typicode.com/posts/"
              totalNum={totalNum}
              multiple={true}
              supportSort={true}
              fileList={fileList}
              beforeUpload={this.beforeUpload}
              onChange={this.handleUpLoadChange}
              onSortEnd={this.onSortEnd}
            /> */}
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
