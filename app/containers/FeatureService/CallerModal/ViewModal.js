import React,{Component} from 'react'
import {Modal} from 'antd'
import { is } from 'immutable';

export default class ViewModal extends Component {
    constructor(props){
        super(props)
    }
    /*resetFields*/
    afterClose(){

    }
    render(){
        const {item} = this.props;
        const no_undefined = (value)=>{
            return value == null ? value = undefined :value;
        };
        return(
            <div>
                <Modal
                    title='查看'
                    visible={this.props.visibleModal}
                    onOk={()=>{this.props.handleViewCancel()}}
                    onCancel={()=>{this.props.handleViewCancel()}}
                    footer={false}
                    item={this.props.item}
                    className='caller_modal'
                    afterClose = {this.afterClose.bind(this)}
                    >
                        <div className='caller_modal_content'>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>系统/团队名称:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.system_name)} key={item.system_name} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>部门:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.department)} key={item.department} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>系统标识:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.system_id)} key={item.system_id} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>系统描述:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.system_description)} key={item.system_description} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>wiki地址:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.wiki_url)} key={item.wiki_url} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>需求人:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.needer)} key={item.needer} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>RD对接人:</label>
                            <input className='didi-input caller-input' value={no_undefined(item.rd_checker)} key={item.rd_checker} readOnly/>
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