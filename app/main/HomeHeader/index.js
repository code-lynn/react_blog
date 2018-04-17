import React,{Component} from 'react';
import {hashHistory} from 'react-router';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../../redux/actions';
import {getCookie} from '../../utils';
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
                    {/*<img src={require('./logo.png')} className="fl" alt=""/>*/}
                    <h3 style={{"color":"white","marginRight":"10px"}} className="fl">dalyn</h3>
                    <div className="fl">blog</div>
                </div>
                <ul className="fl clearfix">

                    <li className="fl nav-title">
                        <Link to="/Web" name='Web' className={`ft-color ` + ('Web'==this.props.changeHeader.activeItemFirst?'active':'')}>WEB</Link>
                    </li>
                </ul>
                <div className="fr logoInfo">
                    <span>{getCookie('username')}</span>
                    &nbsp;
                    <Icon type="caret-up" className="logout_up"/>
                    <Icon type="caret-down" className="logout_down"/>
                    <br/>
                    <span className="logout" onClick={this.handleLoginOut.bind(this)}>
                        <a href="javascript:;">退出</a>
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