import React,{Component} from 'react';
import {hashHistory} from 'react-router';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../actions';
import {getCookie} from '../../methods';
import {Icon} from 'antd';
import './index.less';

class HomeHeader extends Component{
    constructor(props){
        super(props);
        this.state = {
            header:[]
        }
    }
    render(){
        return (
            <div className="header clearfix">
                <div className="fl clearfix logo_style" onClick={this.handleClick.bind(this)}>
                    <img src={require('./didi-logo-common.png')} className="fl" alt=""/>
                    <div className="fl">特征平台</div>
                </div>
                <ul className="fl clearfix">
                    <li className="fl nav-title">
                        <Link to="/feature_view" name='feature_view'  className={`ft-color `+('feature_view'==this.props.changeHeader.activeItemFirst?'active':'')}>特征仓库</Link>
                    </li>
                    <li className="fl nav-title">
                        <Link to="/feature_extract_list" name='feature_extract_list'  className={`ft-color `+('feature_extract_list'==this.props.changeHeader.activeItemFirst?'active':'')}>特征提取</Link>
                    </li>
                    <li className="fl nav-title">
                        <Link to="/feature_service" name='feature_service'  className={`ft-color `+('feature_service'==this.props.changeHeader.activeItemFirst?'active':'')}>特征服务</Link>
                    </li>
                    <li className="fl nav-title">
                        <Link to="/feature_manage" name='feature_manage'  className={`ft-color `+('feature_manage'==this.props.changeHeader.activeItemFirst?'active':'')}>特征管理</Link>
                    </li>
                    {/*<li className="fl nav-title">*/}
                        {/*<a href="javascript:;" className="ft-color">离线实验</a>*/}
                    {/*</li>*/}
                    <li className="fl nav-title">
                        <Link to="/mlbox" name='mlbox'  className={`ft-color `+('mlbox'==this.props.changeHeader.activeItemFirst?'active':'')}>MLbox</Link>
                    </li>

                    <li className="fl nav-title">
                        <Link to="/system_manage" name='system_manage'  className={`ft-color `+('system_manage'==this.props.changeHeader.activeItemFirst?'active':'')}>系统管理</Link>
                    </li>
                </ul>
                <div className="fr logoInfo">
                    <span>{getCookie('username')}</span>
                    &nbsp;
                    <Icon type="caret-up" className="logout_up"/>
                    <Icon type="caret-down" className="logout_down"/>
                    <br/>
                    <span className="logout" onClick={this.handleLoginOut.bind(this)}>
                        <a href="/oceanus/logout">退出</a>
                    </span>
                </div>
            </div>
        )
    }
    componentWillMount(){
        this.changeHeader();
        window.addEventListener('hashchange',this.changeHeader);
    }

    handleClick(){
        hashHistory.push('/home');
    }
    handleLoginOut(){
        window.location.href = window.location.host +'/oceanus/logout/';
    }
    componentDidUpdate() {

    }
    changeHeader = ()=>{
        let activeItem = window.location.hash.match(/[a-zA-Z\_]+/g) || 'home';
        let activeItemFirst = Array.isArray(activeItem) ? activeItem[0] : activeItem;
        let activeItemSecond = Array.isArray(activeItem)&&activeItem.length>1 ? activeItem[1] : '';
        this.props.actions.changeHeader({ //会调用action中的changeSidebar方法
            activeItemFirst,
            activeItemSecond
        });
    };
}

export default connect(
    state => {
        return {
            //changeHeader会放在this.props上
            changeHeader:state.changeHeader
        }
    },
    dispatch =>{
        return {
            //会在this.props增加actions属性,里面就有一个叫changeSidebar的方法
            actions:bindActionCreators(actions,dispatch)
        }
    }
    //两个参数  第一个参数是mapStateToProps 获取状态
    //第二个参数 mapActionsToProps 获取action的
)(HomeHeader);