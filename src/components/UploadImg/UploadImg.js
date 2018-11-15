import React, { PureComponent, Fragment } from 'react';
import { Upload, Icon, Modal } from 'antd';
import { SortableContainer, SortableElement, arrayMove } from 'react-sortable-hoc';
import { isEqual, isBoolean } from 'underscore';
import styles from './uploadImg.less';
export default class UploadImg extends PureComponent {
  constructor(props) {
    super(props)
    console.log(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      supportSort: isBoolean(props.supportSort) ? props.supportSort : true
    }
  } 

  handleCancel = () => this.setState({ previewVisible: false })
  handlePreview = (file) => {
    // console.log(file)
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  render() {
    const { previewVisible, previewImage, supportSort } = this.state;
    const { totalNum, action, onChange, onSortEnd, fileList, multiple, beforeUpload } = this.props;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const SortableItem = SortableElement(({ value }) =>
      <div className={styles.item}>
        {value.status == 'done' ? <img style={{ width: '100%' }} src={value.url || value.thumbUrl} alt="" />:null}
      </div>
    );
    const SortableList = SortableContainer(({ items }) => {
      return (
        <div className={styles.SortContainer}>
          {items.map((value, index) => (
            <SortableItem key={`item-${index}`} disabled={false} index={index} value={value} />
          ))}
        </div>
      );
    });
    const SortableComponent = () => {
      //.uploadImg_sort的样式写在global.css，主要是定义zIndex为1000+，因为antd的modal层级为1000
      return <SortableList helperClass="uploadImg_sort" lockOffset={0} transitionDuration={500} lockToContainerEdges={true} lockAxis='x' axis="x" items={fileList} onSortEnd={onSortEnd} />
    }
    return (
      <div style={{overflow: 'hidden'}}>
        <Upload
          accept="image/*"
          key="upload"
          action={action}
          multiple={isBoolean(multiple) ? multiple : false}
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={onChange}
          beforeUpload={beforeUpload}
        >
          {totalNum && fileList.length >= totalNum ? null : uploadButton}
        </Upload>
        {supportSort && fileList.length >= 2 ? <SortableComponent onSortEnd={onSortEnd} fileList={fileList} key='sort' /> : null}
        <Modal
          key='modal' 
          centered={true}
          style={{maxWidth: '90%',maxHeight: '100%',boxSizing: 'border-box'}}
          bodyStyle={{padding: 40}}
          width="auto"
          visible={previewVisible} 
          footer={null} 
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ maxWidth: '100%',maxHeight: '100%' }} src={previewImage} />
        </Modal>
      </div>
    )
  }
}