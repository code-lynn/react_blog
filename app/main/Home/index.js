import React,{Component} from 'react';
import {getAjax} from '../../fetch';
import {setCookie} from '../../utils';
import moment from 'moment';
import {Icon,Modal} from 'antd';
import './index.less';
export default class Home extends Component{
    constructor(){
        super();
        this.state = {

        }
    }
    render(){
        return (
            <div className="home_header_box">
                <div className="home_header clearfix">
                    {/*<img className="fl" src={require('./home-shutterstock.jpg')} alt=""/>*/}
                    <h1>home</h1>
                    <p>blog</p>
                </div>
            </div>
        )
    }
    componentDidMount() {
        // getAjax('/oceanus/index/getLatestRecord?has_all=1&page=1&size=5').then(res=>res.json()).then(data=>{
        //     if(data.status == 'success'){
        //         this.setState({
        //             update:data.value
        //         })
        //     }
        // });
    }


}
