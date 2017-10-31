import React,{Component} from 'react';
import {Link,hashHistory} from 'react-router';
import { is,Map } from 'immutable';
import MyTaskTop from './MyTaskTop';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch';
import {Modal,message,Radio} from 'antd';
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;
import ViewModal from '../publicComponent/ViewModal';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
import SingleDatePicker from '../../../components/DatePicker/SingleDatePicker';
import RangeDatePicker from '../../../components/DatePicker/RangeDatePicker';
import './index.less';


export default class MyTask extends Component{
    constructor(props){
        super(props);
        this.columns = [
            {
                title: '任务Id',
                dataIndex: 'id',
                sorter: (a, b) => {
                    return a.id - b.id
                },
                width: '8%',
            }, {
                title: '需求名称',
                dataIndex: 'name',
                sorter: (a, b) => {
                    return a.name.localeCompare(b.name)
                },
                width: '15%',
            }, {
                title: '需求人',
                dataIndex: 'applier',
                width: '10%'
            }, {
                title: '需求人所在部门',
                dataIndex: 'department',
                width: '14%'
            }, {
                title: '状态',
                dataIndex: 'status',
                width: '9%',
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
                width: '23%',
                render: (text,item,i) => {
                    let it_edit = '';
                    let it_cancel = '';
                    let it_delete = '';
                    let it_copy = '';
                    let it_view = '';
                    let it_load = '';
                    let it_apply = '';
                    let it_run = '';
                    let it_stop = '';
                    console.log(item);
                    ///编辑
                    if(item.status!=1&&item.run_status!=1&&item.is_copy!=1&&item.model_type!=null&&item.is_weather_task!=1){
                        it_edit = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickEdit.bind(this,item.id)}>编辑</a>

                    }
                    ///取消
                    if(item.status==1){
                        it_cancel = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickCancel.bind(this,item.id)}>取消</a>;
                    }
                    ///删除
                    if(item.status==2 || item.status==3||item.status==4){
                        it_delete = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickDelete.bind(this,item.id)}>删除</a>;
                    }
                    ///复制
                    if(item.status==2&&item.run_status==2){
                        it_copy = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickCopy.bind(this,item)}>复制</a>;
                    }
                    ///查看日志
                    if(item.status==2&&item.is_weather_task==0&&item.run_status!=0){
                        // it_view =  <Link to={`/feature_extract_list/run_log/:id=${item.id}&op=view`}  className="public-table-btn-modify">查看日志</Link>;
                        it_view =  <a href={`/oceanus/feature_extract_list/run?id=${item.id}&op=view`} target="_blank" className="public-table-btn-modify" >查看日志</a>;
                    }
                    ///下载
                    if(item.run_status==2){
                        // it_load = <a href={`/oceanus/feature_extract_request/downloadHiveDataToCSV?table_name=${item.hive_table}&start_day=${item.start_day}&end_day=${item.end_day}`} target="_blank" download={item.name} className="public-table-btn-modify" >下载</a>;
                        it_load='';
                    }
                    ///申请权限
                    if(item.is_weather_task!=0){
                        it_apply = <a href="http://dpp.intra.xiaojukeji.com/index?hash=/apply/dataAuth?hiveDatabase=dm&hiveTable=caiyun#/apply/dataAuth?hiveDatabase=dm&hiveTable=caiyun" target="_blank"  className="public-table-btn-modify" >申请读权限</a>;
                    }
                    ///运行
                    if(item.status==2&&item.run_status!=1&&item.task_scene!=0){
                        it_run = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickRun.bind(this,item.id)} >运行</a>;
                    }
                    ///停止
                    if(item.status==2&&item.run_status==1){
                        it_stop = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickStop.bind(this,item.id)} >终止</a>;
                    }
                    return (<span>
                        {it_edit}
                        {it_cancel}
                        {it_delete}
                        {it_copy}
                        {it_view}
                        {it_load}
                        {it_apply}
                        {it_run}
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
            }];
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
            ///复制弹窗的显示隐藏
            copyVisible:false,
            ///单日历和双日历

            dateRangeDefault:{
                maxValue:'2017-11-08',
                minValue:'2017-09-27',
                startValue:'2017-10-01',
                endValue:'2017-10-07',
                handleDateChange:this.handleRangeChange
            },
            dateSingleDefault:{
                maxValue:'2017-11-08',
                minValue:'2017-09-27',
                startValue:'2017-10-13',
                handleDateChange:this.handleSingleChange
            },
            ///启动弹窗的显示隐藏
            startVisible:false,
            ///item 是查看是传入查看的这条数据
            item:{},
            visibleModal:false,
            startState:0,
        };
        ///单日历隐藏和显示
        this.isSingleCalular=false;
        ///拷贝的数据
        this.copyJson={};
        ///运行提交的数据
        this.runJson = {};
    }
    render(){

        return (
            <div className="my_task_hold_content">
                <MyTaskTop/>
                <div className="my_task_list">
                    <AllDataTable tableData={this.state.tableData} columns={this.columns} rowKey={this.state.rowKey}  dataSource={this.state.dataSource}/>
                </div>
                <Modal
                    title="启动任务"
                    closable={false}
                    visible={this.state.startVisible}
                    onOk={this.submitStart.bind(this)}
                    onCancel={()=>{this.setState({
                        startVisible:false
                    })}}
                    className="my_task_modal"
                >
                    <div>
                        <div className="clearfix my_task_run">
                            <span className="fl">启动选项</span>
                            <div className="fl">
                                <RadioGroup onChange={this.handleChangeRunJson.bind(this)} value={this.state.startState}>
                                    <div>
                                        <Radio className="common_radio_self" value={0}>重新启动</Radio>
                                        <span>（历史数据会被覆盖，推荐选择此选项）</span>
                                    </div>
                                    <div>
                                        <Radio className="common_radio_self"  value={1}>从失败处启动</Radio>
                                    </div>
                                </RadioGroup>

                            </div>

                        </div>
                    </div>
                </Modal>

                <Modal
                    title="复制任务"
                    closable={false}
                    visible={this.state.copyVisible}
                    onOk={this.submitCopy.bind(this)}
                    onCancel={()=>{this.setState({
                        copyVisible:false
                    })}}
                    className="my_task_modal"
                >
                    <div>
                        选择时间: {this.isSingleCalular? <SingleDatePicker datePickerData={this.state.dateSingleDefault} />:<RangeDatePicker datePickerData={this.state.dateRangeDefault}/> }
                    </div>
                </Modal>

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


    ///获取页码数据
    changePage(pageNum){
        let tableData1 = Map(this.state.tableData);
        let tableData2 = tableData1.set('loading',true);
        this.setState({
            tableData:tableData2.toJS()
        });
        getAjax('/oceanus/feature_extract_request/getTaskList?page='+pageNum+'&size=10000').then(res=>res.json()).then(data=>{
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
    // 编辑
    handleClickEdit(id){
        hashHistory.push("/feature_extract_list/selected_feature/"+id);
    }
    ///取消
    handleClickCancel(id){
        postAjax('/oceanus/feature_extract_request/cancelRequest',{id, op: 'cancel'}).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.changePage(1);
            }
        });
    }
    ///删除
    handleClickDelete(id){
        let _this = this;
        //删除确认框
        confirm({
            title: '提示',
            className:"modal_confirm",
            content: '确定删除吗?',
            onOk() {
                postAjax('/oceanus/feature_extract_request/cancelRequest',{id, op: 'delete'}).then(res=>res.json()).then(data=>{
                    if(data.status == 'success'){
                        _this.changePage(1);
                    }
                });
            },
            onCancel() {},
        });

    }
    //复制
    handleClickCopy(item){
        this.copyJson.id = item.id || '';
        let copy_task_scene = item.task_scene || '';
        let timeline = item.copy_date || moment().add('days',-1).format('YYYYMMDD');
        let jsonDefault = {};
        jsonDefault.startValue = moment(timeline).format(dateFormat);
        jsonDefault.endValue = moment(timeline).format(dateFormat);
        this.copyJson.start_day =jsonDefault.startValue;
        this.copyJson.end_day =jsonDefault.endValue;
        jsonDefault.maxValue = jsonDefault.endValue;
        jsonDefault.minValue = null;
        if(copy_task_scene===4){
            this.isSingleCalular=true;
            delete jsonDefault.endValue;
            jsonDefault.handleDateChange=this.handleSingleChange.bind(this);
            this.setState({
                copyVisible:true,
                dateSingleDefault:jsonDefault
            });
        }else{
            this.isSingleCalular=false;
            jsonDefault.handleDateChange=this.handleRangeChange.bind(this);
            this.setState({
                copyVisible:true,
                dateRangeDefault:jsonDefault
            });
        }



    }
    //点击复制弹窗后提交
    submitCopy(){
        if(parseFloat((new Date(this.copyJson.end_day).getTime() - new Date(this.copyJson.start_day).getTime())/(1000*60*60*24))>29){
            if(!this.isSingleCalular){
                message.error('选择日期区间不能超过30天');
                return;
            }

        };
        if (this.copyJson.id != '' && this.copyJson.start_day != '' && this.copyJson.end_day != '') {
            postAjax('/oceanus/feature_extract_list/featureExtractCopy',this.copyJson).then(res=>res.json()).then(data=>{
                if(data.status == 'success'){
                    this.setState({
                        copyVisible:false,
                    });
                    this.changePage(1);
                }else{
                    message.error(data.message);
                }
            });


        }else{
            message.error('数据有误');
        }


    }
    //下载
    handleClickLoad(){

    }
    //运行
    handleClickRun(id){
        this.runJson.id = id;
        this.runJson.status = "1";
        this.setState({
            startVisible:true
        });
    }
    //运行
    handleChangeRunJson(e){
        this.runJson.status = e.target.value;
        this.setState({
            startState:e.target.value
        });
        console.log(this.runJson.id,this.runJson.status);
    }
    //运行提交
    submitStart(){
        // let url = `/feature_extract_list/run_log/:id=${this.runJson.id}&op=run&stage=${this.runJson.status}`;
        window.location = `/oceanus/feature_extract_list/?id=${this.runJson.id}&op=run&stage=${this.runJson.status}`;
        // hashHistory.push(url)
    }
    //停止
    handleClickStop(id){
        postAjax('/oceanus/feature_extract_request/runError',{id}).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.changePage(1);
            }else{
                message.error(data.message);
            }
        });
    }
    ///双日历变化
    handleRangeChange(v,a){
        console.log(v,a);
        if(parseFloat((new Date(a[1]).getTime() - new Date(a[0]).getTime())/(1000*60*60*24))>29){
            message.error('选择日期区间不能超过30天');
        };
        this.copyJson.start_day =a[0];
        this.copyJson.end_day =a[1];
        let dateRangeDefault1 = Map(this.state.dateRangeDefault);
        let dateRangeDefault2 = dateRangeDefault1.set('startValue',moment(a[0]).format(dateFormat));
        let dateRangeDefault3 = dateRangeDefault2.set('endValue',moment(a[1]).format(dateFormat));
        this.setState({
            dateRangeDefault:dateRangeDefault3.toJS()
        });
    }
    ///单日历变化
    handleSingleChange(v,a){
        console.log(v,a);
        this.copyJson.start_day =a;
        this.copyJson.end_day =a;
        let dateSingleDefault1 = Map(this.state.dateSingleDefault);
        let dateSingleDefault2 = dateSingleDefault1.set('startValue',moment(a).format(dateFormat));
        this.setState({
            dateSingleDefault:dateSingleDefault2.toJS()
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
