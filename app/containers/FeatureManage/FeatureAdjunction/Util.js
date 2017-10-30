import React, { Component } from 'react'
import {Icon,Button,Row,Col,message,Modal,Input} from 'antd'
export default class Util extends Component{
    constructor(props){
        super(props)   
        this.state = {
            isEdit:false
        } 
    }
    componentWillMount(){
        if(this.props.dataId != ""){
            this.setState({isEdit:true})
        }
    }
    render(){
        return(
            <div className="util">
                <Row>
                    
                    <Col span={4} offset={20}>
                        <div className={`add-button ` + (this.state.isEdit?`hide`:``)} onClick={this.handleAddFeature}>
                            <Icon type="plus" style={{color:"#fa8919",marginTop:3,fontSize:19}}/>
                            <span className="add-feature-info">新增特征</span>
                        </div>
                    </Col>
                    
                </Row>
                <Row className="submit-utils">
                    <Col span={2} offset={20}>
                        <Button type="primary" size="large" onClick={this.props.showModal}>预览特征</Button>
                    </Col>
                    <Col span={2}>
                    {
                        this.state.isEdit?
                        <Button className={`submit-button `} type="primary" size="large" onClick={this.handleEdit.bind(this,this.props.dataId)}>修改</Button>
                      :  <Button className={`submit-button `} type="primary" size="large" onClick={this.handleSubmit}>提交申请</Button>
                    }   
                    </Col>
                </Row>
                <Modal title="预览特征" visible={this.props.previewVisible} onOk={this.props.Ok} onCancel={this.props.handleCancel}>
                    <Input  type="textarea" autosize={{minRows:6,maxRows:6}} readOnly
                            value={
                                `SELECT` +
                                    this.props.feature_arr.map(function(item){return(`\r\n     ${item.source_field} AS ${item.en_name}`)}) +`\r\n`+
                                    `FROM ${this.props.hive_table}\r\n`+
                                    `WHERE ${this.props.partition}`
                                } 
                    />
                </Modal>
            </div>
        )
    }
    handleAddFeature = ()=>{
        let warning_arr = []
        warning_arr = this.props.handleValiFeature()
        if(warning_arr.length==0){
            this.props.handleAddFeature()
        } else {
            message.error("请将特征的字段填写完整再新增特征")
        }
    }
    handleSubmit = ()=>{
        let warning_arr=this.props.handleValiFeature()
        let table_arr = this.props.handleValiTable()
        warning_arr = warning_arr.concat(table_arr);
        if(warning_arr.length==0){
            this.props.handleSubmit()
        } else {
            warning_arr.forEach(function(item){
                message.warning(item)
            })
        }
    }
    handleEdit = (id)=>{
        let warning_arr=this.props.handleValiFeature()
        let table_arr = this.props.handleValiTable()
        warning_arr = warning_arr.concat(table_arr);
        if(warning_arr.length==0){
            this.props.handleEdit(id)
        } else {
            warning_arr.forEach(function(item){
                message.warning(item)
            })
        }
    }
}