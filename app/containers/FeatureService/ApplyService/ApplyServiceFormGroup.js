import React from 'react';
import {Link} from 'react-router';
import {getCookie} from '../../../methods';
import { getAjax } from '../../../fetch';
import { Form, Input, Radio,Button,message,Select,Table,Spin} from 'antd';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const Option = Select.Option;

class ApplyServiceForm extends React.Component {
    constructor(props){
        super(props);
        this.columns = [
            {
            title: '名称',
            dataIndex: 'name',
            sorter: (a, b) => {
                return a.name - b.name
            }
        }, {
            title: '逻辑名称',
            dataIndex: 'logical_name',
            sorter: (a, b) => {
                return a.logical_name.localeCompare(b.logical_name)
            }
        }, {
            title: '数据类型',
            dataIndex: 'data_type',
            sorter: (a, b) => {
                return a.data_type - b.data_type
            }
        }];
        this.state = {
            caller:[],
            callerServers:[],
            callerInterfaces:[],
            approver:'',
            categoryStatus:false,
            ///已选中的特征
            selectedRowKeys: [],
            ///表格的数据
            tableData:[],
            ///已选择的乘客或者司机的总数据
            second:[],
            ///默认特征的左侧筛选选中第一个
            activeIndex:1,
            ///特征下分页
            pagination:{
                current:1
            },
            ///搜索来的结果
            searchData:[],
            ////是否进行搜索了
            searchBFlag:false,
            ///修改进来的
            editorData:{},
            ////加载
            loading:true,

        };
        ///所有特征数据
        this.getServiceFeList = [];
        ///默认是乘客特征
        this.service_category = 1;
        ///计数器
        this.ticker=0
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
        console.log('ApplyServiceForm');
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange.bind(this),
        };
        return (

           <Spin tip="Loading..." spinning={this.state.loading} size="large">
               <Form onSubmit={this.handleSubmit.bind(this)} >
                   <div style={{"border": "1px solid #e3e3e3","borderRadius": "4px","paddingTop":"20px","marginBottom":"10px"}}>
                       <FormItem
                           {...formItemLayout}
                           label="中文名称"
                           hasFeedback
                       >
                           {getFieldDecorator('ch_name', {
                               rules: [{
                                   required: true, message: '请输入中文名称',
                               }],
                               initialValue:this.state.editorData.ch_name?this.state.editorData.ch_name:null
                           })(
                               <Input placeholder="请输入中文名称" />
                           )}
                       </FormItem>
                       <FormItem
                           {...formItemLayout}
                           label="英文名称"
                           hasFeedback
                       >
                           {getFieldDecorator('en_name', {
                               rules: [{
                                   required: true, message: '请输入英文名称，只支持英文、数字、下划线',
                                   pattern:/^[a-zA-Z0-9_]+$/g,
                               }],
                               initialValue:this.state.editorData.en_name?this.state.editorData.en_name:null
                           })(
                               <Input placeholder="请输入英文名称，只支持英文、数字、下划线" />
                           )}
                       </FormItem>
                       <div style={{"width":"100%","position":"relative"}}>
                           <FormItem
                               {...formItemLayout}
                               label="caller"
                               hasFeedback
                               style={{"width":"50%","marginLeft":"12.5%"}}
                           >
                               {getFieldDecorator('caller_name', {
                                   rules: [{
                                       required: true, message: '请选择caller',
                                   }],
                                   initialValue:(this.state.editorData.caller_name?this.state.editorData.caller_name:(this.state.caller[0]?this.state.caller[0]:null))
                               })(
                                   <Select placeholder="请选择caller">
                                       {this.state.caller.map((item,i)=>{
                                           return <Option value={item} key={i}>{item}</Option>
                                       })}
                                   </Select>
                               )}
                           </FormItem>
                           <div style={{"position":"absolute","right":"25%","top":"0"}} className="didi-tooltips left">
                               如果没有，则需要
                               <Link to="/feature_service/my_caller" style={{"color":"#fa8919"}}>
                                   申请caller
                               </Link>
                           </div>
                       </div>
                       <FormItem
                           {...formItemLayout}
                           label="调用服务"
                           hasFeedback
                       >
                           {getFieldDecorator('caller_server', {
                               rules: [{
                                   required: true, message: '请选择调用服务',
                               }],
                               initialValue:(this.state.editorData.caller_server?this.state.editorData.caller_server:(this.state.callerServers[0]?this.state.callerServers[0].server:null))
                           })(
                               <Select placeholder="请选择调用服务"  onChange={this.handleCallerServiceChange.bind(this)}>
                                   {this.state.callerServers.map((item,i)=>{
                                       return <Option value={item.server} key={i}>{item.server}</Option>
                                   })}
                               </Select>
                           )}
                       </FormItem>
                       <FormItem
                           {...formItemLayout}
                           label="调用接口"
                           hasFeedback
                       >
                           {getFieldDecorator('caller_interface', {
                               rules: [{
                                   required: true, message: '请选择调用接口',
                               }],
                               initialValue:(this.state.editorData.caller_interface?this.state.editorData.caller_interface:(this.state.callerInterfaces[0]?this.state.callerInterfaces[0].interface:null))
                           })(
                               <Select placeholder="请选择调用接口"  onChange={this.handleCallerInterfaceChange.bind(this)}>
                                   {this.state.callerInterfaces.map((item,i)=>{
                                       return <Option value={item.interface} key={i}>{item.interface}</Option>
                                   })}
                               </Select>
                           )}
                       </FormItem>
                       <FormItem
                           {...formItemLayout}
                           label="调用频次（次/秒）"
                           hasFeedback
                       >
                           {getFieldDecorator('caller_frequency', {
                               rules: [{
                                   required: true, message: '例如: 100',
                                   pattern:/^[0-9]+$/g,
                               }],
                               initialValue:this.state.editorData.caller_frequency?this.state.editorData.caller_frequency:null

                           })(
                               <Input placeholder="例如: 100" />
                           )}
                       </FormItem>
                       <FormItem
                           {...formItemLayout}
                           label="访问机器列表"
                           hasFeedback
                       >
                           {getFieldDecorator('host_list', {
                               rules: [{
                                   required: true, message: '请填写访问机器列表',
                                   //pattern:/^[0-9]+$/g,
                               }],
                               initialValue:this.state.editorData.host_list?this.state.editorData.host_list:null
                           })(
                               <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="请填写访问机器列表" />
                           )}
                       </FormItem>





                       <FormItem
                           {...formItemLayout}
                           label="经办人"
                           hasFeedback
                       >
                           {getFieldDecorator('approver', {
                               rules: [{
                                   required: true, message: '请输入经办人',
                               }],
                               initialValue:this.state.editorData.approver?this.state.editorData.approver:this.state.approver
                           })(
                               <Input placeholder="请输入经办人" readOnly="readOnly" />
                           )}
                       </FormItem>


                       {this.state.categoryStatus?( <div>
                           <FormItem
                               {...formItemLayout}
                               label="请选择分类"
                           >
                               {getFieldDecorator('business_type', {
                                   rules: [{
                                       required: true, message: '请选择分类',
                                   }],
                                   initialValue:this.state.editorData.business_type?this.state.editorData.business_type:1
                               })(
                                   <RadioGroup onChange={this.handleRadioChange.bind(this)}>
                                       <Radio value={1} className="common_radio_self" >乘客</Radio>
                                       <Radio value={2} className="common_radio_self" >司机</Radio>
                                   </RadioGroup>

                               )}
                           </FormItem>
                           <FormItem
                               {...formItemLayout}
                               label="已选择特征"
                               hasFeedback
                           >
                               {getFieldDecorator('feature_list', {
                                   rules: [{
                                       message: '请从下面选择',
                                   }],
                                   initialValue:this.state.selectedRowKeys.length>0?this.state.selectedRowKeys.join(','):null
                               })(
                                   <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} readOnly="readOnly" placeholder="请从下面选择" />
                               )}
                           </FormItem>

                       </div> ):''}
                   </div>
                   {this.state.categoryStatus?( <div className="label-select-box">
                       <div className="label-select-search">
                           <Input
                               placeholder="搜索指标"
                               style={{ "width": "150px","height":"34px","lineHeight":"34px" }}
                               onChange={this.handleSearch.bind(this)}
                           />
                           {this.state.searchBFlag?(<ul>
                               {this.state.searchData.length>0?(this.state.searchData.map((item,i)=>{
                                   return <li onClick={this.handleClickSearchItem.bind(this,item)} key={item.id}>{item.name}</li>

                               })):(<li>没有搜索结果</li>)}
                           </ul>):''}
                       </div>
                       <div className="label-select-content">
                           <div className="label-list-tree">
                               <ul>
                                   {this.state.second.map((item,i)=>{
                                       return <li className={i==this.state.activeIndex?'active':''} onClick={this.handleClickChange.bind(this,i)} key={item.category_id}>{item.cn_second_class_name}</li>

                                   })}
                               </ul>
                           </div>
                           <div className="label-select-table">
                               <Table rowSelection={rowSelection} columns={this.columns} dataSource={this.state.tableData} pagination={this.state.pagination} rowKey={record => record.alias_name} bordered={true} onChange={this.handleTableChange.bind(this)} />
                           </div>
                       </div>


                   </div>):''}





                   <div style={{"textAlign":"center"}}>
                       <Button type="primary" ref="submitBtn" htmlType="submit" className="login-form-button"  >
                           提交申请
                       </Button>
                   </div>
               </Form>
           </Spin>

        )
    }
    componentWillMount(){
        let _this = this;
        document.onclick = function () {
            _this.setState({
                searchData:[],
                searchBFlag:false
            })
        };
        ///获取caller
        getAjax("/oceanus/feature_service/applierCallerName?username="+getCookie('username')).then(res => res.json()).then(data => {
            console.log(data);
            if (data.status == 'success') {
               this.setState({
                   caller:data.caller_names
               });
            }else {
                message.warning("获取caller数据失败")
            }
        });
        ///获取callerMessage
        getAjax("/oceanus/feature_service/callerMessage").then(res => res.json()).then(data => {
            console.log(data);
            if (data.status == 'success') {
                this.setState({
                    callerServers:data.value,
                    callerInterfaces:data.value[0].interface,
                    approver:data.value[0].interface[0].approver
                },this.getEditorData.bind(this));
            }else {
                message.warning("获取callerMessage数据失败")
            }
        });
        ///获取司机和乘客特征
        getAjax("/oceanus/feature_service/getServiceFeList?status=0").then(res => res.json()).then(data => {
            console.log(data);
            if (data.status == 'success') {
                this.getServiceFeList = data.value;
                this.setState({
                    tableData:data.value[1].second[1].features,
                    second:data.value[1].second
                },this.getEditorData.bind(this));
            }else {
                message.warning("获取司机和乘客特征数据失败")
            }
        });

    }
    handleSubmit(e){
        e.preventDefault();
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                _this.props.handleSubmit(values)
                // console.log(values);

            }
        });
    }
    getEditorData(){
        let num = this.ticker;
        num++;
        this.ticker = num;
        if(this.ticker == 2){
            if(this.props.dataId){
                ////表示是修改的
                getAjax("/oceanus/feature_service/getServiceMessageById?id="+this.props.dataId).then(res => res.json()).then(data => {
                    console.log(data);
                    if (data.status == 'success') {
                        if(data.value[0].caller_server == '特征服务'){
                            this.setState({
                                categoryStatus:true,

                            });
                        };
                        ///改变调用的接口列表
                        let callerServersItem = this.state.callerServers.find((item,i)=>{
                            return item.server === data.value[0].caller_server
                        });
                        ////改变选中的特征
                        let selectedRowKeys =data.value[0].feature_list?data.value[0].feature_list.split(','):[];
                        ///改变默认的乘客和司机单选
                        this.service_category = data.value[0].business_type;
                        this.setState({
                            editorData:data.value[0],
                            loading:false,
                            callerInterfaces:callerServersItem.interface,
                            selectedRowKeys,
                            second:this.getServiceFeList[data.value[0].business_type%2].second,
                            tableData:this.getServiceFeList[data.value[0].business_type%2].second[1].features


                        })
                    }else {
                        message.warning("获取修改的初始数据")
                    }
                });
            }else{
                this.setState({
                    loading:false
                })
            }
        };


    }

    handleRadioChange(e){
        let index = e.target.value;
        this.service_category = index;
        this.setState({
            tableData:this.getServiceFeList[index%2].second[1].features,
            second:this.getServiceFeList[index%2].second,
            activeIndex:1,
            selectedRowKeys:[],
            pagination:{
                current:1
            }
        });
        this.props.form.setFieldsValue({
            feature_list: null
        });

    }
    handleClickChange(i){
        this.setState({
            tableData:this.state.second[i].features,
            activeIndex:i,
            pagination:{
                current:1
            }
        })
    }
    handleTableChange(pagination){
        this.setState({
            pagination:{
                current:pagination.current
            }
        })
    }
    handleSearch(e){
        console.log(e.target.value);
        let val = e.target.value;
        let _this = this;
        clearTimeout(this.timer);
        if(!val){
            return;
        };
        this.timer = setTimeout(function () {
            ///获取搜索过来内容
            getAjax("/oceanus/feature_service/searchServiceField?search_field="+val+"&service_category="+ _this.service_category).then(res => res.json()).then(data => {
                console.log(data);
                if (data.status == 'success') {
                    _this.setState({
                        searchData:data.value,
                        searchBFlag:true
                    });
                }else{
                    message.warning("获取数据失败")
                }
            });
        },500)

    }
    handleClickSearchItem(item){
        let activeIndex = 0;
        let selected = '';
        let currentPage = 1;
        for(let i=0; i<this.state.second.length; i++){
            if(this.state.second[i].en_second_class_name == item.en_second_class_name){
                activeIndex = i;
                break;
            }
        };
        for(let i=0; i<this.state.second[activeIndex].features.length; i++){
            if(this.state.second[activeIndex].features[i].alias_name == item.alias_name){
                selected = item.alias_name;
                currentPage = Math.ceil(i/10);
                break;
            }
        };
        let selectedRowKeys = this.state.selectedRowKeys;
        selectedRowKeys.push(selected);
        this.setState({
            tableData:this.getServiceFeList[this.service_category].second[activeIndex].features,
            second:this.getServiceFeList[this.service_category].second,
            activeIndex,
            selectedRowKeys,
            pagination:{
                current:currentPage
            },
            searchData:[],
            searchBFlag:false
        });
        this.props.form.setFieldsValue({
            feature_list: selectedRowKeys.join(',')
        });
    }
    handleCallerServiceChange(val){
        let callerServersItem = this.state.callerServers.find((item,i)=>{
            return item.server === val
        });
        if(val === '特征服务'){
            this.setState({
                categoryStatus:true,
                callerInterfaces:callerServersItem.interface
            })
        }else{
            this.setState({
                categoryStatus:false,
                callerInterfaces:callerServersItem.interface
            })
        };
        this.props.form.setFieldsValue({
            caller_interface: callerServersItem.interface[0].interface
        });
        this.props.form.setFieldsValue({
            approver: callerServersItem.interface[0].approver
        });
    }
    handleCallerInterfaceChange(val){
        let callerInterfacesItem = this.state.callerInterfaces.find((item,i)=>{
            return item.interface === val
        });
        this.setState({
            approver:callerInterfacesItem.approver
        });
        if(val === '根据实验获取指定特征接口http(exp_feature)' || val === '根据实验获取指定特征接口thrift(exp_feature)'){
            this.setState({
                categoryStatus:true
            })
        }else{
            this.setState({
                categoryStatus:false
            })
        };
    }
    onSelectChange(selectedRowKeys){
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
        this.props.form.setFieldsValue({
            feature_list:selectedRowKeys.length>0? selectedRowKeys.join(','):null
        });
    }
}

const ApplyServiceFormGroup = Form.create()(ApplyServiceForm);
export default ApplyServiceFormGroup