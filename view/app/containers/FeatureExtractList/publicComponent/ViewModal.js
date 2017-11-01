import React,{Component} from 'react';
import {Modal} from 'antd';
import { is } from 'immutable';
import './ViewModal.less';
export default class ViewModal extends Component{
    constructor(props){
        super(props);
        this.fmt = ['', 'CSV', 'Hive表'];
        this.getRequireArray = [
            {
                purpose:1,
                name: "模型开发"
            },
            {
                purpose:2,
                name: "数据挖掘/分析"
            },
            {
                purpose:3,
                name: "其他"
            }
        ];
    }
    render(){
        ///console.log('task_view_modal');
        ///输出数据路径
        let output_fmt_path = '';
        if(this.fmt[this.props.item.output_fmt] == 'CSV'){
            output_fmt_path = <div className="task_view_content_item">
                <div>输出数据路径：</div>
                <input style={{"height":"30px"}} readOnly="readOnly"  value={this.props.item.user_define_path||''}></input>
            </div>;
        }
        ///Hive表
        let hive_table = '';
        ///Hadoop
        let hadoop_user = '';
        ///申请权限
        let applyDataAuth = '';
        if(this.fmt[this.props.item.output_fmt] == 'Hive表'){
            hive_table = <div className="task_view_content_item">
                <div>Hive表：</div>
                <input style={{"height":"30px"}} readOnly="readOnly" value={this.props.item.hive_table||''} ></input>
            </div>;
            hadoop_user = <div className="task_view_content_item">
                <div>Hadoop账户：</div>
                <input style={{"height":"30px"}} readOnly="readOnly" value={this.props.item.hadoop_user||''} ></input>
            </div>;
            if(this.props.item.status == 2){
                let url = this.props.item.hive_table.split('.');
                applyDataAuth = <div className="task_view_content_item">
                    <label></label>
                    <h3 style={{"height":"40px","fontSize":"12px","fontWeight":"normal"}} >
                        <a style={{"color":"#fa8919"}} target="_blank" href={`http://dpp.intra.xiaojukeji.com/index?hash=/apply/dataAuth?hiveDatabase=${url[0]}&hiveTable=${url[1]}&hadoopAccount=${this.props.item.hadoop_user}#/apply/dataAuth?hiveDatabase=${url[0]}&hiveTable=${url[1]}&hadoopAccount=${this.props.item.hadoop_user}`}>申请读权限</a>
                        <br/>
                        Hive表同步到D++平台需一定时间，如果暂时查不到该表，请耐心等待
                    </h3>
                </div>;
            }
            
        }
        ////model_type  model_old_type 模型
        let model_type = '';
        ///需求目的
        let req_des = '';
        if(this.props.item.model_type == null){
            ///老的
            model_type = <div className="task_view_content_item">
                <div>模型：</div>
                <input style={{"height":"30px"}} value={this.props.item.model_content||''}  readOnly="readOnly" ></input>
            </div>;
        }else{
            ///新的
            this.getRequireArray.forEach((item,i)=>{
                if(item.purpose == this.props.item.model_type){
                    if(item.purpose == 1){
                        model_type = <div className="task_view_content_item">
                            <div>模型：</div>
                            <input style={{"height":"30px"}} value={this.props.item.model_content||''}  readOnly="readOnly" ></input>
                        </div>;
                        req_des = <div className="task_view_content_item">
                            <div>需求目的：</div>
                            <input style={{"height":"30px"}} value={item.name||''}  readOnly="readOnly" ></input>
                        </div>;
                    }
                    if(item.purpose == 2){
                        req_des = <div className="task_view_content_item">
                            <div>需求目的：</div>
                            <input style={{"height":"30px"}} readOnly="readOnly" value={item.name||''} ></input>
                        </div>;
                    }
                    if(item.purpose == 3){
                        req_des = <div className="task_view_content_item">
                            <div>需求目的：</div>
                            <input style={{"height":"30px"}} value={this.props.item.model_content||''} readOnly="readOnly" ></input>
                        </div>;
                    }
                }
            })
        }
        let group = '';
        let groupName = '特征所属组别';
        if(this.props.item.table_group){
            if( this.props.item.table_group.indexOf('[')>-1){
                group = eval('('+this.props.item.table_group+')').join(', ');
                groupName = '审核人列表';
            }else{
                group = this.props.item.table_group
            }
        }

        return (
            <div>
                <Modal
                    title="查看"
                    visible={this.props.visibleModal}
                    onOk={()=>{this.props.handleViewCancel()}}
                    onCancel={()=>{this.props.handleViewCancel()}}
                    className="task_view_modal"
                    footer={false}
                >
                    <div className="task_view_content">
                        {this.props.item.task_scene==0?(''):(<div className="task_view_content_item">
                            <div>已选特征：</div>
                            <textarea style={{"height":"80px","lineHeight":"20px"}} readOnly="readOnly" value={this.props.item.feature_list||''} ></textarea>
                        </div>)}

                        <div className="task_view_content_item">
                            <div>{groupName}：</div>
                            <input style={{"height":"30px"}} readOnly="readOnly" value={group} ></input>
                        </div>
                        {this.props.item.task_scene==0?(''):(<div>
                            <div className="task_view_content_item">
                                <div>选择城市：</div>
                                <input style={{"height":"30px"}} readOnly="readOnly" value={this.props.item.cities||'所有城市'} ></input>
                            </div>
                            <div className="task_view_content_item">
                                <div>输出数据格式：</div>
                                <input style={{"height":"30px"}} readOnly="readOnly" value={this.fmt[this.props.item.output_fmt]||''} ></input>
                            </div>
                            {output_fmt_path}
                            {hive_table}
                            {applyDataAuth}
                            {hadoop_user}

                            <div className="task_view_content_item">
                                <div>开始时间：</div>
                                <input style={{"height":"30px"}} readOnly="readOnly" value={this.props.item.start_day||''}  ></input>
                            </div>
                            <div className="task_view_content_item">
                                <div>结束时间：</div>
                                <input style={{"height":"30px"}} readOnly="readOnly" value={this.props.item.end_day||''} ></input>
                            </div>
                        </div>)}
                        {req_des}
                        {model_type}
                        <div className="task_view_content_item">
                            <div>背景：</div>
                            <textarea style={{"height":"80px","lineHeight":"20px"}} readOnly="readOnly" value={this.props.item.background||''} ></textarea>
                        </div>
                        <div className="task_view_content_item">
                            <div>现状：</div>
                            <textarea style={{"height":"80px","lineHeight":"20px"}} readOnly="readOnly" value={this.props.item.current_situation||''} ></textarea>
                        </div>
                        <div className="task_view_content_item">
                            <div>预期收益：</div>
                            <textarea style={{"height":"80px","lineHeight":"20px"}} readOnly="readOnly" value={this.props.item.expect_gain||''} ></textarea>
                        </div>
                    </div>
                </Modal>
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
                if(typeof thisProps[key] !== 'function'){
                    return true;
                }
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
}