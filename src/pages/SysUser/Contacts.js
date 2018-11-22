import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Form,
  Input,
  Select,
  Modal,
  message,
} from 'antd';
import StandardTable from '@/components/StandardTable';


/* eslint react/no-multi-comp:0 */
@connect(({ role, manager, loading }) => ({
  role,
  manager,
  loading: loading.effects['role/query'],
}))
@Form.create()
export default class Contacts extends PureComponent {
  state = {
    selectedRows: [],
    directoryModalVisible: false,
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
      title: '名称',
      dataIndex: 'account',
      width: "45%",
    },
    {
      title: '电话',
      dataIndex: 'nickname',
      width: '45%',
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

  render() {
    const {
      manager: { data: { list, pagination } },
      loading,
    } = this.props;

    return (
      <Modal
        width={640}
        // destroyOnClose
        title="通讯录"
        centered
        visible={this.props.directoryModalVisible}
        footer={null}
        onCancel={() => this.props.handleDirectoryModal()}
      >
        <StandardTable
          loading={loading}
          list={list}
          pagination={pagination}
          columns={this.columns}
          onChange={this.handleStandardTableChange}
        />
      </Modal>
    );
  }
}
