import React,{Component} from 'react';
import './index.less';
import {Button,message,Modal} from 'antd';
const confirm = Modal.confirm;
import { is } from 'immutable';
import {getAjax,postAjax} from '../../../fetch';
import {getCookie,findInArr} from '../../../methods';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import CallerModalFormGroup from '../PublicCallerModal';

export default class MyCaller extends Component{
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'id',
                dataIndex: 'id',
                width: '8%',
                sorter: (a, b) => {
                    return a.id - b.id
                }
            },
            {
                title: '系统/团队名称',
                dataIndex: 'system_name',
                width: '12%',
            }, {
                title: '部门',
                dataIndex: 'department',
                width: '12%',
            }, {
                title:'修改时间',
                dataIndex:'modify_time',
                width:'14%',
                sorter: (a, b) => {
                    return new Date(a.modify_time).getTime() - new Date(b.modify_time).getTime()
                },
                render: (text,item,i) => {
                    let it_time = '';
                    let index = item.modify_time.lastIndexOf(':');
                    it_time = item.modify_time.substring(0,index);
                    return (<span>
                        {it_time}
                </span>)
                }
            },{
                title: '系统标识',
                dataIndex: 'system_id',
                width: '20%'
            }, {
                title: '需求人',
                dataIndex: 'needer',
                width: '14%'
            }, {
                title: 'RD对接人',
                dataIndex: 'rd_checker',
                width: '10%',
            }, {
                title: '操作',
                dataIndex: 'create',
                width: '10%',
                render: (text,item,i) => {
                    let it_view = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickView.bind(this,item)}>查看</a>;
                    let it_delete = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickDelete.bind(this,item.id)}>删除</a>;
                    return (<span>
                        {it_delete}
                        {it_view}
                </span>)
                },
            }
            ];
        this.state = {
            ///表格数据源
            dataSource: [],
            tableData:{
                pagination:{
                    total:0,
                    pageSize:100
                },
                loading:true
            },
            ///表格行的标识
            rowKey:record => record.id,
            visibleModal:false,
            item:{}
        };
        ///我申请过的caller
        this.MyCaller = [];
    }
    render() {
        ///console.log('myCaller');
        return (
            <div className='my_caller_hold_content'>
                <div>
                    <Button type="primary" className="btn_apply_caller" onClick={this.handleApllyCaller.bind(this)} >
                        申请caller
                    </Button>
                </div>
                <div style={{"paddingTop":"10px"}}>
                    <AllDataTable
                        tableData={this.state.tableData}
                        columns={this.columns}
                        rowKey={this.state.rowKey}
                        dataSource={this.state.dataSource}
                    />
                </div>
                <CallerModalFormGroup
                    visibleModal={this.state.visibleModal}
                    item={this.state.item}
                    handleSubmit={this.handleSubmit.bind(this)}
                    handleViewCancel={this.handleViewCancel.bind(this)}
                />
            </div>
        );
    }
    componentDidMount() {
        let pageNum = 1;
        this.changePage(pageNum);
        getAjax('/oceanus/feature_service/applierCallerName?username='+getCookie('username')).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.MyCaller = data.caller_names || [];
            }else{
                message.warning("获取caller数据失败")
            }
        });
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
    ///点击申请caller
    handleApllyCaller(){
        this.setState({
            visibleModal:true,
            item:{}
        })
    }
    ///点击提交caller
    handleSubmit(val){
        ///console.log(val);
        if(findInArr(this.MyCaller,val.system_id)){
            message.warning("这个系统标识已存在，请重新输入");
            return;
        };
        postAjax('/oceanus/feature_service/saveNewCallerList',val).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                message.success("申请成功");
                this.setState({
                    visibleModal:false,
                    item:{}
                });
                this.changePage(1);
            }
        });

    }
    ///点击查看按钮
    handleClickView(item){
        this.setState({
            visibleModal:true,
            item,
        })
    }
    ///点击删除按钮
    handleClickDelete(id){
        let this_ =this;
        let {tableData} = this.state;
        //删除确认框
        confirm({
            title: '提示',
            className:"modal_confirm",
            content: '确定删除吗?',
            onOk() {
                postAjax('/oceanus/feature_service/cancelIndividualCallerRequest',{id}).then(res=>res.json()).then(data=>{
                    if(data.status == 'success'){
                        message.success("删除成功");
                        this_.changePage(tableData.pagination.current);
                    }
                });
            },
            onCancel() {},
        });
    }
    ///点击弹窗取消后的函数
    handleViewCancel(){
        this.setState({
            visibleModal:false
        });
    }
    ///获取第几页的数据
    changePage(pageNum){
        getAjax('/oceanus/feature_service/getIndividualCallerList?page='+pageNum+'&size=10000&username='+getCookie('username')).then(res=>res.json()).then(data=>{
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
}

