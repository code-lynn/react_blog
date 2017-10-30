import React, { Component } from 'react';
import { Button,Input,message,Modal } from 'antd';
import TableItem from './TableItem.js'
import FeatureItem from './FeatureItem.js'
import Util from './Util.js'
import {getAjax,postAjax} from '../../../fetch'
import {fromJS,set} from 'immutable'
import {hashHistory} from 'react-router'
import './index.less'
export default class FeatureAdjunction extends Component{
    constructor(props){
        super(props)
        this.dataId = this.props.params.id?this.props.params.id.substring(1,):'';
        // this.editData_table = {}
        this.state = {
            editData_table:{},
            demotion_info_show:false,
            previewVisible:false,
            hive_table:"",
            primary_key:"",
            filter_condition:"",
            extract_period:'1',
            partition :"concat_ws('-',year, month, day)='${year}-${month}-${day}",
            demotion:"1",
            feature_arr:[
                {
                    user_type:"1",
                    business_type:"0",
                    attribute:"-1",
                    en_name:"",
                    ch_name:"",
                    data_type:"string",
                    default_value:"",
                    responsible_person:"",
                    source_field:"",
                    comments:"",
                    explanation:"",  category:"1111",
                    theme:"基础信息"
                }
            ]
        }
    }
    render(){
        return (
            <div className='feature-adjunction-content'>
                <TableItem 
                    handleTableSelect = {this.handleTableSelect}
                    handleTableChange = {this.handleTableChange}
                    hive_table = {this.state.hive_table}
                    filter_condition = {this.state.filter_condition}
                    extract_period = {this.state.extract_period}
                    partition = {this.state.partition}
                    primary_key = {this.state.primary_key}
                />
                {
                    this.state.feature_arr.map((item,index)=>{
                       return <FeatureItem 
                                key={index} 
                                index={index}
                                feature_arr={item} 
                                handleDeleteFeature={this.handleDeleteFeature}
                                handleFeatureChange = {this.handleFeatureChange}
                                handleBusinessFresh = {this.handleBusinessFresh}
                                defaultData = {this.state.feature_arr[index]}
                                handleFeatureSelect = {this.handleFeatureSelect}
            
                                />
                    })
                }
                <Util 
                    handleAddFeature={this.handleAddFeature}
                    handleValiFeature = {this.handleValiFeature}
                    handleValiTable = {this.handleValiTable}  
                    handleSubmit = {this.handleSubmit}
                    previewVisible = {this.state.previewVisible}
                    showModal = {this.showModal}
                    handleOk = {this.handleOk}
                    handleCancel = {this.handleCancel}
                    hive_table = {this.state.hive_table}
                    partition = {this.state.partition}
                    feature_arr = {this.state.feature_arr}
                    dataId = {this.dataId}
                    handleEdit = {this.handleEdit}
                />
            </div>
        )
    }
 
    componentDidMount = () => {
      if(this.dataId!=""){
        getAjax(`/oceanus/offline_feature/getOfflineFeatureById?id=${this.dataId}`)
            .then(res=>res.json())
            .then(res=>{
                let obj = {}
                let table = {}
                obj.user_type = res.value.user_type
                obj.business_type = res.value.business_type
                obj.attribute = res.value.attribute
                obj.en_name = res.value.en_name
                obj.ch_name = res.value.ch_name
                obj.data_type = res.value.data_type
                obj.default_value = res.value.default_value
                obj.responsible_person = res.value.responsible_person
                obj.source_field = res.value.source_field
                obj.comments = res.value.comments
                obj.explanation = res.value.explanation
                obj.category = res.value.category
                obj.theme = res.value.theme
                let feature_arr = []
                feature_arr.push(obj)
                this.setState({
                                feature_arr:feature_arr,
                                primary_key:res.value.primary_key,
                                filter_condition:res.value.filter_condition,
                                partition:res.value.partition,
                                extract_period:res.value.extract_period,
                                hive_table:res.value.hive_table
                            })
            })
      }
    }
    
    handleAddFeature = ()=>{
        let _feature_arr = this.state.feature_arr
        _feature_arr.push({
            user_type:"1",
            business_type:"0",
            attribute:"-1",
            en_name:"",
            ch_name:"",
            data_type:"string",
            default_value:"",
            responsible_person:"",
            source_field:"",
            comments:"",
            explanation:"",
            category:"1111",
            theme:"基础信息"
        });
        this.setState({feature_arr:_feature_arr})
    }
    handleDeleteFeature=(key)=>{
        let _feature_arr = JSON.parse(JSON.stringify(this.state.feature_arr))
        _feature_arr.splice(key,1)
        this.setState({feature_arr:_feature_arr})        
    }
    handleTableChange = (e,prop)=>{
        //封装表格信息变化的函数，第二个参数为对应的字段的key
        this.setState({[prop]:e.target.value})
    }
    handleTableSelect = (value,prop)=>{
        //封装表格信息下拉框的选择函数 第二个参数为对应的字段的key
        this.setState({[prop]:value})
    }
    handleFeatureChange=(e,index,prop)=>{
        //封装特征信息变化的函数，第二个函数是对应的特征条目数，第三个参数为对应字段的key
        let _feature_arr = JSON.parse(JSON.stringify(this.state.feature_arr))
        _feature_arr[index][[prop]] = e.target.value;
        this.setState({feature_arr:_feature_arr})
  
    }
    handleBusinessFresh = (value,index)=>{
        let _feature_arr = JSON.parse(JSON.stringify(this.state.feature_arr))
        _feature_arr[index]["business_type"] = value;
        this.setState({feature_arr:_feature_arr})
    }
    handleFeatureSelect = (value,index,prop)=>{
        let _feature_arr = JSON.parse(JSON.stringify(this.state.feature_arr))
        _feature_arr[index][[prop]] = value;
        this.setState({feature_arr:_feature_arr})
  
    }
    handleSubmit = ()=>{
        let postData = {}
        let table = {}
        let feature = this.state.feature_arr
        if(feature.length==0){
            message.error("请至少添加一个特征")
            return
        }
        table.hive_table = this.state.hive_table
        table.primary_key = this.state.primary_key
        table.partition = this.state.partition        
        table.filter_condition = this.state.filter_condition        
        table.extract_period = this.state.extract_period
        table.demotion = this.state.demotion
        postData.table = JSON.stringify(table)
        postData.feature = JSON.stringify(feature)
        console.log(postData)
        postAjax("/oceanus/offline_feature/featuresAdd",postData).then(res=>res.json()).then(res=>{
            if(res.status === "success"){
                window.location.reload()
            } else {
                message.error("添加失败")
            }
        })
    }
    handleValiFeature = ()=>{
        //验证特征是否填写完整的函数
        let _feature_arr = JSON.parse(JSON.stringify(this.state.feature_arr))
        let warning_arr = []
        
      
        
        _feature_arr.forEach(function(item,index){
            item.ch_name == ""?warning_arr.push(`第${index+1}条特征的中文名称不能为空`):""
            item.en_name == ""?warning_arr.push(`第${index+1}条特征的英文名称不能为空`):""
            item.data_type == ""?warning_arr.push(`第${index+1}条特征的数据类型不能为空`):""
            item.default_value == ""?warning_arr.push(`第${index+1}条特征的默认值不能为空`):""
            item.responsible_person == ""?warning_arr.push(`第${index+1}条特征的接口人不能为空`):""
            item.source_field == ""?warning_arr.push(`第${index+1}条特征的源字段名称不能为空`):""
            // item.category == ""?warning_arr.push(`第${index+1}条特征的特征类别不能为空`):""
            item.comments == ""?warning_arr.push(`第${index+1}条的备注不能为空`):""
            item.explanation == ""?warning_arr.push(`第${index+1}条的解释不能为空`):""
        })
        
        return warning_arr;
    }
    handleValiTable = ()=>{
        let warning_arr = []
        let reg = /^[0-9a-zA-Z_\.]{1,}$/
        reg.test(this.state.hive_table)&&this.state.hive_table.indexOf(".")!=-1?"":warning_arr.push(`hive源表必须包含"."，且只能是数字字母下划线`)
        this.state.hive_table == ""?warning_arr.push("hive源表不能为空"):""
        this.state.primary_key == ""?warning_arr.push("主键不能为空"):""
        return warning_arr;
    }
    showModal = () => {
        this.setState({
            previewVisible: true,
        });
      }
    handleOk = (e) => {
        this.setState({
            previewVisible: false,
        });
    }
    handleCancel = (e) => {
        this.setState({
            previewVisible: false,
        });
    }
    handleEdit = (id) => {
        console.log(`test`)
        let postEditData = {}
        let hive_table = this.state.hive_table
        let primary_key = this.state.primary_key
        let filter_condition = this.state.filter_condition
        let partition = this.state.partition
        let demotion = this.state.demotion
        let extract_period = this.state.extract_period
        let feature = this.state.feature_arr[0]
        postEditData = {
            ...(feature),
            id:id,
            hive_table:hive_table,
            primary_key:primary_key,
            filter_condition:filter_condition,
            partition:partition,
            extract_period:extract_period,
            demotion:demotion
        }
        postAjax(`/oceanus/offline_feature/editOfflineFeature`,postEditData)
            .then(res=>res.json())
            .then(res=>{
                if(res.status == "success"){
                    message.success('修改成功')                    
                    hashHistory.push('/feature_manage/feature_ad_list')
                } else{
                    message.error('修改失败')
                }
            })
    }
}