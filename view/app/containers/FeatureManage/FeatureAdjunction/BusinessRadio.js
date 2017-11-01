import React, { Component } from 'react'
import {Radio} from 'antd'
const RadioGroup = Radio.Group
export default class BusinessRadio extends Component{
    constructor(props){
        super(props)
        this.state = {
            business_type:""
        }
    }

    render(){
        return (
            <div className="ant-row" style={{}} >
                <label className="control-label" ><span className="xing">*</span>业务线:</label>
                <RadioGroup onChange={this.businessChange} value={this.props.default_business_value} style={{paddingLeft:23}}>
                    {
                     this.props.business_type_arr.map(
                        (item,index)=>{
                            return <Radio key={index} value={`${item.value}`}>{item.name}</Radio>
                        })
                    }  
                </RadioGroup>
            </div>
        )
    }
    businessChange = (e)=>{
       this.props.businessChange(e)
    }
}