/**
 *  api 参数使用详情请见ant-design API -- https://ant.design/components/table-cn/
 *  共四个主参数 columns、dataSource、rowKey tableData
 *  三个必传项：
 *      columns 表头
 *      dataSource 列表数组
 *      rowKey 主键
 *  其他参数 tableData:{
                loading 加载动画
                className 附加类名table pagination
                //
                pagination:{ 页码
                    total:10,总数
                    current:6,当前页码
                    pageSize:10 单页条数
                },
                onPageChange（page,pageSize） 改变分页回调-Pagination组件
                onShowSizeChange(current, size) pageSize 变化的回调-Pagination组件
                //
                onChange（pagination, filters, sorter） 表格内部改变分页、排序、筛选回调
                rowSelection 单选 多选配置
                onRowClick 点击行
                locale 帅选 排序文案
                scroll 滚动设置
            }
 *
 * */
import React,{Component} from 'react';
import {Table,Pagination} from 'antd';
import { is } from 'immutable';
import './index.less';
export default class MyTable extends Component{
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
                       pagination={false}
                       loading={this.props.tableData&&this.props.tableData.loading}
                       className={this.props.tableData&&this.props.tableData.className}
                       onChange={this.props.tableData&&this.props.tableData.onChange}
                       rowSelection={this.props.tableData&&this.props.tableData.rowSelection}
                       onRowClick={this.props.tableData&&this.props.tableData.onRowClick}
                       locale={this.props.tableData&&this.props.tableData.locale}
                       scroll={this.props.tableData&&this.props.tableData.scroll}
                />
                {
                    this.props.tableData&&this.props.tableData.pagination && (
                        <div className="clearfix public-table-bottom">
                            <div className="fl">共{this.props.tableData.pagination.total}条记录</div>
                            <div className="fr">
                                <Pagination
                                    showQuickJumper
                                    {...this.props.tableData.pagination}
                                    onChange={this.onChange.bind(this)}
                                    className={this.props.tableData.className}
                                    onShowSizeChange={this.onShowSizeChange.bind(this)}
                                />
                            </div>
                        </div>
                    )
                }

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
        this.props.tableData.onPageChange(page,pageSize);
    }
    onShowSizeChange(current, size){
        this.props.tableData.onShowSizeChange(current, size);
    }

}