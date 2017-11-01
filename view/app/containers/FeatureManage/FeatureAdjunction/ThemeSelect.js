import React, { Component } from 'react'
import {Select} from 'antd'
const Option = Select.Option

export default class ThemeSelect extends Component {
    render(){
        return(
            <div>
                <label className="control-label"><span className="xing">*</span>特征主题：</label>
                <Select 
                    size="large" 
                    showSearch 
                    style={{width:"100%"}}
                    filterOption={(input, option) => option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    optionFilterProp="children"
                    value={this.props.default_theme_value}
                    placeholder="请选择特征主题"
                    onChange={this.handleThemeChange.bind(this)}
                >
                    {
                            this.props.theme_data.length === 0 ? <Option value={`N/A`}>当前特征无法选取特征主题</Option> :
                            this.props.theme_data.map((item,index)=>{
                                return (
                                    <Option key={index} value={item} >{item}</Option>
                                )
                            })
                        
                    }
                </Select>
            </div>
        )
    }
    handleThemeChange(value){
        this.props.handleThemeChange(value)
    }
}