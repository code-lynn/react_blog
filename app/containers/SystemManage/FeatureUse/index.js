import React,{Component} from 'react';
import './index.less';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {message} from 'antd';
import {getAjax} from '../../../fetch';

export default class FeatureUse extends Component{
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '特征中文名称',
                dataIndex: 'logical_name',
                width: '15%',
                sorter: (a, b) => {
                    return a.logical_name.localeCompare(b.logical_name)
                }
            }, {
                title: '特征英文名称',
                dataIndex: 'name',
                width: '15%',
                sorter: (a, b) => {
                    return a.name - b.name
                }
            }, {
                title: '表名',
                dataIndex: 'table_name',
                width: '30%'
            }, {
                title: '场景',
                dataIndex: 'scenario',
                width: '20%',
                render: (text,item,i) => {
                    let arrScenario = ["", "冒泡", "分单", "常规"];
                    let content = '';
                    item.scenario.forEach((ite)=>{
                        let con = arrScenario[ite]||'';
                        content+=' '+con;
                    });
                    return (<span>
                        {content}
                </span>)
                },
            }, {
                title: '特征历史使用次数',
                dataIndex: 'usage_count',
                width: '20%',
                sorter: (a, b) => {
                    return a.usage_count - b.usage_count
                }
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
        }
    }
    render() {
        console.log('FeatureUse');
        return (
            <div className="feature_use_hold_content">
                <div className="feature_use_title">
                    <h2>
                        <span>TOP100</span>
                    </h2>
                    <p>特征历史使用次数</p>
                </div>
                <div className="feature_use_download">
                    <a className="didi-btn didi-btn-ok" href="/oceanus/manage_authority/downAllFeature">下载所有特征</a>
                </div>
                <AllDataTable
                    columns={this.columns}
                    rowKey={record => record.feature_id?record.feature_id:record.id}
                    dataSource={this.state.dataSource}
                    bordered={true}
                    tableData={this.state.tableData}
                />


            </div>
        );
    }
    componentDidMount() {
        let _this = this;
        ////获取初始信息
        getAjax('/oceanus/manage_authority/getTopFeature?page=1&size=1000').then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                _this.setState({
                    ///表格数据源
                    dataSource:data.value,
                    tableData:{
                        loading:false,
                        pagination:{
                            pageSize:10,
                            total:data.count
                        },
                    }
                });
            }else{
                message.error('获取数据错误');
            }

        });
    }
    handleChange(page){
        console.log(page)
    }

}

