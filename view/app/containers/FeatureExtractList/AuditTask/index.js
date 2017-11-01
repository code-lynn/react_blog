import React,{Component} from 'react';
import { is,Map } from 'immutable';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch';
import {findInArr} from '../../../methods';
import './index.less';
import {Modal,Radio,message} from 'antd';
const RadioGroup = Radio.Group;
import AuditTaskModal from './AuditTaskModal';
export default class AuditTask extends Component{
    constructor(props){
        super(props);
        this.columns = [
            {
                title: '任务Id',
                dataIndex: 'id',
                sorter: (a, b) => {
                    return a.id - b.id
                },
                width: '10%',
            }, {
                title: '需求名称',
                dataIndex: 'name',
                sorter: (a, b) => {
                    return a.name.localeCompare(b.name)
                },
                width: '25%',
            }, {
                title: '需求人',
                dataIndex: 'applier',
                width: '9%'
            }, {
                title: '需求人所在部门',
                dataIndex: 'department',
                width: '14%'
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (text,item,i) => {
                    let it_content = item.create_time;
                    ///审核
                    if(it_content.indexOf('T')>-1){
                        it_content = it_content.replace('T',' ')
                    }
                    return (<span>

                        {it_content}

                </span>)
                },
                sorter: (a, b) => {
                    return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
                },
                width: '15%',
            }, {
                title: '修改时间',
                dataIndex: 'modify_time',
                render: (text,item,i) => {
                    let it_content = item.modify_time;
                    ///审核
                    if(it_content.indexOf('T')>-1){
                        it_content = it_content.replace('T',' ')
                    }
                    return (<span>

                        {it_content}

                </span>)
                },
                sorter: (a, b) => {
                    return new Date(a.modify_time).getTime() - new Date(b.modify_time).getTime()
                },
                width: '15%',
            }, {
                title: '操作',
                dataIndex: 'create',
                width: '6%',
                render: (text,item,i) => {
                    let it_audit = '';
                    ///审核
                    if(item.status==1){
                        it_audit = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickAudit.bind(this,item)} >审核</a>;
                    }else{
                        it_audit = <a href="javascript:;" className="public-table-btn-modify" style={{"color":"#ccc"}} >审核</a>;
                    }
                    return (<span>

                        {it_audit}

                </span>)
                },
            }, {
                title: '查看',
                dataIndex: 'seeing',
                width: '6%',
                render: (text,item,i) => {
                    let it_audit = '';
                    ///编辑
                    it_audit = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickModify.bind(this,item)} >编辑</a>;

                    return (<span>

                        {it_audit}

                </span>)
                },
            }
        ];
        this.state = {
            ///表格数据源
            dataSource: [],
            tableData: {
                pagination: {
                    total: 0,
                    pageSize: 10
                },
                loading: true,
            },
            ///表格行的标识
            rowKey: record => record.id,
            ///审核
            auditVisible: false,
            // itemArr: [{status:true,name:"fe.passenger_features_super_short"},{status:true,name:"fe.passenger_featurddes_super_short"}],
            itemArr:[],
            item:{},
            ///编辑
            visibleModal:false,
            editorItem:{},
            feature_list:''

        };
        ///存储的点击审核后通过不通过的数据
        this.auditJson = {};

    }

    render(){
        return (

            <div className="audi_task_hold_content">
                <div>
                    <AllDataTable tableData={this.state.tableData} columns={this.columns} rowKey={this.state.rowKey}  dataSource={this.state.dataSource}/>
                    {/*审核弹窗*/}
                    <Modal
                        title="审核"
                        closable={false}
                        visible={this.state.auditVisible}
                        onOk={this.submitStart.bind(this)}
                        onCancel={()=>{this.setState({
                            auditVisible:false
                        })}}
                        className="audi_task_modal"
                    >
                        <div>
                            <div className="audi_task_run">
                                {this.state.itemArr.length>0?this.state.itemArr.map((item,i)=>{
                                    if(item.status){
                                        return (<div className="clearfix" key={i}>
                                            <span className="fl">{item.name}</span>
                                            <div className="fl">
                                                <RadioGroup onChange={this.handleChangeAuditJson.bind(this,item.name)}>
                                                    <Radio className="common_radio_self" value={2}>通过</Radio>
                                                    <Radio className="common_radio_self"  value={3}>不通过</Radio>
                                                </RadioGroup>

                                            </div>
                                        </div>);
                                    }else{
                                        return (<div className="clearfix" key={i}>
                                            <span className="fl">{item.name}</span>
                                            <div className="fl">
                                                {item.text}
                                            </div>
                                        </div>);
                                    }

                                }):''}



                            </div>
                        </div>
                    </Modal>
                    {/*编辑弹窗*/}
                    <AuditTaskModal visibleModal={this.state.visibleModal} handleViewSubmit={this.handleViewSubmit.bind(this)} handleViewCancel={this.handleViewCancel.bind(this)} item={this.state.editorItem} feature_list={this.state.feature_list} handleChange={this.handleChange.bind(this)} />
                </div>
            </div>
        )
    }
    componentDidMount() {
        let pageNum = 1;
        this.changePage(pageNum);
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length||Object.keys(thisState).length !== Object.keys(nextState).length){
            return true;
        }

        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    changePage(pageNum){
        let tableData1 = Map(this.state.tableData);
        let tableData2 = tableData1.set('loading',true);
        this.setState({
            tableData:tableData2.toJS()
        });
        getAjax('/oceanus/feature_extract_audit/getTaskList?page='+pageNum+'&size=100000').then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.setState({
                    dataSource:data.value,
                    tableData:{
                        pagination:{
                            total:data.count,
                            pageSize:10
                        },
                        loading:false,
                    }
                })
            }else{
                this.setState({
                    dataSource:[],
                    tableData:{
                        pagination:{
                            total:0,
                            pageSize:10
                        },
                        loading:false,
                    }
                })
            }
        });
    }
    ///审核
    handleClickAudit(item){
        getAjax('/oceanus/feature_extract_audit/getAuthorizedTable?id='+item.id).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                console.log(data.value);
                let arrAll = [];
                data.value.forEach((item)=>{
                    arrAll.push(item[0]);
                });
                let status_json = JSON.parse(item.table_status);
                let arr = [];
                for(let key in status_json){
                    let statusvv = findInArr(arrAll,key)?true:false;
                    let json = {};
                    if (statusvv == true && status_json[key] == 1) {
                        ///可设置通过不通过
                        json.status = true;
                        json.name = key;
                        json.text = '可审核';
                    } else if(!statusvv && status_json[key] == 1){
                        ///不可设置通过不通过
                        json.status = false;
                        json.name = key;
                        json.text = '未审核';
                    }else if(!statusvv && status_json[key] != 1){
                        ///不可设置通过不通过
                        json.status = false;
                        json.name = key;
                        json.text = '已审核';
                    };
                    arr.push(json);

                };
                this.setState({
                    auditVisible:true,
                    itemArr:arr,
                    item
                })


            }
        });
    }
    ////点击编辑
    handleClickModify(item){
        console.log(item);
        this.setState({
            visibleModal:true,
            editorItem:item,
            feature_list:item.feature_list
        })
    }
    ///点击审核ok提交
    submitStart(){
        console.log(this.auditJson);
        let table = [];
        let value = [];
        let arrName = [];
        for(let name in this.auditJson){
            arrName.push(name);
        };
        this.state.itemArr.forEach((item)=>{
            if(item.status){
                if(findInArr(arrName,item.name)){
                    table.push(item.name);
                    value.push(this.auditJson[item.name]);
                }else{
                    table.push(item.name);
                    value.push(1);
                }
            }
        });
        let json = {};
        json.id = this.state.item.id;
        json.table = table.join(',');
        json.value = value.join(',');
        if(!json.table){
            return;
        }
        postAjax('/oceanus/feature_extract_audit/auditRequest',json).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.setState({
                    auditVisible:false,
                    itemArr:[],
                    item:{}
                });
                this.changePage(1);
                this.auditJson = {};
            }else{
                message.error('审核错误')
            }
        });


    }
    ///点击审核里面的单选
    handleChangeAuditJson(name,e){
        this.auditJson[name] = e.target.value;

    }
    ///点击编辑弹窗里面的取消
    handleViewCancel(){
        this.setState({
            visibleModal:false,
            editorItem:{},
            feature_list:''
        })
    }
    ///点击修改保存
    handleViewSubmit(){
        console.log(this.state.feature_list);
        let id = this.state.editorItem.id;
        let feature_list = this.state.feature_list;
        let json ={
            id,
            feature_list
        };
        if(!id || !feature_list){
            message.error('编辑错误');
            return;
        }
        if(this.state.editorItem.task_scene == 0){
            this.setState({
                visibleModal:false,
                editorItem:{},
                feature_list:''
            });
            return;
        }
        postAjax('/oceanus/feature_extract_audit/auditEdit',json).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.setState({
                    visibleModal:false,
                    editorItem:{},
                    feature_list:''
                });
                this.changePage(1);
            }else{
                message.error('编辑错误')
            }
        });

    }
    ///点击编辑特征
    handleChange(fea){
        this.setState({
            feature_list:fea
        })
    }


}
