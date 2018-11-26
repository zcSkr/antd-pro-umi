import React, { PureComponent, Fragment } from 'react';
import {
  Form,
  Input,
  Button,
  Modal,
  Tabs,
  Row,
  Col,
  Select,
  InputNumber,
  Divider,
  DatePicker,
} from 'antd';
import { isEqual, isEmpty } from 'underscore';
import WangEditor from '@/components/WangEditor/WangEditor';
import BraftEditor from '@/components/BraftEditor';
import UploadImg from '@/components/UploadImg/UpLoadImg';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const InputGroup = Input.Group;
const TextArea = Input.TextArea;

@Form.create()
export default class Settings extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formVals: {},
      activeKey: '1',
      fileList: [],
    };

    this.formLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
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

  handleTabChange = (key) => {
    this.setState({ activeKey: key })
  }

  handleBraftEditor = (value,editorId) => {
    console.log(value,editorId)
    
  }
  renderContent = (formVals) => {
    const { form: { getFieldDecorator }, factoryAuthority } = this.props;
    return (
      <Tabs tabBarStyle={{ textAlign: 'center' }} activeKey={this.state.activeKey} onChange={this.handleTabChange}>
        <TabPane tab="设备属性名称" key="1">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="主机一">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="主机二">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="电压正常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="电压偏低">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="电压过低">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="电压过高">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="通讯方式">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="设备信号">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="现场操作">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="灯">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="点击开门">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="使用说明">
                {getFieldDecorator('account')(<Input placeholder="请输入使用说明" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="保养信息">
                {getFieldDecorator('account')(<Input placeholder="请输入保养信息" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="联系技术">
                {getFieldDecorator('account')(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="联系商家">
                {getFieldDecorator('account')(<Input placeholder="请输入名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="备注">
                {getFieldDecorator('account')(<Input placeholder="请输入备注" />)}
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="主机属性名称" key="2">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={6}>
              <FormItem {...this.formLayout} label="开机状态">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="开机状态-正常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="开机状态-异常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Divider />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={6}>
              <FormItem {...this.formLayout} label="压缩机">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="压缩机-正常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="压缩机-异常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Divider />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={6}>
              <FormItem {...this.formLayout} label="散热方式">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="散热方式-正常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="散热方式-异常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Divider />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={6}>
              <FormItem {...this.formLayout} label="散热状态">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="散热状态-正常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="散热状态-异常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Divider />
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={6}>
              <FormItem {...this.formLayout} label="制冷系统">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="制冷系统-正常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
            <Col span={10} offset={1}>
              <FormItem {...this.formLayout} label="制冷系统-异常">
                {getFieldDecorator('account')(<Input placeholder="请输入属性名称" />)}
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="功能设置" key="3">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={14} offset={4}>
              <FormItem {...this.formLayout} label="播放器">
                {getFieldDecorator('account1', { initialValue: '' })(
                  <Select placeholder="不设置" style={{ width: '100%' }}>
                    <Option value=''>不设置</Option>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={14} offset={4}>
              <FormItem {...this.formLayout} label="彩灯">
                {getFieldDecorator('account1', { initialValue: '' })(
                  <Select placeholder="不设置" style={{ width: '100%' }}>
                    <Option value=''>不设置</Option>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={14} offset={4}>
              <FormItem {...this.formLayout} label="门">
                {getFieldDecorator('account1', { initialValue: '' })(
                  <Select placeholder="不设置" style={{ width: '100%' }}>
                    <Option value=''>不设置</Option>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={14} offset={4}>
              <FormItem {...this.formLayout} label="用户设置关机">
                {getFieldDecorator('account1', { initialValue: '' })(
                  <Select placeholder="不设置" style={{ width: '100%' }}>
                    <Option value=''>不设置</Option>
                    <Option value={1}>是</Option>
                    <Option value={0}>否</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="系统值设置" key="4">
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={11} offset={1}>
              <FormItem {...this.formLayout} label="电压正常范围">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="V" disabled />
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem {...this.formLayout} label="电压偏低范围">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="V" disabled />
                </InputGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={11} offset={1}>
              <FormItem {...this.formLayout} label="电压过高范围">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="V" disabled />
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem {...this.formLayout} label="电压过低范围">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="V" disabled />
                </InputGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={11} offset={1}>
              <FormItem {...this.formLayout} label="除霜机开">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 210, textAlign: 'center' }} placeholder="请输入" />
                  <Input style={{ width: 60, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="分钟" disabled />
                </InputGroup>
              </FormItem>
            </Col>
            <Col span={11}>
              <FormItem {...this.formLayout} label="除霜机关">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 210, textAlign: 'center' }} placeholder="请输入" />
                  <Input style={{ width: 60, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="分钟" disabled />
                </InputGroup>
              </FormItem>
            </Col>
          </Row>
          <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
            <Col span={11} offset={1}>
              <Divider>主机一</Divider>
              <FormItem {...this.formLayout} label="启动延时">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 230, textAlign: 'center' }} placeholder="请输入" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="秒" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="压缩机电流">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="A" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="风机电流">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="A" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="散热温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="制冷温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="开机温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="关机温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="散热方式">
                {getFieldDecorator('account1', { initialValue: 1 })(
                  <Select style={{ width: 270 }}>
                    <Option value={1}>风机散热</Option>
                    <Option value={0}>直冷散热</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={11}>
              <Divider>主机二</Divider>
              <FormItem {...this.formLayout} label="启动延时">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 230, textAlign: 'center' }} placeholder="请输入" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="秒" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="压缩机电流">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="A" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="风机电流">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber min={0} style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="A" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="散热温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="制冷温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="开机温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="关机温度">
                <InputGroup compact style={{ paddingTop: 4 }}>
                  <InputNumber style={{ width: 100, textAlign: 'center' }} placeholder="最小值" />
                  <Input style={{ width: 30, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                  <InputNumber style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大值" />
                  <Input style={{ width: 40, borderLeft: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="℃" disabled />
                </InputGroup>
              </FormItem>
              <FormItem {...this.formLayout} label="散热方式">
                {getFieldDecorator('account1', { initialValue: 1 })(
                  <Select style={{ width: 270 }}>
                    <Option value={1}>风机散热</Option>
                    <Option value={0}>直冷散热</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab="使用说明" key="5">
          {/* <WangEditor id="desc" editor={(editor) => this.setState({ editor })}></WangEditor> */}
          {<BraftEditor editorId="desc" handleBraftEditor={this.handleBraftEditor}></BraftEditor>}
        </TabPane>
        <TabPane tab="保养信息" key="6">
          {/* <WangEditor id="maintain" editor={(editor) => this.setState({ editor })}></WangEditor> */}
          {<BraftEditor editorId="maintain" handleBraftEditor={this.handleBraftEditor}></BraftEditor>}
        </TabPane>
        {
          factoryAuthority ?
            <TabPane tab="基础信息" key="7">
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="设备别名">
                    {getFieldDecorator('deviceNickname', {
                      initialValue: formVals.deviceNickname,
                    })(<Input placeholder="请输入设备别名" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="保修期至">
                    {getFieldDecorator('warranty', {
                      initialValue: formVals.warranty,
                    })(
                      <DatePicker
                        style={{ width: '100%' }}
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        placeholder="请选择保修期"
                      // onChange={onChange}
                      // onOk={onOk}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="封面图片">
                    {getFieldDecorator('state', {
                      initialValue: formVals.img || 1,
                    })(
                      <UploadImg
                        action="//jsonplaceholder.typicode.com/posts/"
                        totalNum={1}
                        multiple={false}
                        supportSort={true}
                        fileList={this.state.fileList}
                        beforeUpload={this.beforeUpload}
                        onChange={this.handleUpLoadChange}
                        onSortEnd={this.onSortEnd}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="联系商家">
                    {getFieldDecorator('merchant', {
                      initialValue: formVals.merchant,
                    })(<Input placeholder="请输入内容" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="联系技术">
                    {getFieldDecorator('tech', {
                      initialValue: formVals.tech,
                    })(<Input placeholder="请输入内容" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="保修标题">
                    {getFieldDecorator('title', {
                      initialValue: formVals.title,
                    })(<Input placeholder="请输入保修标题" />)}
                  </FormItem>
                </Col>
              </Row>
              <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                <Col span={14} offset={4}>
                  <FormItem {...this.formLayout} label="保修说明">
                    {getFieldDecorator('desc1', {
                      initialValue: formVals.desc1,
                    })(<TextArea rows={4} placeholder="请输入保修说明" />)}
                  </FormItem>
                </Col>
              </Row>
            </TabPane> : null
        }
      </Tabs >
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
    const { settingsVisible, handleVisibleModal } = this.props;
    const { formVals } = this.state;
    console.log(formVals)
    return (
      <Modal
        width={1000}
        destroyOnClose
        // bodyStyle={{ padding: '32px 40px 48px' }}
        // title="设备设置"
        visible={settingsVisible}
        footer={this.renderFooter()}
        onCancel={() => handleVisibleModal('settings')}
      >
        {this.renderContent(formVals)}
      </Modal>
    );
  }
}
