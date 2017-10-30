import React,{Component} from 'react'
import {Modal} from 'antd'
import { is } from 'immutable';

export default class ViewModalSeeing extends Component {
    constructor(props){
        super(props)
    }
    render(){
        let contentList = '特征服务URL请咨询常智华(changzhihua@didichuxing.com)、凌宏博(linghongbo@didichuxing.com)、曹利锋(caolifeng@didichuxing.com)。';
        return(

            <div>
                <Modal
                    title='查看'
                    visible={this.props.visibleModalSeeing}
                    onOk={()=>{this.props.handleViewSeeingCancel()}}
                    onCancel={()=>{this.props.handleViewSeeingCancel()}}
                    footer={false}
                    className='service_modal_container'
                    >
                        <div className='survice_modal_content'>
                        <div className='survice_modal_item'>
                            <label className='control-label'>特征列表:</label>
                            <textarea style={{"height":"80px"}} className='didi-input service-input' value={this.props.item.fields?this.props.item.fields:''} readOnly > </textarea>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>线上特征服务URL:</label>
                            <textarea style={{"height":"80px"}} className='didi-input service-input' value={this.props.item.url?this.props.item.url:contentList} readOnly ></textarea>
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