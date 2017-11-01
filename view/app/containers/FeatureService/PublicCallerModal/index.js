import React,{Component} from 'react'
import { Form, Input,Modal,Button,message,Spin} from 'antd';
const FormItem = Form.Item;
import { is } from 'immutable';

class CallerModal extends Component {
    constructor(props){
        super(props)
    }
    // resetFields
    afterClose(){
        this.props.form.resetFields();
    }
    render(){
        const { getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        ///console.log('ApplyServiceForm');
        const flag = this.props.item.system_name?true:false;
        return(
            <div>
                <Modal
                    title={flag?'查看':"申请"}
                    visible={this.props.visibleModal}
                    onOk={()=>{this.props.form.resetFields();this.props.handleViewCancel()}}
                    onCancel={()=>{this.props.form.resetFields();this.props.handleViewCancel()}}
                    footer={false}
                    item={this.props.item}
                    className='public_caller_modal'
                    afterClose={this.afterClose.bind(this)}
                >
                    <Form onSubmit={this.handleSubmit.bind(this)}  >
                        <FormItem
                            {...formItemLayout}
                            label="系统/团队名称"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('system_name', {
                                rules: [{
                                    required: true, message: '请输入系统/团队名称',
                                }],
                                initialValue:this.props.item.system_name?this.props.item.system_name:null
                            })(
                                <Input placeholder="请输入系统/团队名称" readOnly={flag}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="部门"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('department', {
                                rules: [{
                                    required: true, message: '请输入部门',
                                }],
                                initialValue:this.props.item.department?this.props.item.department:null
                            })(
                                <Input placeholder="请输入部门" readOnly={flag}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="系统标识"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('system_id', {
                                rules: [{
                                    required: true, message: '请输入系统标识',
                                }],
                                initialValue:this.props.item.system_id?this.props.item.system_id:null
                            })(
                                <Input placeholder="请输入系统标识" readOnly={flag}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="系统描述"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('system_description', {
                                rules: [{
                                    required: true, message: '请输入系统描述',
                                }],
                                initialValue:this.props.item.system_description?this.props.item.system_description:null
                            })(
                                <Input placeholder="请输入系统描述" readOnly={flag}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="wiki地址"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('wiki_url', {
                                rules: [{
                                    required: true, message: '请输入wiki地址',
                                    pattern:/^http:\/\/(\w*:\w*@)?[-\w.]+(:\d+)?(\/([\w/_.]*(\?\S+)?)?)?$/g,
                                }],
                                initialValue:this.props.item.wiki_url?this.props.item.wiki_url:null
                            })(
                                <Input placeholder="请输入wiki地址" readOnly={flag}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="需求人"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('needer', {
                                rules: [{
                                    required: true, message: '请输入需求人',
                                    pattern:/^[\w+]*((,[\w+]*)*)?$/g
                                }],
                                initialValue:this.props.item.needer?this.props.item.needer:null
                            })(
                                <Input placeholder="请输入需求人" readOnly={flag}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="RD对接人"
                            hasFeedback={this.props.item.system_name?false:true}
                        >
                            {getFieldDecorator('rd_checker', {
                                rules: [{
                                    required: true, message: '请输入RD对接人',
                                }],
                                initialValue:this.props.item.rd_checker?this.props.item.rd_checker:null
                            })(
                                <Input placeholder="请输入RD对接人" readOnly={flag}/>
                            )}
                        </FormItem>



                        {this.props.item.system_name?'':(<div style={{"textAlign":"center"}}>
                            <Button type="primary" ref="submitBtn" htmlType="submit" className="login-form-button"  >
                                提交申请
                            </Button>
                        </div>)}
                    </Form>
                </Modal>
            </div>
        )
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        if(nextState === null){
            nextState={}
        }
        if(nextProps === null){
            nextProps={}
        }
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length||Object.keys(thisState).length !== Object.keys(nextState).length){
            return true;
        }
        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                if(typeof thisProps[key] !== 'function'){
                    return true;
                }
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    handleSubmit(e){
        e.preventDefault();
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                _this.props.handleSubmit(values)

            }
        });
    }
}

const CallerModalFormGroup = Form.create()(CallerModal);
export default CallerModalFormGroup