import React, { Component } from 'react';
import {getAjax,postAjax} from '../../../fetch'
import HiveTable from './HiveTable'
import {Modal,Input,Col,Row,Button,message,Select,Form} from 'antd'
import './index.less'
const Option = Select.Option
export default class FeatureAdjunctionList extends Component{
    constructor(props){
        super(props)
        this.state = {
            requirement:[],
            episodeData:[],
            permission:false,
            detailModal:false,
            item:{},
            table:[],
            checkModal:false,
            checkAllModal:false,
            closeModal:false,
            importModal:false,
            maxEpisode:0,
            scenario:1,
            alias:"",
            group:"fe"
        }
    }
    render(){
        let _this = this
        return (
            
            <div className="ad-list">

                <div className="requirement-pool">
                    <h3 style={{fontSize:18,color:"#fa8919",fontWeight:"bold",paddingBottom:10}}>需求池</h3>
                    <Button size="large" type="danger" onClick={this.showModal.bind(this,`closeModal`)} style={{color:"#fa8919",borderColor:"#fa8919",position:"absolute",right:10,top:0}} ghost>关闭本次需求</Button>
                    {   
        
                        this.state.requirement.map(function(item ,index){
                            return (<HiveTable permission={_this.state.permission} showModal={_this.showModal.bind(this)} mappingData={item} key={index} tableType={`requirement`}/>)
                        })
                    }
                </div>
                {
                    this.state.episodeData.map(function(item,index){
                        return(
                                <div className="episode" key={index}>
                                    <h3 style={{fontSize:18,color:"#fa8919",fontWeight:"bold",paddingBottom:10}}>第{item.key}期数据</h3>
                                    <Button  size="large" type="danger" style={{color:"#fa8919",borderColor:"#fa8919",position:"absolute",right:10,top:0}} ghost> 
                                        <a href={`/oceanus/offline_feature/exportCsvForTagsystem?episode=${item.key}`}>下载本期特征</a> 
                                    </Button>
                                    {
                                        item.tableData.map(function(item,index){
                                            return (<HiveTable permission={_this.state.permission} showModal={_this.showModal} mappingData={item} key={index} tableType={`episode`}/>)
                            
                                        })
                                    }
                                </div>
                        )
                    })
                }
                
                <Modal 
                    className="detail-modal" 
                    onOk={this.handleOk.bind(this,`detailModal`)} 
                    onCancel={this.handleCancel.bind(this,`detailModal`)} 
                    visible={this.state.detailModal}
                    title = {`详情`}
                    width = {1000}
                    key={this.state.item.id}
                    >
                    <Row gutter={128}>
                        <Col span={10} offset={2}>
                            <label className="control-label">特征英文名：</label>
                            <Input value={this.state.item.en_name} readOnly />
                        </Col>
                        <Col span={10}>
                            <label className="control-label">特征中文名：</label>
                            <Input value={this.state.item.ch_name} readOnly />
                        </Col> 
                    </Row>
                    <div style={{margin:12}}></div>                    
                    <Row gutter={128}>
                        <Col span={10} offset={2}>
                            <label className="control-label">默认值：</label>
                            <Input value={this.state.item.default_value} readOnly />
                        </Col>
                        <Col span={10}>
                            <label className="control-label">源字段名称：</label>
                            <Input value={this.state.item.source_field} readOnly />
                        </Col> 
                    </Row>
                    <div style={{margin:12}}></div>                    
                    <Row gutter={128}>
                        <Col span={10} offset={2}>
                            <label className="control-label">数据接口人：</label>
                            <Input value={this.state.item.responsible_person} readOnly />
                        </Col>
                        <Col span={10}>
                            <label className="control-label">数据类型：</label>
                            <Input value={this.state.item.data_type} readOnly />                            
                        </Col> 
                    </Row>
                    <div style={{margin:12}}></div>                    
                    <Row gutter={128}>
                        <Col span={10} offset={2}>
                            <label className="control-label">特征类别：</label>
                            <Input value={this.state.item.category} readOnly />
                        </Col>
                        <Col span={10}>
                            <label className="control-label">特征主题：</label>
                            <Input value={this.state.item.theme} readOnly />
                        </Col> 
                    </Row>
                    <div style={{margin:12}}></div>
                    <Row gutter={128}>
                        <Col span={10} offset={2}>
                            <label className="control-label">分区格式</label>
                            <Input value={this.state.item.partition} readOnly />
                        </Col>
                        <Col span={10}>
                            <label className="control-label">提取周期：</label>
                            <Input value={this.state.item.extract_period} readOnly />
                        </Col> 
                    </Row>                    
                </Modal>
                <Modal
                    onOk={this.handleOk.bind(this,`checkModal`)} 
                    onCancel={this.handleCancel.bind(this,`checkModal`)} 
                    visible={this.state.checkModal}
                    title = {`审核特征`}
                    footer={null}
                    >
                    <div style={{margin:20}}></div>
                    <Row gutter={32}>
                        <Col span={7} offset={6}>
                            <Button type="danger" onClick={this.handleCheckFeature.bind(this,this.state.item,0)} style={{color:"#108ee9",borderColor:"#108ee9"}} className="confirm-btn" size="large" ghost>通过</Button>
                        </Col>
                        <Col span={8}>
                            <Button type="danger" onClick={this.handleCheckFeature.bind(this,this.state.item,4)} style={{color:"#108ee9",borderColor:"#108ee9"}} className="confirm-btn" size="large" ghost>不通过</Button>
                        </Col>
                    </Row>
                    <div style={{margin:20}}></div>
                </Modal>
                <Modal
                    onOk={this.handleOk.bind(this,`checkAllModal`)} 
                    onCancel={this.handleCancel.bind(this,`checkAllModal`)} 
                    visible={this.state.checkAllModal}
                    title = {`批量审核特征`}
                    footer={null}
                    >
                    <div style={{margin:20}}></div>
                    <Row gutter={32}>
                        <Col span={7} offset={6}>
                            <Button type="danger" onClick={this.handleCheckAll.bind(this,this.state.table,0)} style={{color:"#108ee9",borderColor:"#108ee9"}} className="confirm-btn" size="large" ghost>通过</Button>
                        </Col>
                        <Col span={8}>
                            <Button type="danger" onClick={this.handleCheckAll.bind(this,this.state.table,4)} style={{color:"#108ee9",borderColor:"#108ee9"}} className="confirm-btn" size="large" ghost>不通过</Button>
                        </Col>
                    </Row>
                    <div style={{margin:30}}></div>
                    <Row>
                        <Col span={12} offset={11}>
                            <span style={{color:"#ff886c",fontSize:12}}>会使得所有未审核的特变为通过或者未通过</span>
                        </Col>
                    </Row>
                </Modal>
                <Modal
                    onOk={this.handleOk.bind(this,`closeModal`)} 
                    onCancel={this.handleCancel.bind(this,`closeModal`)} 
                    visible={this.state.closeModal}
                    title = {`关闭本次需求`}
                    footer={null}
                    >
                    <div style={{margin:10}}></div>                
                    <Row>
                        <Col span={14} offset={5}>
                            <p style={{width:"100%",color:"#666",fontSize:14,textAlign:"center"}}>当前最大期数为{this.state.maxEpisode}期,数据将自动添加到第{this.state.maxEpisode+1}期数据中去，是否确认添加?</p>
                        </Col>
                    </Row>
                    <div style={{margin:20}}></div>
                    <Row gutter={32}>
                        <Col span={7} offset={6}>
                            <Button type="danger" onClick={this.handleClose.bind(this)}  style={{color:"#108ee9",borderColor:"#108ee9"}} className="confirm-btn" size="large" ghost>确认</Button>
                        </Col>
                        <Col span={8}>
                            <Button type="danger" onClick={this.handleCancel.bind(this,`closeModal`)} style={{color:"#108ee9",borderColor:"#108ee9"}} className="confirm-btn" size="large" ghost>取消</Button>
                        </Col>
                    </Row>
                    <div style={{margin:30}}></div>
                    
                </Modal>
                <Modal
                    onOk={this.handleOk.bind(this,`importModal`)} 
                    onCancel={this.handleCancel.bind(this,`importModal`)} 
                    visible={this.state.importModal}
                    title = {`导入特征`}
                    footer={null}
                    >
                    <div style={{margin:10}}></div>                
                    <Row>
                        <Col span={2} offset={5}>
                        <label className="import-label">场景：</label>
                        </Col>
                        <Col span={12}>
                            <Select defaultValue={"1"} onChange={this.handleScenario.bind(this)} style={{width:"100%"}}>
                                <Option value="1">冒泡</Option>
                                <Option value="2">发单</Option>
                                <Option value="3">冒泡+发单</Option>
                                <Option value="4">常规</Option>
                                <Option value="5">冒泡+常规</Option>
                                <Option value="6">发单+常规</Option>
                                <Option value="7">冒泡+发单+常规</Option>
                                
                            </Select>
                        </Col>
                    </Row>
                    <div style={{margin:10}}></div>
                    <Row>
                        <Col span={2} offset={5} >
                            <label className="import-label">组名：</label>
                        </Col>
                        <Col span={12}>
                        <Select defaultValue={"fe"} onChange={this.handleGroup.bind(this)} style={{width:"100%"}}>
                                <Option value="fe">fe</Option>
                                <Option value="decision">decision</Option>
                            </Select>
                        </Col>
                    </Row>
                    <div style={{margin:10}}></div>                    
                    <Row>
                        <Col span={2} offset={5}>
                            <label className="import-label">别名：</label>
                        </Col>
                        <Col span={12}>
                           <Input onChange={this.handlealias.bind(this)} defaultValue={this.state.item.en_name}/>
                        </Col>
                    </Row>
                    <div style={{margin:30}}></div>
                    <Row>
                        <Col span={4} offset={16}>
                            <Button size="large" type="primary" onClick={this.handleImport.bind(this,this.state.item)}>导入</Button>
                        </Col>
                        <Col span={4}>
                            <Button size="large" onClick={this.handleCancel.bind(this,"importModal")}>取消</Button>
                        </Col>
                        
                    </Row>
                </Modal>
            </div>
            
        )
    }
    componentWillMount = () => {
        getAjax("/oceanus/offline_feature/queryAllFeatures")
            .then(res=>res.json())
            .then(res=>{
                let sourceData = []
                let episodeArr = Object.keys(res.value)
                let maxEpisode = parseInt(episodeArr[episodeArr.length-2])
                isNaN(maxEpisode)?"":this.setState({maxEpisode:maxEpisode})
                for(var key in res.value){
                    var obj = {}
                    obj.key = key ;
                    obj.value = res.value[key]
                    sourceData.push(obj)
                }
                sourceData.forEach(function(item){
                    var data =  item.value
                    item.tableData = []
                    for(var key in data){
                        var obj = {}
                        obj.name = key
                        obj.data = data[key]
                        item.tableData.push(obj)
                    }
                })
                console.log(sourceData)
                sourceData.reverse()
                this.setState({requirement:sourceData[0].tableData})
                sourceData.splice(0,1)
                this.setState({episodeData:sourceData})

            })
        getAjax("/oceanus/feature_extract_list/getWhiteTable")
            .then(res=>res.json())
            .then(res=>{
                // console.log(res.right.feature_import)
                res.right.feature_import==1 ? this.setState({permission:true}) : this.setState({permission:false})
            })
           
    }
    showModal=(modalType,item,table)=>{ //封装打开modal的函数 modalType为对应打开类型
        if(modalType == "checkModal"){
            if(item.status<3&&item.status!=0){
                message.error(`未到审核特征步骤`)
                return
            }
        } else if(modalType == "checkAllModal"){
            if(item.status<3&&item.status!=0){
                message.error(`未到批量审核特征步骤`)
                return
            }
        } else if(modalType == "importModal"){
            if(item.status!=0){
                message.error(`不符合导入条件`)
                return;
            }
        }
        this.setState({
            [modalType]:true,
            item,
            table
        })
    }
    handleCancel(modalType){
        this.setState({
            [modalType]:false
        })
    }    
    handleOk(modalType){
        this.setState({
            [modalType]:false
        })
    }
    handleCheckFeature(item,status){
        if(!this.state.permission){
            return ;
        }
        if(item.status == 3 || item.status == 0 || item.status == 4){
            getAjax(`/oceanus/offline_feature/auditFeature?id=${item.id}&status=${status}`)
                .then(res=>res.json())
                .then(res=>{
                    if(res.status === "success"){
                        let item = this.state.item
                        let _id = item.id
                        let requirement = JSON.parse(JSON.stringify(this.state.requirement))
                        console.log(requirement)
                        requirement.forEach(function(item){
                            item.data.forEach(function(item){
                                if(item.id == _id){
                                    item.status = status
                                }
                            })
                        })
                        console.log(requirement)
                        
                        this.setState({requirement:requirement})
                    } else{
                        message.error(`审核失败`)
                    }
                })
            this.handleCancel(`checkModal`)
        } else {
            message.error(`当前状态无法审核，请完成之前的步骤`)
        }
        
    }
    handleScenario(value){
        this.setState({scenario:value})
    }
    handleGroup(value){
        this.setState({group:value})
    }
    handlealias(e){
        this.setState({alias:e.target.value})
    }
    handleCheckAll(value,status){
        if(!this.state.permission){
            return ;
        }
        if(value[0].status<3&&value[0].status!=0){
            message.error(`还未到批量审核步骤`)
        }
        
        let data = value[0].hive_table
        getAjax(`/oceanus/offline_feature/auditAllFeatureOfTable?hive_table=${data}&status=${status}`)
            .then(res=>res.json())
            .then(res=>{
                if(res.status=="success"){
                    window.location.reload()
                } else{
                    message.error(`操作失败`)
                }
            })
        this.handleCancel(`checkAllModal`)
        
    }
    handleClose(){
        if(!this.state.permission){
            return ;
        }
        let maxEpisode = this.state.maxEpisode
        getAjax(`/oceanus/offline_feature/closeRequirementPool?episode=${maxEpisode+1}`)
            .then(res=>res.json())
            .then(res=>{
                if(res.status == "success"){
                    window.location.reload()
                } else {
                    message.error(`操作失败`)
                }
            })
    }
    handleImport(){
        let record = this.state.item
        let value = this.state.item
        let postData = {}
        postData.hive_table = value.hive_table;
        postData.category = value.category;  
        postData.en_name = value.en_name;
        postData.data_type = value.data_type;
        postData.ch_name = value.ch_name;
        postData.user_type = value.user_type;
        postData.business_type = value.business_type;
        postData.scenario = this.state.scenario
        postData.group = this.state.group
        if(this.state.alias==""){
            postData.alias = record.en_name
        } else {
            postData.alias = this.state.alias
        }
        console.log(postData)
        postAjax("/oceanus/offline_feature/importFeatureIntoOceanus",postData)
            .then(res=>res.json())
            .then(res=>{
                if(res.status == "success"){
                    message.success("导入成功")
                    this.handleCancel(`importModal`)
                }
            })
    }
}
