import React,{Component} from 'react'
import './index.less'
import {Link,hashHistory} from 'react-router';
import {Button,message,Modal} from 'antd';
const confirm = Modal.confirm;
import Guide from './Guide.js'
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch'
import ViewModal from '../ServiceModal/ViewModal';
import ViewModalSeeing from '../ServiceModal/ViewModalSeeing';

export default class MyService extends Component{
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: 'id',
                dataIndex: 'id',
                width: '6%',
                sorter: (a, b) => {
                    return a.id - b.id
                }
            },
            {
            title:'中文名称',
            dataIndex:'ch_name',
            width:'8%'
        },{
            title:'英文名称',
            dataIndex:'en_name',
            width:'8%'
        },{
            title:'申请人',
            dataIndex:'applier_name',
            width:'10%'
        },{
            title:'调用服务',
            dataIndex:'caller_server',
            width:'8%'
        },{
            title:'修改时间',
            dataIndex:'modify_time',
            width:'11%',
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
            title:'调用接口',
            dataIndex:'caller_interface',
            width:'15%'
        },{
            title:'caller名称',
            dataIndex:'caller_name',
            width:'8%'
        },{
            title:'状态',
            dataIndex:'status',
            width:'8%',
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
        },{
            title:'经办人',
            dataIndex:'approver',
            width:'10%'
        },{
            title:'操作',
            width:'8%',
            render:(text,record,i)=>{
                
                let view = <span>
                                <a href='javascript:;' className="public-table-btn-modify" onClick={this.handleSeeing.bind(this,record)} >查看</a>
                                <a href='javascript:;' className="public-table-btn-modify" onClick={this.handleClickView.bind(this,record)}>详情</a>
                            </span>
                
                let op =  <span>
                            <a href='javascript:;' className="public-table-btn-modify" onClick={this.handleDel.bind(this,record)}>删除</a>
                            <Link to={`/feature_service/apply_service/:${record.id}`}  className="public-table-btn-modify">编辑</Link>
                        </span>;
                return(<span>
                    {op}
                    {view}
                </span>)
            }
        }]
        this.state = {
            ///表格数据源
            dataSource: [],
            tableData:{
                pagination:{
                    total:0,
                    pageSize:10
                },
                loading:true
            },
            ///表格行的标识
            rowKey:record => record.id,
            visibleModal:false,
            item:{},
            visibleModalSeeing:false,
            itemSeeing:{}
        }
    }
    render() {
        return (
            <div className='my_service_hold_content'>
              <Guide/>
              <AllDataTable
                  tableData={this.state.tableData}
                  columns={this.columns} 
                  rowKey={this.state.rowKey}  
                  dataSource={this.state.dataSource}
                />
                <ViewModal item={this.state.item} visibleModal={this.state.visibleModal} handleViewCancel={this.handleViewCancel.bind(this)} />
                <ViewModalSeeing item={this.state.itemSeeing} visibleModalSeeing={this.state.visibleModalSeeing} handleViewSeeingCancel={this.handleViewSeeingCancel.bind(this)} />
            </div>
        );
    }
        ///点击编辑按钮
        handleClickView(item){
            this.setState({
                visibleModal:true,
                item,
            })
        }
        ///点击查看按钮
        handleSeeing(item){
            getAjax('/oceanus/feature_service/getIndividualServiceAddress?name='+item.en_name+'&version='+item.version).then(res=>res.json()).then(data=>{
                if(data.status == 'success'){
                    this.setState({
                        itemSeeing:JSON.parse(data.value),
                        visibleModalSeeing:true
                    })
                }else {
                    message.warning(data.message);
                }
            });
        }
        ///点击删除按钮
        handleDel(record){
            let this_ =this;
            let {tableData} = this.state;
            confirm({
                title: '提示',
                className:"modal_confirm",
                content: '确定删除吗?',
                onOk() {
                    postAjax('/oceanus/feature_service/deleteServiceTask',{id:record.id}).then(res=>res.json()).then(data=>{
                        if(data.status == 'success'){
                            message.success("删除成功！");
                            this_.changePage(1);
                        }else {
                            message.warning(data.message);
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
        ///点击弹窗取消后的函数
        handleViewSeeingCancel(){
            this.setState({
                visibleModalSeeing:false
            });
        }
        ///获取第几页的数据
        changePage(pageNum){

            getAjax('/oceanus/feature_service/allMyselfServiceList?page='+pageNum+'&size=10000').then(res=>res.json()).then(data=>{
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
                }else{
                    this.setState({
                        dataSource:[],
                        tableData:{
                            pagination:{
                                total:0,
                                pageSize:100
                            },
                            loading:false,
                        }
                    })
                }
            });
        }
    componentWillMount(){
        let pageNum = 1;
        this.changePage(pageNum);
    }
}

