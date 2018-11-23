import 'braft-editor/dist/index.css'
import React from 'react'
import BraftEditor from 'braft-editor'
import { ContentUtils } from 'braft-utils'
import { ImageUtils } from 'braft-finder'
import { Upload, Icon, message, Button, Spin } from 'antd'
import { isEqual } from 'underscore'

export default class UploadDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      editorState: BraftEditor.createEditorState(props.value),
      uploading: false
    }
  }

  handleChange = (editorState) => {
    this.setState({ editorState })
    const { handleBraftEditor } = this.props;
    if(handleBraftEditor) {
      //函数节流
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        handleBraftEditor(editorState.toHTML(),this.props.editorId)
      },500)
    }
  }

  screenFull = () => {
    console.log(123)
  }

  render() {
    const uploadProps = {
      name: 'file',
      // action: '//jsonplaceholder.typicode.com/posts/',
      action: 'http://182.140.221.130:8080/yixian/wangImg/imgUpload.do',
      headers: {
        authorization: 'authorization-text',
      },
      onChange: ({ file, fileList, event }) => {
        if (file.status === 'uploading') {
          // console.log(file, fileList);
          this.setState({ uploading: true })
        } else if (file.status === 'error') {
          message.error('图片上传失败')
          this.setState({ uploading: false })
        } else if (file.status === 'done') {
          this.setState({ uploading: false })
          // console.log(file.response)
          let src = 'http://a.hiphotos.baidu.com/image/pic/item/d009b3de9c82d158ec9917f38d0a19d8bc3e425c.jpg'
          // let src = 'http://182.140.221.130:8080/yijie/uploadFile/goodsPhotos/d427cce6576746b8afabde9a27050dbc.png'
          this.setState({
            editorState: ContentUtils.insertMedias(this.state.editorState, [{
              type: 'IMAGE',
              url: src || file.response.data[0]
            }])
          })
        }
      }
    }
    const controls = [ //工具条
      'undo', 'redo', 'separator',
      'font-size', 'separator',
      'headings', 'separator',
      'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
      'text-align', 'separator',
      // 'media', 'separator',
      // 'clear'
    ]
    const extendControls = [ //额外的工具条
      {
        key: 'antd-uploader',
        type: 'component',
        component: (
          <Upload
            {...uploadProps}
            accept="image/*"
            showUploadList={false}
          >
            {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
            <button type="button" className="control-item button upload-button" data-title="插入图片">
              <Icon type="picture" theme="filled" />
            </button>
          </Upload>
        )
      },
    ]
    const imageControls = [
      'align-left', // 设置图片居左
      'align-center', // 设置图片居中
      'align-right', // 设置图片居右
      'size',
      'remove'
    ]
    const excludeControls = [
      'line-height', 'letter-spacing',
      'superscript', 'subscript', 'remove-styles', 'emoji',
      'text-indent', 'link', 'hr',
      'list-ul', 'list-ol', 'blockquote', 'code',
      'media',
      'clear',
    ]
    return (
      <div>
        <div className="editor-wrapper" style={{ border: '1px solid #d9d9d9',borderRadius: 4 }}>
          <Spin spinning={this.state.uploading} tip="图片上传中">
            <BraftEditor
              ref={instance => this.editorInstance = instance}
              value={this.state.editorState}
              placeholder="请输入内容"
              onChange={this.handleChange}
              // controls={controls} //不要全屏就配置controls
              excludeControls={excludeControls} //excludeControls
              extendControls={extendControls}
              imageControls={imageControls}
              fontSizes={[12, 14, 16, 18, 20, 24,28, 30, 32, 36, 40, 48]}
              contentStyle={{height: 500}}
              // onSave={() => this.editorInstance.getDraftInstance().onBlur()}
            />
          </Spin>
        </div>
      </div>
    )

  }

}