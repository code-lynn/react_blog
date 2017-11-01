import React,{Component} from 'react';
import {getAjax} from '../../fetch';
import {setCookie} from '../../methods';
import moment from 'moment';
import {Icon,Modal} from 'antd';
import './index.less';
export default class Home extends Component{
    constructor(){
        super();
        this.state = {
            update:[],
            item:{},
            visible:false
        }
    }
    render(){
        return (
            <div className="home_header_box">
                <div className="home_header clearfix">
                    <img className="fl" src={require('./home-shutterstock.jpg')} alt=""/>
                    <h1>OCEANUS海量特征平台</h1>
                    <p>构建超大规模训练集和亿级特征维度的平台</p>
                </div>
                <div className="home_component">
                    <h2>核心组件</h2>
                    <ul>
                        <li>
                            <Icon type="camera" />
                            <h3>特征快照</h3>
                            <p>简单完整地记录关键事件发生时 <br/> 所有的特征拷贝</p>
                        </li>
                        <li>
                            <Icon type="home" />
                            <h3>海量特征仓库</h3>
                            <p>有效关联和存储实时/离线的 <br/> 司机、乘客、订单、天气、路况等特征</p>
                        </li>
                        <li>
                            <Icon type="video-camera" />
                            <h3>离线实验平台</h3>
                            <p>提取并探索特征、实验超高维度的模型 <br/> &nbsp; </p>
                        </li>
                    </ul>
                    <div className="home_case clearfix">
                        <ul className="fl clearfix">
                            <li className="fl">
                                <div className="home-case-item-circle">选取特征</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">
                                    在特征平台列表中勾选所需特征
                                </div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">提交申请</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">按照提示输入申请的基本信息即可创建申请</div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">等待审核</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">可在申请列表菜单中查看申请状态，等待管理员审核</div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">启动任务</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">通过审核后可在申请列表菜单下对任务进行启动操作，可实时查看任务执行状态</div>
                            </li>
                        </ul>
                        <div className="fl">
                            <h2>特征提取</h2>
                            用户在特征平台选择所需特征，生成到指定HDFS路径中，方便进行二次开发。
                        </div>
                    </div>
                    <div className="home_case clearfix home_case2">
                        <div className="fl">
                            <h2>离线实验</h2>
                            提供海量丰富的特征数据，加上高效灵活的特征处理，结合多种模型训练，让用户只需简单的几步操作即可完成离线实验
                        </div>
                        <ul className="fr clearfix">
                            <li className="fl">
                                <div className="home-case-item-circle">基础设置</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">
                                    配置实验名、城市、开始和结束日期等基础参数
                                </div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">特征选择</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">
                                    根据实验场景选择实验所需特征，也可以使用外部数据源作为特征输入
                                </div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">特征处理</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">
                                    平台提供丰富的数据操作接口对特征进行灵活处理，支持Spark原生Transformer以及自定义UDF
                                </div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">训练参数</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">
                                    选择模型并配置训练参数，支持Spark MLlib, XGBoost, Fregata等机器学习训练库
                                </div>
                            </li>
                            <li className="fl">
                                <div className="home-case-item-circle">配置与执行</div>
                                <div className="home-case-item-title"></div>
                                <div className="home-case-item-content">
                                    根据以上四个步骤信息生成配置文件并执行训练，高级用户可以直接手动编辑配置文件并运行实验
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="home_update">
                        <h2>最近更新</h2>
                        <ul className="clearfix">
                            {this.state.update.map((item,i)=>{
                                return <li className="fl" key={i}>
                                    <div className="home-update-item-rect" onClick={this.handleClick.bind(this,item)}>
                                        {moment(item.create_time).format("MM-DD")}
                                    </div>
                                    <div className="home-update-item-title">
                                        <Icon type="backward" />
                                    </div>
                                    <div className="home-update-item-content" onClick={this.handleClick.bind(this,item)} >
                                        {item.title}
                                    </div>
                                </li>
                            })}

                        </ul>
                    </div>
                    <div className="home_footer">
                        <p>负责人：李奘</p>
                        <p>
                            反馈邮箱：
                            <a href="mailto:lizang@didichuxing.com">
                                lizang@didichuxing.com
                            </a>
                        </p>
                        <br />
                        <p ></p>
                        <div className="home-code">
                            <div>扫码进入钉钉<br/>特征平台用户群</div>
                        </div>
                    </div>

                </div>
                <Modal
                    title={this.state.item.title}
                    closable={false}
                    visible={this.state.visible}
                    onOk={()=>{this.setState({
                        visible:false
                    })}}
                    onCancel={()=>{this.setState({
                        visible:false
                    })}}
                    className="home_modal"
                >
                    <p className="home_modal_time">{moment(this.state.item.create_time).format("YYYY-MM-DD hh:mm:ss")}</p>
                    <pre style={{whiteSpace:"pre-wrap"}} dangerouslySetInnerHTML={{__html:this.state.item.content}}>
                    </pre>

                </Modal>
            </div>
        )
    }
    componentDidMount() {
        getAjax('/oceanus/index/getLatestRecord?has_all=1&page=1&size=5').then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                this.setState({
                    update:data.value
                })
            }
        });
    }
    handleClick(item){
        this.setState({
            item:item
        },function () {
            this.setState({
                visible:true
            })
        })
    }


}
