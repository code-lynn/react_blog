/**
 * Created by issuser on 2017/9/27.
 */
import React,{Component} from 'react';
import MyTable from '../../../components/MyTable';
import {RGroup} from '../../../components/MyRadio';
import {getAjax} from '../../../fetch/index';
import {Radio ,message} from 'antd';
import './index.less';

export default class FeatureStatistics extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
            pagination: {
                current: 1, pageSize: 10, total: 0
            },
            loading: false,
            params:{
                cycleValue: 1,//统计周期
                targetValue: 1,//统计对象
            },

        };
        this.upData={
            totalTimes:0,//复用次数
            caller_count:0,//caller数量
            other_count:0,//其他
            total:0,//任务 总数量
            model_count:0,//模型数量
            minning_count:0,//分析数量
        };
    }
    componentWillMount(){

    }
    cycleFetch(params){
        let query_cycle = `getCallerCount?statistical_period=${params.cycleValue}`;
        getAjax("/oceanus/feature_extract_statistics/"+query_cycle).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success' && data.value && data.value.length>0) {
                this.upData.caller_count = data.value[0].caller_count;
            }else {
                message.warning("caller 请求数据失败！")
            }
        });
    }
    targetFetch(params){
        let query_target = `getModelCount?statistical_period=${params.cycleValue}`;
        getAjax("/oceanus/feature_extract_statistics/"+query_target).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success' && data.value && data.value.length>0) {
                this.upData.other_count = data.value[0].other_count;
                this.upData.total = data.value[0].total;
                this.upData.model_count = data.value[0].model_count;
                this.upData.minning_count = data.value[0].minning_count;
            }else {
                message.warning("任务数量 请求数据失败！")
            }
        });
    }
    tableFetch(params,pagination){
        let _this = this;
        this.setState({ loading: true });
        let query = `page=${pagination.current}&size=${pagination.pageSize}&statistical_object=${params.targetValue}&statistical_period=${params.cycleValue}`;
        getAjax("/oceanus/feature_extract_statistics/getFeatureStatistics?"+query).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success' && data.value && data.value.length>0) {
                const pagination = { ...this.state.pagination };
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = data.count;
                this.upData.totalTimes = data.total_times;
                _this.setState({
                    dataSource: data.value,
                    loading:false,
                    pagination,
                })
            }else {
                _this.setState({
                    loading:false,
                });
                message.warning("无数据！")
            }
        });
    }
    handleTableChange = (page,pageSize) => {
        let {params,pagination} = this.state;
        pagination.current = page;

        // console.log(pagination);
        this.setState({
            pagination,
        },function () {
            this.tableFetch(params,pagination);
        });
    };
    /*统计周期*/
    cycleChange(e){
        // console.log(e.target.value);
        let {params,pagination} = this.state;
        params.cycleValue= e.target.value;
        pagination.current= 1;
        this.setState({
            params,
            pagination,
        },function () {
            this.cycleFetch(params);
            this.targetFetch(params);
            this.tableFetch(params,pagination);
        });
    }
    /*统计对象*/
    targetChange(e){
        // console.log( e.target.value);
        let {params,pagination} = this.state;
        params.targetValue= e.target.value;
        pagination.current= 1;
        this.setState({
            params,
            pagination,
        },function () {
            this.tableFetch(params,pagination);
        });
    }
    componentDidMount(){
        let {params,pagination} = this.state;
        this.cycleFetch(params);
        this.targetFetch(params);
        this.tableFetch(params,pagination);
    }
    render(){
        const {dataSource,loading,params,pagination} = this.state;
        const upData = this.upData;
        const columns = [
            {
                title: '特征中文名称',
                dataIndex: 'logical_name',
                /*render:(record)=>{
                 return(
                 <span>{record.applier}</span>
                 )
                 }*/
            },
            {
                title: '特征英文名称',
                dataIndex: 'en_name',
                /* render:(text,record)=>{
                 console.log(record);
                 return(
                 <span>{record.department}</span>
                 )
                 }*/
            },
            {
                title: '复用次数',
                dataIndex: 'times',
                /*render:(record)=>{
                 return(
                 <span>{record.create_time}</span>
                 )
                 }*/
            },
        ];
        const tableData = {
            loading:loading,
            className:"feature_statistics_table",
            pagination:{
                total:pagination.total,
                current:pagination.current,
                pageSize:pagination.pageSize
            },
            ///改变分页回调
            onPageChange:this.handleTableChange
        };

        const cycleOptions=[
            { label: '本周', value: 1 },
            { label: '所有', value: 0 },
        ];
        const targetOptions=[
            { label: '模型使用', value: 1 },
            { label: '大数据使用', value: 2 },
            { label: '所有', value: 0 },
        ];
        return(
            <div className="feature_statistics_content">
                <div className="statistics_box">
                    <span className="statistics_box_title">统计周期：</span>
                    <RGroup
                        options={cycleOptions}
                        defaultValue={params.cycleValue}
                        onChange={this.cycleChange.bind(this)}
                    />
                </div>
                <p className="statistics_box">
                    <span className="statistics_box_title">提取任务数量：</span><span>{upData.total}</span>
                    <span className="statistics_box_title">模型：</span><span>{upData.model_count}</span>
                    <span className="statistics_box_title">分析：</span><span>{upData.minning_count}</span>
                    <span className="statistics_box_title">其他：</span><span>{upData.other_count}</span>
                </p>
                <p className="statistics_box">
                    <span className="statistics_box_title">caller 数量：</span>
                    <span>{upData.caller_count}</span>
                </p>
                <div className="statistics_box">
                    <span className="statistics_box_title">统计对象：</span>
                    <RGroup
                        options={targetOptions}
                        defaultValue={params.targetValue}
                        onChange={this.targetChange.bind(this)}
                    />
                </div>
                <p className="statistics_box">
                    <span className="statistics_box_title">复用次数：</span>
                    <span>{upData.totalTimes}</span>
                </p>
                <MyTable
                    columns={columns}
                    dataSource= {dataSource}
                    rowKey={(record) => record.en_name}
                    tableData={tableData}
                />

            </div>
        )
    }
}
