import React from 'react';
import { Form, Input, Radio,Button,message} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

class WeatherForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            status:false,
            submitState:false,
            modelStatus:true
        }
    }
    render(){
        const { getFieldDecorator } = this.props.form;
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
        return (

            <Form onSubmit={this.handleSubmit.bind(this)} >
                <FormItem
                    {...formItemLayout}
                    label="需求名称"
                    hasFeedback
                >
                    {getFieldDecorator('name', {
                        rules: [{
                            required: true, message: '请输入需求名称',
                        }],
                    })(
                        <Input placeholder="请输入需求名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="需求人"
                    hasFeedback
                >
                    {getFieldDecorator('applier', {
                        rules: [{
                            required: true, message: '请输入你的名字',
                        }],
                    })(
                        <Input placeholder="请输入你的名字" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="需求人所在部门"
                    hasFeedback
                >
                    {getFieldDecorator('department', {
                        rules: [{
                            required: true, message: '请输入你的所属部门',
                        }],
                    })(
                        <Input placeholder="请输入你的所属部门" />
                    )}
                </FormItem>
                <div style={{"position":"relative"}}>

                    <FormItem
                        {...formItemLayout}
                        label="需求目的"
                    >
                        {getFieldDecorator('model_type', {
                            rules: [{
                                required: true, message: '请选择需求目的',
                            }],
                            initialValue:1
                        })(
                            <RadioGroup onChange={this.handleRadioChange.bind(this)}>
                                <Radio value={1} className="common_radio_self" >模型开发</Radio>
                                <Radio value={2} className="common_radio_self" >数据挖掘/分析</Radio>
                                <Radio value={3} className="common_radio_self" >其他</Radio>
                            </RadioGroup>

                        )}
                    </FormItem>
                    {this.state.status?(<FormItem
                        {...formItemLayout}
                        label=" "
                        hasFeedback
                        colon={false}
                        style={{"width":"200px","position":"absolute","left":"50%","top":"0"}}
                        >
                        {getFieldDecorator('other_content', {
                            rules: [{
                                required: true, message: '请输入需求目的',
                            }],
                        })(
                            <Input placeholder="请输入需求目的" />
                        )}
                        </FormItem>):''}

                </div>
                {this.state.modelStatus? (<FormItem
                    {...formItemLayout}
                    label="模型"
                    hasFeedback
                    style={{"width":"50%","marginLeft":"12.5%"}}

                >
                    {getFieldDecorator('model_type_new', {
                        rules: [{
                            required: true, message: '请填写模型名称',
                        }],
                    })(
                        <div>
                            <Input placeholder="请填写模型名称" />
                            {/*<div className="weather_feature_model">模型提取任务审批更快，能使用更多特征</div>*/}
                        </div>
                    )}
                </FormItem>):''}

                <FormItem
                    {...formItemLayout}
                    label="背景"
                    hasFeedback
                >
                    {getFieldDecorator('background', {
                        rules: [{
                            required: true, message: '请填写背景',
                        }],
                    })(
                        <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="为了更快地通过审批，请尽量详细填写" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="现状"
                    hasFeedback
                >
                    {getFieldDecorator('current_situation', {
                        rules: [{
                            required: true, message: '请输入现状',
                        }],
                    })(
                        <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="请输入现状" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="预期收益"
                    hasFeedback
                >
                    {getFieldDecorator('expect_gain', {
                        rules: [{
                            required: true, message: '请填写预期收益',
                        }],
                    })(
                        <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="为了更快地通过审批，请尽量详细填写" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="免责声明"
                >
                    {getFieldDecorator('isagree', {
                        rules: [{
                            required: true, message: '请选择需求目的',
                        }]
                    })(
                        <div className="weather_feature_agree">
                            <div className="weather_feature_warn">
                                这里的天气数据来自彩云天气，数据质量由彩云天气app保证，如果因为天气预测错误带来的损失，大数据策略部数据挖掘组不予负责，如果同意，可以继续申请！
                            </div>
                            <RadioGroup onChange={this.handleAgreeChange.bind(this)}>
                                <Radio value={1} className="common_radio_self" >同意</Radio>
                                <Radio value={0} className="common_radio_self" >不同意</Radio>
                            </RadioGroup>
                        </div>
                    )}
                </FormItem>
                <div style={{"textAlign":"center"}}>
                    <Button type="primary" ref="submitBtn" disabled={!this.state.submitState} htmlType="submit" className="login-form-button"  >
                        提交申请
                    </Button>
                </div>
            </Form>

        )
    }
    handleSubmit(e){
        e.preventDefault();
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(values.model_type==3 && !values.other_content){
                    message.error('需求目的请填写');
                }else{
                    _this.props.handleSubmit(values)
                }

            }
        });
    }

    handleRadioChange(e){
        if(e.target.value == 3){
            this.setState({
                status:true
            })
        }else{
            this.setState({
                status:false
            })
        }
        if(e.target.value == 1){
            this.setState({
                modelStatus:true
            })
        }else{
            this.setState({
                modelStatus:false
            })
        }

    }
    handleAgreeChange(e){
        if(e.target.value == 1){
            this.setState({
                submitState:true
            })
        }else{
            this.setState({
                submitState:false
            })
        }
    }
}

const WeatherFormGroup = Form.create()(WeatherForm);
export default WeatherFormGroup