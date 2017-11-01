import React,{Component} from 'react'
import {Modal,Input} from 'antd'
import { is } from 'immutable';


export default class AuditTaskModal extends Component {
    constructor(props){
        super(props);
    }
    render(){
        return(
            <div>
                <Modal
                    title='编辑'
                    visible={this.props.visibleModal}
                    onOk={()=>{this.props.handleViewSubmit()}}
                    onCancel={()=>{this.props.handleViewCancel()}}
                    className='caller_modal'
                    >
                    <div className='caller_modal_content'>
                        {this.props.item.task_scene !=0?(<div>
                            <div className='caller_modal_item'>
                                <label className='control-label-audit'>已选特征<span style={{"color":"#fa8919"}}>(可编辑)</span>:</label>
                                <Input type="textarea" style={{"height":"120px"}} className='didi-input caller-input' value={this.props.feature_list?this.props.feature_list:''} onChange={this.handleChange.bind(this)} />
                            </div>
                            <div className='caller_modal_item'>
                                <label className='control-label-audit'>选择的城市:</label>
                                <Input type="textarea" style={{"height":"120px"}} className='didi-input caller-input' value={this.props.item.cities} readOnly />
                            </div>
                            <div className='caller_modal_item'>
                                <label className='control-label-audit'>输出数据格式:</label>
                                <Input className='didi-input caller-input' value={this.props.item.output_fmt} readOnly/>
                            </div>
                            {this.props.item.output_fmt==='CSV'?(<div className='caller_modal_item'>
                                <label className='control-label-audit'>输出数据路径:</label>
                                <Input className='didi-input caller-input' value={this.props.item.user_define_path} readOnly/>
                            </div>):''}
                            <div className='caller_modal_item'>
                                <label className='control-label-audit'>开始时间:</label>
                                <Input className='didi-input caller-input' value={this.props.item.start_day} readOnly/>
                            </div>
                            <div className='caller_modal_item'>
                                <label className='control-label-audit'>结束时间:</label>
                                <Input className='didi-input caller-input' value={this.props.item.end_day} readOnly/>
                            </div>
                        </div>):''}
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>需求目的:</label>
                            <Input className='didi-input caller-input' value={this.props.item.model_type} readOnly/>
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>背景:</label>
                            <Input type="textarea" style={{"height":"120px"}} className='didi-input caller-input' value={this.props.item.background} readOnly />
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>现状:</label>
                            <Input type="textarea" style={{"height":"120px"}} className='didi-input caller-input' value={this.props.item.current_situation} readOnly />
                        </div>
                        <div className='caller_modal_item'>
                            <label className='control-label-audit'>预期收益:</label>
                            <Input type="textarea" style={{"height":"120px"}} className='didi-input caller-input' value={this.props.item.expect_gain} readOnly />
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
    handleChange(e){
        this.props.handleChange(e.target.value);
    }
}