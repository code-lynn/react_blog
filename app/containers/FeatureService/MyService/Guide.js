import React, { Component } from "react"
import {Icon} from "antd"
export default class Guide extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div className="my_service_guide">
                <p className="center-text">特征服务面向策略模型开发者、运营人员等，旨在提供线上特征访问接口，用于线上服务获取出行场景、乘客、司机和天气等特征。</p>
                <p className="center-text">目前，特征服务提供<a style={{"color": "#fa8919"}} href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=93855181"> HTTP </a>和<a style={{"color": "#fa8919"}} href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=97646689"> Thrift </a>接口。</p>
                <div className="guide-list">
                    <p className="center-text title">按照类别，目前公开的特征服务主要有以下几类</p>
                    <div className="part">
                        <p className="subtitle"><a style={{"color": "#fa8919"}} href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=92129314">场景服务</a></p>
                        <p>a. 通过POI名称查询POI类别</p>
                        <p>b. 通过经纬度查询POI类别</p>
                        <p>c. 通过订单信息查询乘客出行场景类别</p>
                    </div>

                    <div className="part">
                        <p className="subtitle"><a style={{"color": "#fa8919"}} href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=34951719">天气服务</a></p>
                        <p>a. 通过经纬度查询天气</p>
                        <p>b. 通过城市查询天气</p>
                    </div>

                    <div className="part">
                    <p className="subtitle"><a style={{"color": "#fa8919"}} href="http://wiki.intra.xiaojukeji.com/pages/viewpage.action?pageId=93855181">特征通用服务</a></p>
                        <p>例如，通过乘客ID、司机ID查询乘客、司机信息</p>
                    </div>
                    
                </div>
                <div className="guide-progress">
                    <div className="guide-progress-item">
                        <div className="guide-progress-rect">
                            <Icon type="file-text" />
                        </div>
                        <div className="guide-progress-title">
                            <Icon type="forward" />
                        </div>
                        <div className="guide-progress-content">填写caller</div>
                        
                    </div>
                    <div className="guide-progress-item">
                        <div className="guide-progress-rect">
                                <Icon type="file-add" />
                            </div>
                            <div className="guide-progress-title">
                                <Icon type="forward" />
                            </div>
                            <div className="guide-progress-content">选择特征服务类别</div>
                        </div>
                    <div className="guide-progress-item">
                        <div className="guide-progress-rect">
                            <Icon type="usergroup-add" />
                        </div>
                        <div className="guide-progress-title">
                            <Icon type="forward" />
                        </div>
                        <div className="guide-progress-content">等待审核</div>
                    </div>
                    <div className="guide-progress-item">
                        <div className="guide-progress-rect">
                            <Icon type="check-circle" />
                        </div>
                        <div className="guide-progress-title">
                            <Icon type="forward" />
                        </div>
                        <div className="guide-progress-content">完成服务创建</div>
                    </div>
                    <div className="guide-progress-item">
                        <div className="guide-progress-rect">
                            <Icon type="menu-fold" />
                        </div>
                        <div className="guide-progress-title">
                            <Icon type="forward" />
                        </div>
                        <div className="guide-progress-content">测试线上访问是否成功</div>  
                    </div>                
                </div>
            </div>
        )
    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        return false;
    }
}