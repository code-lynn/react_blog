import React,{Component} from 'react'
import {Modal} from 'antd'
import { is } from 'immutable';

export default class ViewModal extends Component {
    constructor(props){
        super(props)
    }
    render(){
        let statusText = '';
        if(this.props.item.status==0){
            statusText="审核中";
        }
        else if(this.props.item.status==1){
            statusText="审核通过";
        }
        else if(this.props.item.status==2){
            statusText="审核不通过";
        }
        else if(this.props.item.status==3){
            statusText="请求已删除";
        }
        return(

            <div>
                <Modal
                    title='查看'
                    visible={this.props.visibleModal}
                    onOk={()=>{this.props.handleViewCancel()}}
                    onCancel={()=>{this.props.handleViewCancel()}}
                    footer={false}
                    item={this.props.item}
                    className='service_modal'
                    >
                        <div className='survice_modal_content'>
                        <div className='survice_modal_item'>
                            <label className='control-label'>中文名称:</label>
                            <input className='didi-input service-input' value={this.props.item.ch_name} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>英文名称:</label>
                            <input className='didi-input service-input' value={this.props.item.en_name} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>申请人:</label>
                            <input className='didi-input service-input' value={this.props.item.applier_name} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>caller名称:</label>
                            <input className='didi-input service-input' value={this.props.item.caller_name} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>调用服务:</label>
                            <input className='didi-input service-input' value={this.props.item.caller_server} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>调用频次:</label>
                            <input className='didi-input service-input' value={this.props.item.caller_frequency} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>访问机器列表:</label>
                            <input className='didi-input service-input' value={this.props.item.host_list} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>经办人:</label>
                            <input className='didi-input service-input' value={this.props.item.approver} readOnly/>
                        </div>
                        <div className='survice_modal_item'>
                            <label className='control-label'>状态:</label>
                            <input className='didi-input service-input' value={statusText} readOnly/>
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