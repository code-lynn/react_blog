/**
 *  api 参数使用详情请见ant-design API -- https://ant.design/components/table-cn/
 *  共四个主参数 columns、dataSource、rowKey tableData
 *  三个必传项：
 *      columns 表头
 *      dataSource 列表数组
 *      rowKey 主键
 *  其他参数 tableData:{
                loading 加载动画
                pagination:{ 页码
                    total:10,总数
                    pageSize:10 单页条数
                }
            }
 *
 * */
import React,{Component} from 'react';
import {Table} from 'antd';
import { is } from 'immutable';
import './index.less';
export default class AllDataTable extends Component{
    constructor(props){
        super(props);
    }

    render(){
        // console.log(this.props.tableData.pagination);
        return (
            <div className="public-table">
                <Table columns={this.props.columns}
                       rowKey={this.props.rowKey}
                       dataSource={this.props.dataSource}
                       bordered={true}
                       pagination={this.props.tableData&&this.props.tableData.pagination}
                       loading={this.props.tableData&&this.props.tableData.loading}
                       onChange={this.onChange.bind(this)}

                />
                {this.props.dataSource.length>0?(<div className="public-count">共{this.props.tableData.pagination.total}条记录</div>):''}

            </div>
        )
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        if(nextState === null){
            nextState={}
        }
        if(nextProps === null){
            nextProps={}
        }
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length||Object.keys(thisState).length !== Object.keys(nextState).length){
            return true;
        }
        for (const key in nextProps) {
            if (!is(thisProps[key], nextProps[key])) {
                return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }

    onChange(page,pageSize){
        this.props.tableData.handleTableChange && this.props.tableData.handleTableChange(page,pageSize);
    }

}