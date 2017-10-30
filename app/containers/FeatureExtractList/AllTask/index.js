import React,{Component} from 'react';
// import {Link} from 'react-router';
import { is,Map } from 'immutable';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch';
import ViewModal from '../publicComponent/ViewModal';
import './index.less';
export default class AllTask extends Component{
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
                width: '19%',
            }, {
                title: '需求人',
                dataIndex: 'applier',
                width: '10%'
            }, {
                title: '需求人所在部门',
                dataIndex: 'department',
                width: '18%'
            }, {
                title: '状态',
                dataIndex: 'status',
                width: '7%',
                render: (text) => {
                    let status_text = '';
                    let classText = '';
                    if(text == 1){
                        status_text = '审核中';
                        classText = 'didi-black';
                    }else if(text == 2){
                        status_text = '审核通过';
                        classText = 'didi-green';
                    }else if(text == 3){
                        status_text = '审核不通过';
                        classText = 'didi-red';
                    }else if(text == 4){
                        status_text = '请求已取消';
                        classText = 'didi-grey';
                    }
                    return <span className={classText}>{status_text}</span>;
                },
            }, {
                title: '创建时间',
                dataIndex: 'create_time',
                sorter: (a, b) => {
                    return new Date(a.create_time).getTime() - new Date(b.create_time).getTime()
                },
                width: '15%',
            }, {
                title: '操作',
                dataIndex: 'create',
                width: '15%',
                render: (text,item,i) => {
                    let it_view = '';
                    let it_public = '';
                    let it_stop = '';
                    // console.log(item);
                    ///查看日志
                    if(item.status==2&&item.is_weather_task!=1){
                        // it_view =  <Link to={`/feature_extract_list/run_log/:id=${item.id}&op=view`}  className="public-table-btn-modify">查看日志</Link>;
                        it_view =  <a href={`/oceanus/feature_extract_list/run?id=${item.id}&op=view`} target="_blank" className="public-table-btn-modify" >查看日志</a>;
                    }
                    ///公开
                    if(item.status==2&&item.run_status==2&&item.is_publish!=1){
                        it_public = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickPublic.bind(this,item.id)} >公开</a>;
                    }
                    ///停止
                    if(item.status==2&&item.run_status==1){
                        it_stop = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickStop.bind(this,item.id)} >终止</a>;
                    }
                    return (<span>

                        {it_view}
                        {it_public}
                        {it_stop}
                </span>)
                },
            }, {
                title: '查看',
                dataIndex: 'seeing',
                width: '6%',
                render: (text,item,i) => {
                    return (<span>
                                <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickView.bind(this,item)}>查看</a>
                            </span>)
                },
            }
            ];
        this.state = {
            ///表格数据源
            dataSource:[],
            tableData:{
                loading:true,
                pagination:{
                    pageSize:10,
                    total:0
                },
            },
            ///item 是查看是传入查看的这条数据
            item:{},
            visibleModal:false
        };
      
    }
  
    render(){
        return (
            
            <div className="all_task_hold_content">
                <div className="all_task_list">
                    <AllDataTable
                        columns={this.columns}
                        rowKey={record => record.id}
                        dataSource={this.state.dataSource}
                        bordered={true}
                        tableData={this.state.tableData}
                    />
                </div>
                <ViewModal item={this.state.item} visibleModal={this.state.visibleModal} handleViewCancel={this.handleViewCancel.bind(this)} />
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

        getAjax('/oceanus/feature_extract_all/getTaskList?page='+pageNum+'&size=10000').then(res=>res.json()).then(data=>{
                if(data.status == 'success'){
                    this.setState({
                        dataSource:data.value,
                        tableData:{
                            pagination:{
                                pageSize:10,
                                total:data.count
                            },
                            loading:false,
                        }

                    })
                }
        });
    }
    ///公开
    handleClickPublic(id){
        postAjax('/oceanus/feature_extract_all/publishTask',{id}).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.changePage(1);
            }
        });
    }
    ///终止
    handleClickStop(id) {
        postAjax('/oceanus/feature_extract_request/runError',{id}).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.changePage(1);
            }
        });
    }
    ///查看功能
    handleClickView(item){
        this.setState({
            visibleModal:true,
            item
        });
    }
    ///点击弹窗取消后的函数
    handleViewCancel(){
        this.setState({
            visibleModal:false
        });
    }


}
