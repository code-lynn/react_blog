import React,{Component} from 'react';
import {Icon} from 'antd';
import {hashHistory} from 'react-router'
export default class MyTaskTop extends Component{
    render(){
        ///console.log('top');
        return (
            <div className="my_task_update">
                <div style={{textAlign:"right", marginBottom: "-35px"}}>
                    <a className="didi-btn didi-btn-ok" target="_blank" href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=97826328">操作手册</a>
                </div>
                <p>特征提取面向策略模型开发者、数据分析师和运营人员，旨在提供简单统一的接口，用于提取乘客、司机、地图和天气等特征</p>
                <br/>
                <p>特征提取任务创建流程</p>
                <ul className="my_task_update-item clearfix">
                    <li className="fl" onClick={this.handleClick.bind(this)}>
                        <div className="my_task_update-item-rect">
                            <Icon type="file-text" />
                        </div>
                        <div className="my_task_update-item-title">
                            <Icon type="forward" />
                        </div>
                        <div className="my_task_update-item-content">选取特征</div>
                    </li>
                    <li className="fl">
                        <div className="my_task_update-item-rect">
                            <Icon type="file-add" />
                        </div>
                        <div className="my_task_update-item-title">
                            <Icon type="forward" />
                        </div>
                        <div className="my_task_update-item-content">提交申请</div>
                    </li>
                    <li className="fl">
                        <div className="my_task_update-item-rect">
                            <Icon type="check-circle" />
                        </div>
                        <div className="my_task_update-item-title">
                            <Icon type="forward" />
                        </div>
                        <div className="my_task_update-item-content">等待审核</div>
                    </li>
                    <li className="fl">
                        <div className="my_task_update-item-rect">
                            <Icon type="play-circle-o" />
                        </div>
                        <div className="my_task_update-item-title">
                            <Icon type="forward" />
                        </div>
                        <div className="my_task_update-item-content">启动任务</div>
                    </li>
                    <li className="fl">
                        <div className="my_task_update-item-rect">
                            <Icon type="menu-fold" />
                        </div>
                        <div className="my_task_update-item-title">
                            <Icon type="forward" />
                        </div>
                        <div className="my_task_update-item-content">查看结果</div>
                    </li>
                </ul>
            </div>
        )
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        return false;
    }
    handleClick(){
        let url = `/feature_extract_list/selected_feature/`;
        hashHistory.push(url)
    }
}