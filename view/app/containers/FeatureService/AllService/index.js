import React,{Component} from 'react';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch'
import ViewModal from '../ServiceModal/ViewModal'

import './index.less'
export default class AllService extends Component{
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'id',
                dataIndex: 'id',
                width: '5%',
                sorter: (a, b) => {
                    return a.id - b.id
                }
            },
            {
                title:'申请人',
                dataIndex:'applier_name',
                width:'8%'
            },{
                title:'创建时间',
                dataIndex:'create_time',
                width:'11%',
                sorter: (a, b) => {
                    return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
                },
                render: (text,item,i) => {
                    let it_time = '';
                    let index = item.create_time.lastIndexOf(':');
                    it_time = item.create_time.substring(0,index);
                    return (<span>
                        {it_time}
                </span>)
                }
            },
            {
                title:'中文名称',
                dataIndex:'ch_name',
                width:'9%'

            },
            {
                title:'英文名称',
                dataIndex:'en_name',
                width:'8%'
            },
            {
                title:'caller名称',
                dataIndex:'caller_name',
                width:'8%'
            },
            {
                title:'调用服务',
                dataIndex:'caller_server',
                width:'7%'
            },
            {
                title:'调用接口',
                dataIndex:'caller_interface',
                width:'11%'
            },
            {
                title:'调用频次',
                dataIndex:'caller_frequency',
                width:'7%'
            },
            {
                title:'审核状态',
                dataIndex:'status',
                width:'7%',
                render:(text)=>{
                    let status_text = '';
                    let classText = '';
                    if(text == 0){
                        status_text = '审核中';
                        classText = 'didi-black';
                    }else if(text == 1){
                        status_text = '审核通过';
                        classText = 'didi-green';
                    }else if(text == 2){
                        status_text = '审核不通过';
                        classText = 'didi-red';
                    }
                    return <span className={classText}>{status_text}</span>;
                }
            },
            {
                title:'审批人',
                dataIndex:'approver',
                width:'9%'
            },
            {
                title:'操作',
                width:'10%',
                render:(text,record,i)=>{
                    
                    let view = <div>
                                    <a href={`/oceanus/feature_service/viewConf?name=${record.en_name}&version=${record.version}`} className="public-table-btn-modify" >查看</a>
                                    <a href='javascript:;' className="public-table-btn-modify" onClick={this.handleClickView.bind(this,record)}>详情</a>
                                </div>
                    
                    let op = '' //通过和不通过的按钮
                    if(record.status === 0){
                        op = <div>
                                <a href='javascript:;' className="public-table-btn-modify" onClick={this.handleOperate.bind(this,record,1)}>通过</a>
                                <a href='javascript:;' className="public-table-btn-modify" onClick={this.handleOperate.bind(this,record,2)}>不通过</a>
                            </div>
                    }
                    return(<span>
                        {view}
                        {op}
                    </span>)
                }

            }
        ]
        this.state = {
            dataSource:[],
            tableData:{
                pagination:{
                    total:0,
                    pageSize:10
                },
                loading:true
            },
            rowKey:record => record.id,
            ///item 是查看是传入查看的这条数据
            item:{},
            visibleModal:false
        }
    }
    render() {
        return (
            <div className='all_service_hold_content'>
               <div className='all_service_list'> 
                   <AllDataTable
                    columns={this.columns}
                    dataSource={this.state.dataSource}
                    rowKey={this.state.rowKey}
                    tableData={this.state.tableData}/>
                </div>
                <ViewModal item={this.state.item} visibleModal={this.state.visibleModal} handleViewCancel={this.handleViewCancel.bind(this)} />

            </div>
        );
    }
    changePage(pageNum){
        getAjax('/oceanus/feature_service/auditServiceList?page='+pageNum+'&size=100000').then(res=>res.json()).then(data=>{
                if(data.status == 'success'){
                    this.setState({
                        dataSource:data.value,
                        tableData:{
                            pagination:{
                                total:data.count,
                                pageSize:10
                            },
                            loading:false
                        }
                    })
                }
        })
    }
    //弹窗触发函数
    handleClickView (item){
        this.setState({
            visibleModal:true,
            item:item
        });
        ////console.log(this.state.item)
    }
    ///点击弹窗取消后的函数
    handleViewCancel(){
        ////console.log('cancel')
        ////console.log('cancel')
        this.setState({
            visibleModal:false
        });
    }
    handleOperate(item,status){
        let data = {}
        data.id = item.id;
        data.audit_status = status;
        postAjax('/oceanus/feature_service/serviceAudit',data).then(data=>{
            if(data.status === 'success'){
                this.changePage(this.state.tableData.pagination.current);
            }
        })
    }
    componentWillMount = () => {
        let pageNum = 1;
        this.changePage(pageNum);
    }
}

