//接入数据的基础展示组件，粒度为表级
import React, { Component } from 'react'
import {Icon,Modal,Tooltip,message} from 'antd'
import {getAjax,postAjax} from '../../../fetch'
import MyTable from '../../../components/MyTable'
import {hashHistory} from 'react-router'
export default class HiveTable extends Component{
    constructor(props){
        super(props)
        this.state={
            rowKey:record => record.id,
            tableData:{
                loading:false
            },
            tableShow:true,
            dataSource:[],
            tableName:"",
            tableStatus:-1,
            modifiable:false,
            infoShow:false,
            permission:false
        }
        

    }
    componentWillMount = () => {
        this.setState({
                            dataSource:this.props.mappingData.data,
                            tableName:this.props.mappingData.name
                    })

        this.setState({permission:this.props.permission})
        let statusArr = []
        this.props.mappingData.data.map(function(item){
            statusArr.push(item.status)
        })
        statusArr.sort(function(a,b){return b-a}) //取出表中特征状态的最小值 作为表的状态
        this.setState({tableStatus:statusArr[0]})
        if(this.props.tableType == "requirement"){ //如果表的类别为需求池类别则把导入特征去掉 并使其可编辑
        
            this.setState({modifiable:true})
        }
        
    }
    
    
componentWillReceiveProps(nextProps) {
    // console.log(nextProps);
    this.setState({
        permission:nextProps.permission,
        dataSource:nextProps.mappingData.data
    })
}    
    
    render(){
        this.columns = [
            {
                title:"特征英文名",
                dataIndex:"en_name",
                width:"15%"
            },
            {
                title:"特征中文名",
                dataIndex:"ch_name",
                width:"10%"
            },
            {
                title:"特征数据类型",
                dataIndex:"data_type",
                width:"10%"
            },
            {
                title:"默认值",
                dataIndex:"default_value",
                width:"10%"
            },
            {
                title:"源字段名称",
                dataIndex:"source_field",
                width:"15%"
            },
            {
                title:"状态",
                dataIndex:"status",
                width:"10%",
                render:(text)=>{
                    let statusText = ""
                    let classText = ""
                    if(text == 0){
                        statusText = "审核通过"
                        classText = "didi-green"
                    } else if(text == 4){
                        statusText = "审核不通过"
                        classText = "didi-red"
                    } else {
                        statusText = "待审核"
                        classText = "didi-grey"
                    }
                    return <span className={classText}>{statusText}</span>
                }
            },
            {
                title:"导入特征平台",
                width:"10%",
                render:(text,item,i)=>{
                    return <span><a href="javascript:;" onClick={this.props.showModal.bind(this,`importModal`,item)}  className="public-table-btn-modify">导入</a></span>
                }
            },
            {
                title:"操作",
                width:"10%",
                render:(text,item,i)=>{
                    let edit = ""
                    let detail = ""
                    let checkFeature = ""
                    detail =  <a href="javascript:;" className="public-table-btn-modify" onClick={this.props.showModal.bind(this,`detailModal`,item)}>详情</a>
                    if(this.state.modifiable){                      
                        edit = <a href="javascript:;"  onClick={this.handleEdit.bind(this,item.id)} className="public-table-btn-modify">编辑</a>
                    }
                    if(this.state.permission&&this.props.tableType == "requirement"){
                        checkFeature = <a href="javascript:;" className="public-table-btn-modify" onClick={this.props.showModal.bind(this,`checkModal`,item)}>审核特征</a>
                    }
                    return ( 
                        <span>
                            {edit}
                            {detail}
                            {checkFeature}
                        </span>
                    )
                }
            },
            
        ];
        if(this.props.tableType == "requirement"){ //如果表的类别为需求池类别则把导入特征去掉 并使其可编辑
            let len = this.columns.length
            this.columns.splice(len-2,1)
        }
        let tableData = this.state.dataSource
        console.log("render")
        return(
         
            <div>
                <div className="table-header">
                    <div className="table-util">
                    <span className="table-name">{this.state.tableName}</span>  
                    <span className={`check-info `+ (this.state.infoShow ? `show`:``)}>*请求已经提交，可能需要几分钟进行处理</span>
                       {this.state.tableShow ? <span onClick={this.handleToggle.bind(this)} className="toggle"><Icon type="up" />收起</span> : <span onClick={this.handleToggle.bind(this)} className="toggle"><Icon type="down" />展开</span>}
                    </div>
                    <div className={`check-progress `+ (this.state.tableShow?``:`hide`)}>
                        <Tooltip title='审查人：xxx' placement='top'>
                            <div className="check-item" onClick={this.handleTablePermission.bind(this,tableData[0])}>
                                {this.state.tableStatus>=0 ? <img src={require("./permission.svg")}/>:<img src={require("./permission_grey.svg")}/>}
                                <p className={this.state.tableStatus>=0?`pass`:``}>检查表权限</p>
                            </div>
                        </Tooltip>
                        <div className="check-arrow">
                            { this.state.tableStatus>1 || this.state.tableStatus == 0 ? <img src={require("./next.svg") }/> : <img src={require("./next_grey.svg")}/>}
                        </div>
                        <Tooltip title='审查人：xxx' placement='top'>
                            <div className="check-item" onClick={this.handlePartition.bind(this,tableData[0])}>
                                { this.state.tableStatus>1 || this.state.tableStatus == 0 ? <img src={require("./partition.svg") }/> : <img src={require("./partition_grey.svg")}/>}
                                <p className={this.state.tableStatus>1 || this.state.tableStatus == 0?`pass`:``}>检查分区</p>
                            </div>
                        </Tooltip>
                        <div className="check-arrow">
                            { this.state.tableStatus>2 || this.state.tableStatus == 0 ? <img src={require("./next.svg") }/> : <img src={require("./next_grey.svg")}/>}
                        </div>
                        <Tooltip title='审查人：xxx' placement='top' >
                            <div className="check-item" onClick={this.handlePrimaryKey.bind(this,tableData[0])}>
                                { this.state.tableStatus>2 || this.state.tableStatus == 0 ? <img src={require("./component.svg") }/> : <img src={require("./component_grey.svg")}/>}
                                <p className={this.state.tableStatus>2 || this.state.tableStatus == 0?`pass`:``}>主键唯一性</p>
                            </div>
                        </Tooltip>
                        <div className="check-arrow">
                            { this.state.tableStatus>3 || this.state.tableStatus == 0 ? <img src={require("./next.svg") }/> : <img src={require("./next_grey.svg")}/>}
                        </div>
                        <Tooltip title='审查人：xxx' placement='top'>                        
                            <div className="check-item" onClick={this.props.showModal.bind(this,`checkAllModal`,tableData[0],tableData)}>
                                { this.state.tableStatus>3 || this.state.tableStatus == 0 ? <img src={require("./check.svg") }/> : <img src={require("./check_grey.svg")}/>}                        
                                <p className={this.state.tableStatus>3 || this.state.tableStatus == 0?`pass`:``}>表级审核</p>
                            </div>
                        </Tooltip>
                        
                    </div>
                </div>
                <div className={`hive_table `+(this.state.tableShow?``:`hide`)} >
                    
                    <MyTable 
                        dataSource={this.state.dataSource}
                        columns={this.columns}
                        rowKey = {this.state.rowKey}
                    />
                </div>
                
            </div>
        )
    }
    handleToggle(){
        this.setState({tableShow:!this.state.tableShow})
    }
    handleTablePermission(value){
        if(!this.state.permission){
            return ;
        }
    
        let data = value
        if(data.status>0){
            message.error(`已通过表权限审核步骤`)
            return
        }
        getAjax(`/oceanus/offline_feature/checkPermissionPartitionPrimaryKey?hive_table=${data.hive_table}&primary_key=${data.primary_key}&partition=${data.partition}`)
            .then(res=>res.json())
            .then(res=>{
                if(res.status=="success"){
                    this.setState({infoShow:true})
                } else{
                    message.error(`操作失败`)
                }
            })
    }
    handlePartition(value){
        if(!this.state.permission){
            return ;
        }
        let data = value
        if(data.status<1&&data.status!=0){
            message.error(`未到检查分区步骤`)
            return
        } else if(data.status > 1 || data.status == 0){
            message.error(`已通过检查分区步骤`)
            return
        }
        getAjax(`/oceanus/offline_feature/checkPermissionPartitionPrimaryKey?hive_table=${data.hive_table}&primary_key=${data.primary_key}&partition=${data.partition}`)
            .then(res=>res.json())
            .then(res=>{
                if(res.status=="success"){
                    this.setState({infoShow:true})
                } else{
                    message.error(`操作失败`)
                }
            })
    }
    handlePrimaryKey(value){
        if(!this.state.permission){
            return ;
        }
        let data = value
        if(data.status<2&&data.status!=0){
            message.error(`未到检查主键步骤`)
            return
        } else if(data.status > 2 || data.status == 0){
            message.error(`已通过检查主键步骤`)
            return
        }
        
        getAjax(`/oceanus/offline_feature/checkPermissionPartitionPrimaryKey?hive_table=${data.hive_table}&primary_key=${data.primary_key}&partition=${data.partition}`)
            .then(res=>res.json())
            .then(res=>{
                if(res.status=="success"){
                    this.setState({infoShow:true})
                } else{
                    message.error(`操作失败`)
                }
            })
    }
    handleEdit(id){
        hashHistory.push(`/feature_manage/feature_ad/:${id}`)
    }
} 