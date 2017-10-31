import React,{Component} from 'react'
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch'
import ViewModal from '../CallerModal/ViewModal'
import './index.less' 
export default class AllCaller extends Component{
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
                title:'申请人名字',
                dataIndex:'applier_name',
                width:'10%'
            },
            {
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
            },
            {
                title:'系统标识',
                dataIndex:'system_id',
                width:'18%'
            },
            {
                title:'系统/团队名称',
                dataIndex:'system_name',
                width:'10%'
            },
            {
                title:'部门',
                dataIndex:'department',
                width:'10%'
            },
            {
                title:'需求人',
                dataIndex:'needer',
                width:'12%'
            },
            {
                title:'RD对接人',
                dataIndex:'rd_checker',
                width:'12%'
            },
            {
                title:'操作',
                width:'6%',
                render:(text,item,i)=>{
                    return(<span>
                        <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickView.bind(this,item)}>查看</a>
                        
                    </span>
                    )
                }
            }

        ];
        this.state = {
            dataSource:[],
            tableData:{
                pagination:{
                    total:0,
                    pageSize:10
                },
                loading:true,
                ///改变分页回调
                // onPageChange:this.tableOnChange.bind(this)
            },
            rowKey:record => record.id,
            ///item 是查看是传入查看的这条数据
            item:{},
            visibleModal:false
        }
    }
    render() {
        ////console.log('rendering')
        return (
            <div className='all_caller_hold_content'>
                <div className='all_caller_list'>
                    <AllDataTable
                    columns={this.columns}
                    dataSource={this.state.dataSource}
                    rowKey={this.state.rowKey}
                    tableData={this.state.tableData}/>
                </div>
                <ViewModal 
                    item={this.state.item} 
                    visibleModal={this.state.visibleModal}
                    handleViewCancel={this.handleViewCancel.bind(this)}
                />

            </div>
        );
    }
    changePage(pageNum){
        getAjax('/oceanus/feature_service/getAuditAllCallerList?page='+pageNum+'&size=10000').then(res=>res.json()).then(data=>{
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
        ///console.log(this.state.item)
    }
    ///点击弹窗取消后的函数
    handleViewCancel(){
        ////console.log('cancel')
        this.setState({
            visibleModal:false
        });
    }
    // componentDidMount = () => {
    //     let pageNum = 1;
    //     this.changePage(pageNum);
    // }
    
    componentWillMount = () => {
        let pageNum = 1;
        this.changePage(pageNum);
    }
}

