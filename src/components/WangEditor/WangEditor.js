import React, { PureComponent, Fragment } from 'react';
import { isFunction } from 'underscore';
import E from 'wangeditor';
import app from '@/config/app';
export default class WangEditor extends PureComponent {
  componentDidMount() {
    const { id, editor } = this.props
    this.editor = new E("#" + id);
    this.editor.customConfig.menus = [
      'head', // 标题
      'bold', // 粗体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      //'link', // 插入链接
      //'list',  // 列表
      'justify', // 对齐方式
      //'quote',  // 引用
      //'emoticon',  // 表情
      'image', // 插入图片
      //'table',  // 表格
      //'video',  // 插入视频
      //'code',  // 插入代码
      'undo', // 撤销
      'redo' // 重复
    ]
    this.editor.customConfig.uploadImgShowBase64 = true;
    this.editor.customConfig.uploadImgShowBase64 = true;
    // 配置服务器端地址
    this.editor.customConfig.uploadImgServer = 'http://182.140.221.130:8080' + '/yixian/wangImg/imgUpload.do';
    //图片大小
    this.editor.customConfig.uploadImgMaxSize = 10 * 1024 * 1024
    //图片数量
    this.editor.customConfig.uploadImgMaxLength = 5
    // 隐藏“网络图片”tab
    this.editor.customConfig.showLinkImg = false
    this.editor.customConfig.uploadImgTimeout = 30000

    // this.editor.customConfig.uploadImgHooks = {
    //   customInsert: function (insertImg, result, editor) {
    //     // 图片上传并返回结果，自定义插入图片的事件（而不是编辑器自动插入图片！！！）
    //     // insertImg 是插入图片的函数，editor 是编辑器对象，result 是服务器端返回的结果

    //     // 举例：假如上传图片成功后，服务器端返回的是 {url:'....'} 这种格式，即可这样插入图片：
    //     var url = result.data[0]
    //     console.log(url, result)
    //     insertImg(url)
    //     // console.log(insertImg)
    //     if (editor.txt.html().indexOf(url) == -1) {
    //       console.log('没有图片的时候')
    //       $('.w-e-text').append(`<p><img src='${url}' style='max-width: 100%;' /></p>`)
    //     }
    //     // result 必须是一个 JSON 格式字符串！！！否则报错
    //   }

    // }
    this.editor.create();

    // 初始化内容
    this.editor.txt.html(this.props.value);
    if(editor && isFunction(editor)){
      editor(this.editor)
    }
  }
  render() {
    return <div id={this.props.id} style={{ width: '100%' }}></div>;
  }
}