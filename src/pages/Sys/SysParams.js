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
  Upload,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { arrayMove } from 'react-sortable-hoc';
import WangEditor from '@/components/WangEditor/WangEditor';
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
      formVals: {},
      selectedKeys: [],
    };

    this.formLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    };
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const defaultFormValues = {
      codeLevel: 'sys',
      valueType: 'txt',
    }
    if(isEmpty(nextProps.values)) {
      return { formVals : defaultFormValues }
    } else if (!isEqual(prevState.formVals, nextProps.values)) {
      return { formVals : {...prevState.formVals, ...nextProps.values} }
    }
    return null;
  }
  handleConfirm = () => {
    const { form } = this.props;
    const { formVals } = this.state
    // console.log(this.state.editor.txt.html())
    form.validateFields((err, fieldsValue) => {
      // console.log(err, fieldsValue)
      if (err) return;
      this.setState({ formVals: { ...fieldsValue } });
    });
    console.log(formVals)
  }
  handleSelectChange = (field,value,option) => {
    let { formVals } = this.state
    console.log(field,value);
    formVals[field] = value
    this.setState({formVals: formVals})
  }
  renderContent = (formVals) => {
    const { form } = this.props;
    // console.log(formVals)
    const props = {
      name: 'file',
      action: '//jsonplaceholder.typicode.com/posts/',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    }
    return (
      <Fragment>
        <FormItem key="codeLevel" {...this.formLayout} label="参数级别">
          {form.getFieldDecorator('codeLevel', {
            initialValue: formVals.codeLevel || 'sys',
          })(
            <Select style={{ width: '100%' }} onChange={this.handleSelectChange.bind(this,'codeLevel')}>
              <Option value="sys">系统级别</Option>
              <Option value="bis">业务级别</Option>
            </Select>
          )}
        </FormItem>
        <FormItem key="type" {...this.formLayout} label="参数类型">
          {form.getFieldDecorator('type', {
            rules: [{ required: true, message: '请输入参数类型！' }],
            initialValue: formVals.type,
          })(<Input placeholder="请输入参数类型" />)}
        </FormItem>
        <FormItem key="codeKey" {...this.formLayout} label="键">
          {form.getFieldDecorator('codeKey', {
            rules: [{ required: true, message: '请输入键！' }],
            initialValue: formVals.codeKey,
          })(<Input placeholder="请输入键" />)}
        </FormItem>
        <FormItem key="valueType" {...this.formLayout} label="值类型">
          {form.getFieldDecorator('valueType', {
            initialValue: formVals.valueType || 'txt',
          })(
            <Select style={{ width: '100%' }} onChange={this.handleSelectChange.bind(this,'valueType')}>
              <Option value="txt">文本</Option>
              <Option value="imgContent">图文</Option>
              <Option value="file">文件</Option>
            </Select>
          )}
        </FormItem>
        {
          formVals.valueType == 'txt' ?
          <FormItem key="codeValue" {...this.formLayout} label="值">
            {form.getFieldDecorator('codeValue', {
              rules: [{ required: true}],
              initialValue: formVals.codeValue,
            })(<Input placeholder="请输入值" />)}
          </FormItem> : null
        }
        {
          formVals.valueType == 'imgContent' ?
          <FormItem key="codeValue" {...this.formLayout} label="值">
            {form.getFieldDecorator('codeValue', {
              rules: [{ required: true}],
              initialValue: formVals.codeValue,
            })(<WangEditor editor={(editor) => this.setState({editor})}></WangEditor>)}
          </FormItem> : null
        }
        {
          formVals.valueType == 'file' ?
          <FormItem key="codeValue" {...this.formLayout} label="值">
            {form.getFieldDecorator('codeValue', {
              rules: [{ required: true}],
              initialValue: formVals.codeValue,
            })(
              <Upload {...props}>
                <Button><Icon type="upload" /> 选择文件</Button>
              </Upload>
            )}
          </FormItem> : null
        }
        <FormItem key="description" {...this.formLayout} label="描述">
          {form.getFieldDecorator('description', {
            initialValue: formVals.description,
          })(<TextArea rows={4} placeholder="请输入描述" />)}
        </FormItem>
      </Fragment>
    );
  };
  renderFooter = () => {
    const { handleUpdateModalVisible } = this.props;
    return (
      <div style={{textAlign: 'center'}}>
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
        title={isEmpty(this.props.values) ? '添加参数' : '编辑参数'}
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
@connect(({ params, loading }) => ({
  params,
  loading: loading.effects['params/query'],
}))
@Form.create()
export default class SysParams extends PureComponent {
  state = {
    updateModalVisible: false,
    selectedRows: [],
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
      title: '参数类型',
      dataIndex: 'type',
      width: "20%",
    },
    {
      title: '键',
      dataIndex: 'codeKey',
      width: '20%',
    },
    // {
    //   title: '值',
    //   dataIndex: 'codeValue',
    //   width: "15%",
    //   // render: (text, record) => <Ellipsis length={80} fullWidthRecognition tooltip>{text}</Ellipsis>
    //   render: (text, record) => <div dangerouslySetInnerHTML={{_html: '123'}}>66</div>
    // },
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
    dispatch({ type: 'params/query' });
  }
  handleDeleteRecord(record) {
    console.log(record)
    const { dispatch } = this.props
    dispatch({
      type: 'params/service',
      payload: {
        service: 'remove',
        data: { id: record.id }
      },
      onSuccess: res => {
        console.log(res)
        if (res.resultState == '1') {
          dispatch({ type: 'params/query' })
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
      draw: pagination.current,
      length: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    // dispatch({
    //   type: 'rule/fetch',
    //   payload: params,
    // });
    dispatch({ 
      type: 'params/query',
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
      type: 'params/query',
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
        type: 'params/query',
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
            <FormItem label="参数类型">
              {getFieldDecorator('roleName')(<Input placeholder="请输入参数类型" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="键">
              {getFieldDecorator('bkName')(<Input placeholder="请输入键" />)}
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
    if (fileList.length + this.state.fileList.length > this.state.totalNum) {
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
      params: { data: { list, pagination } },
      loading,
    } = this.props;
    const { selectedRows, updateModalVisible, stepFormValues } = this.state;
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
      <PageHeaderWrapper title="系统参数">
        {/* <MyIcon type="icon-wahaha" style={{fontSize: 40}} /> */}
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleUpdateModalVisible(true)}>
                添加参数
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
        />
      </PageHeaderWrapper>
    );
  }
}
