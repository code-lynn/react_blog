import React,{Component} from 'react'
import { Form, Input,Modal,Button,message,Spin,Select} from 'antd';
const FormItem = Form.Item;
import { is } from 'immutable';
const Option = Select.Option;

class EditorFeature extends Component {
    constructor(props){
        super(props);
        this.scenarioArr = ['未知', '冒泡', '分单', '冒泡、分单', '常规', '冒泡、常规', '分单、常规', '冒泡、分单、常规'];
        this.scenarioArrInit = ['冒泡','分单','常规'];

        this.firstCategory = [];
        this.secondCategory = [];
        ///二级类别的显示和隐藏
        this.secondBFlag = false;
        this.secondTicker = 0;
        ////状态数据
        this.status = [{name:'启用',val:"0"},{name:'禁用',val:"1"}];
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
        // console.log(this.props.tableNameArr);
        let scenarioArrDefault = [];
        let num = 0;
        if(this.props.item.scenario){
            ////是够有场景
            if(this.props.item.scenario[0]){
                ///当场景是数组的时候
                this.props.item.scenario.forEach(val=>{num+=parseInt(val)})

            }else{
                ///当场景是字符串的数组的时候
                num = parseInt(this.props.item.scenario);
            }
            if(this.scenarioArr[num].indexOf('、')>-1){
                scenarioArrDefault = this.scenarioArr[num].split('、');
            }else{
                scenarioArrDefault = [this.scenarioArr[num]];
            }
        }else{
            scenarioArrDefault = null;
        };
        let firstCategoryInitValue = '';
        let secondCategoryInitValue = '';
        if(this.props.categoryArrInit.length>0){
            if(this.firstCategory.length == 0){
                this.firstCategory =this.props.categoryArrInit;
            };
            ///判断是够有第一个类型
            if(this.props.item.category){
                this.firstCategory.forEach((item,i)=>{
                    if(item.category === this.props.item.category){
                        ///说明没有二类
                        firstCategoryInitValue = item.cn_first_class_name;
                    }
                });
                if(!firstCategoryInitValue){
                    ///有二类
                    let firstArr = this.firstCategory;
                    let bFlag = true;
                    for(let j=0; j<firstArr.length;j++){
                        if(firstArr[j].category === -1){
                            ///说明有二类
                            let secondArr = firstArr[j].second;
                            for(let i=0; i<secondArr.length; i++){
                                if(secondArr[i].category === this.props.item.category){
                                    firstCategoryInitValue = firstArr[j].en_first_class_name;
                                   if(this.secondTicker==0){
                                       secondCategoryInitValue = secondArr[i].en_second_class_name;
                                       this.secondBFlag = true;
                                       this.secondCategory = secondArr;
                                   }
                                    bFlag = false;
                                    break;
                                }
                            }
                        };
                        if(!bFlag){
                            break;
                        }
                    }

                }



            }



        }
        return(
            <div>
                <Modal
                    title='查看'
                    visible={this.props.visibleModal}
                    onOk={()=>{this.secondTicker==0;this.props.handleViewCancel()}}
                    onCancel={()=>{this.secondTicker==0;this.props.handleViewCancel()}}
                    footer={false}
                    item={this.props.item}
                    className='public_caller_modal'
                >
                    <Form onSubmit={this.handleSubmit.bind(this)}  >
                        <FormItem
                            {...formItemLayout}
                            label="特征英文名称"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('name', {
                                rules: [{
                                    required: true, message: '请输入特征英文名称',
                                }],
                                initialValue:this.props.item.name?this.props.item.name:null
                            })(
                                <Input readOnly="readOnly" placeholder="请输入特征英文名称" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="特征中文名称"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('logical_name', {
                                rules: [{
                                    required: true, message: '请输入特征中文名称',
                                }],
                                initialValue:this.props.item.logical_name?this.props.item.logical_name:null
                            })(
                                <Input placeholder="请输入特征中文名称" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="表名"
                            hasFeedback
                        >
                            {getFieldDecorator('table_name', {
                                rules: [{
                                    required: true, message: '请输入表名',
                                }],
                                initialValue:this.props.item.table_name
                            })(
                                <Select placeholder="请输入表名">
                                    {this.props.tableNameArr.map((item,i)=>{
                                        return <Option value={item} key={"option_"+i}>{item}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="注释"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('comment', {
                                rules: [{
                                     message: '请输入注释',
                                }],
                                initialValue:this.props.item.comment?this.props.item.comment:null
                            })(
                                <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="请输入注释" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="值类型"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('data_type', {
                                rules: [{
                                    required: true, message: '请输入值类型',
                                }],
                                initialValue:this.props.item.data_type?this.props.item.data_type:null
                            })(
                                <Input placeholder="请输入值类型" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="特征缺省值"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('default_value', {
                                rules: [{
                                    message: '请输入特征缺省值',
                                }],
                                initialValue:this.props.item.default_value?this.props.item.default_value:null
                            })(
                                <Input placeholder="请输入特征缺省值" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="特征值解释"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('explanation', {
                                rules: [{
                                    message: '请输入特征值解释',
                                }],
                                initialValue:this.props.item.explanation?this.props.item.explanation:null
                            })(
                                <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="请输入特征值解释" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="直方图数据"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('histogram_data', {
                                rules: [{
                                    message: '请输入直方图数据'
                                }],
                                initialValue:this.props.item.histogram_data?this.props.item.histogram_data:null
                            })(
                                <Input placeholder="请输入直方图数据" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="样例"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('sample', {
                                rules: [{
                                    message: '请输入样例'
                                }],
                                initialValue:this.props.item.sample?this.props.item.sample:null
                            })(
                                <Input placeholder="请输入样例" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标签"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('tag', {
                                rules: [{
                                    message: '请输入标签'
                                }],
                                initialValue:this.props.item.tag?this.props.item.tag:null
                            })(
                                <Input placeholder="请输入标签" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="标签"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('tag', {
                                rules: [{
                                    message: '请输入标签'
                                }],
                                initialValue:this.props.item.tag?this.props.item.tag:null
                            })(
                                <Input placeholder="请输入标签" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="计算逻辑"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('cal_logic', {
                                rules: [{
                                    message: '请输入计算逻辑'
                                }],
                                initialValue:this.props.item.cal_logic?this.props.item.cal_logic:null
                            })(
                                <Input placeholder="请输入计算逻辑" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="场景"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('scenario', {
                                rules: [{
                                    required: true, message: '请输入场景'
                                }],
                                initialValue:scenarioArrDefault
                            })(
                                <Select placeholder="请输入场景" mode="multiple">
                                    {this.scenarioArrInit.map((item,i)=>{
                                        return <Option value={item} key={i}>{item}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                        <div style={{"position":"relative","paddingLeft":"70px"}}>
                            <FormItem
                                {...formItemLayout}
                                label="类别"
                                hasFeedback={true}
                                style={{"width":"200px"}}
                            >
                                {getFieldDecorator('first_level_category', {
                                    rules: [{
                                        required: true, message: '请输入类别'
                                    }],
                                    initialValue:firstCategoryInitValue?firstCategoryInitValue:(this.firstCategory.length>0?this.firstCategory[0].en_first_class_name:null)
                                })(
                                    <Select placeholder="请输入类别" onChange={this.handleFirstCategoryChange.bind(this)}>
                                        {this.firstCategory.map((item,i)=>{
                                            return <Option value={item.en_first_class_name} key={i}>{item.cn_first_class_name}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            {(this.secondBFlag)?(<FormItem
                                {...formItemLayout}
                                label=""
                                hasFeedback={true}
                                style={{"width":"200px","position":"absolute","left":"250px","top":"0"}}
                            >
                                {getFieldDecorator('second_level_category', {
                                    rules: [{
                                        message: ''
                                    }],
                                    initialValue:secondCategoryInitValue?secondCategoryInitValue:(this.secondCategory.length>0?this.secondCategory[0].en_second_class_name:null)
                                })(
                                    <Select placeholder="">
                                        {this.secondCategory.map((item,i)=>{
                                            return <Option value={item.en_second_class_name} key={i}>{item.cn_second_class_name}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>):''}
                        </div>
                        <FormItem
                            {...formItemLayout}
                            label="状态"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('status', {
                                rules: [{
                                    required:true,message: '请输入状态'
                                }],
                                initialValue:this.props.item.name?(this.props.item.status+''):null
                            })(
                                <Select placeholder="请输入状态">
                                    <Option value={"0"} key={0}>启用</Option>
                                    <Option value={"1"} key={1}>禁用</Option>
                                </Select>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="特征类型"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('type', {
                                rules: [{
                                    message: '请输入特征类型'
                                }],
                                initialValue:this.props.item.name?(this.props.item.type?this.props.item.type+'':null):null
                            })(
                                <Select placeholder="请输入特征类型">
                                    <Option value={"1"} key={0}>统计类</Option>
                                    <Option value={"2"} key={1}>实时类</Option>
                                    <Option value={"3"} key={2}>挖掘类</Option>
                                </Select>
                            )}
                        </FormItem>

                        <FormItem
                            {...formItemLayout}
                            label="更新频次"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('update_frequency', {
                                rules: [{
                                    message: '请输入更新频次',
                                }],
                                initialValue:this.props.item.update_frequency?this.props.item.update_frequency:null
                            })(
                                <Input placeholder="请输入更新频次" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="存储时间"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('storage_period', {
                                rules: [{
                                    message: '请输入存储时间',
                                }],
                                initialValue:this.props.item.storage_period?this.props.item.storage_period:null
                            })(
                                <Input placeholder="请输入存储时间" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="来源"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('source', {
                                rules: [{
                                    message: '请输入来源',
                                }],
                                initialValue:this.props.item.source?this.props.item.source:null
                            })(
                                <Input placeholder="请输入来源" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="维护方"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('maintainer', {
                                rules: [{
                                    message: '请输入维护方',
                                }],
                                initialValue:this.props.item.maintainer?this.props.item.maintainer:null
                            })(
                                <Input placeholder="请输入维护方" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="版本"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('version', {
                                rules: [{
                                    message: '请输入版本',
                                }],
                                initialValue:this.props.item.version?this.props.item.version:null
                            })(
                                <Input placeholder="请输入版本" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="流量通道"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('flow_channel', {
                                rules: [{
                                    message: '请输入流量通道',
                                }],
                                initialValue:this.props.item.flow_channel?this.props.item.flow_channel:null
                            })(
                                <Input placeholder="请输入流量通道" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="服务或接口名字（依赖服务信息）"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('dependency_service_info_interface_name', {
                                rules: [{
                                    message: '请输入服务或接口名字（依赖服务信息）',
                                }],
                                initialValue:this.props.item.dependency_service_info_interface_name?this.props.item.dependency_service_info_interface_name:null
                            })(
                                <Input placeholder="请输入服务或接口名字（依赖服务信息）" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="线下访问方式（依赖服务信息）"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('dependency_service_info_offline_access_mode', {
                                rules: [{
                                    message: '请输入线下访问方式（依赖服务信息）',
                                }],
                                initialValue:this.props.item.dependency_service_info_offline_access_mode?this.props.item.dependency_service_info_offline_access_mode:null
                            })(
                                <Input placeholder="请输入线下访问方式（依赖服务信息）" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="线上访问方式（依赖服务信息）"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('dependency_service_info_online_access_mode', {
                                rules: [{
                                    message: '请输入线上访问方式（依赖服务信息）',
                                }],
                                initialValue:this.props.item.dependency_service_info_online_access_mode?this.props.item.dependency_service_info_online_access_mode:null
                            })(
                                <Input placeholder="请输入线上访问方式（依赖服务信息）" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="服务或接口名字（线上访问信息）"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('online_access_info_interface_name', {
                                rules: [{
                                    message: '请输入服务或接口名字（线上访问信息）',
                                }],
                                initialValue:this.props.item.online_access_info_interface_name?this.props.item.online_access_info_interface_name:null
                            })(
                                <Input placeholder="请输入服务或接口名字（线上访问信息）" />
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="访问方式（线上访问信息）"
                            hasFeedback={true}
                        >
                            {getFieldDecorator('online_access_info_access_mode', {
                                rules: [{
                                    message: '请输入访问方式（线上访问信息）',
                                }],
                                initialValue:this.props.item.online_access_info_access_mode?this.props.item.online_access_info_access_mode:null
                            })(
                                <Input placeholder="请输入访问方式（线上访问信息）" />
                            )}
                        </FormItem>


                        <div style={{"textAlign":"center"}}>
                            <Button type="primary" style={{"margin":"0 5px"}} className="login-form-button" onClick={this.handleDelete.bind(this)}  >
                                删除
                            </Button>
                            <Button type="primary" ref="submitBtn" htmlType="submit" className="login-form-button"  >
                                保存
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        )
    }
    componentDidMount(){

    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        ///console.log('shouldComponentUpdate');
        if(nextState === null){
            nextState={}
        }
        if(nextProps === null){
            nextProps={}
        }
        const thisProps = this.props || {}, thisState = this.state || {};
        ////初始化数据  当传进来的this。props.item 有值的时候
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
    componentDidUpdate(){

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
    handleFirstCategoryChange(val){
        ///console.log(val);
        let firstCategoryItem = this.firstCategory.find((item)=>{
            return val === item.en_first_class_name;
        });
        this.secondTicker = 1;
        this.secondCategory = firstCategoryItem.second;
        if(this.secondCategory.length==0){
            this.secondBFlag = false;
        }else{
            this.secondBFlag = true;
        }
    }
    handleDelete(){
        this.props.handleDeleteItem(this.props.item);
    }

}

const EditorFeatureFormGroup = Form.create()(EditorFeature);
export default EditorFeatureFormGroup