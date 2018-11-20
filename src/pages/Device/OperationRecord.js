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
  Button,
  DatePicker,
  Modal,
} from 'antd';
import Ellipsis from 'ant-design-pro/lib/Ellipsis';
import StandardTable from '@/components/StandardTable';
import { isEqual, isEmpty } from 'underscore';

import styles from '../Sys/RoleManage.less';

const FormItem = Form.Item;
const { Option } = Select;

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
export default class OperationRecord extends PureComponent {
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
      title: '操作说明',
      dataIndex: 'state',
      width: '40%',
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
    const { selectedRows } = this.state;

    return (
      <Modal
        width={900}
        // destroyOnClose
        title={null}
        centered
        visible={this.props.recordVisible}
        footer={null}
        onCancel={() => this.props.handleVisibleModal('record')}
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
          </div>
        </Card>
      </Modal>
    );
  }
}
