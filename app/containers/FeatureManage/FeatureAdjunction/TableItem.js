import {Input,message,Row,Col,Select,Radio,Icon,Tooltip} from "antd";
import React, { Component } from "react";
const Option = Select.Option;
const RadioGroup = Radio.Group;
export default class TableItem extends Component {
    constructor(props){
        super(props)
        this.state = {
            demotion_info_show:false,
        }
    }
    render(){
        console.log(this.props.filter_condition,this.props.primary_key)
       let partition_value = ["concat_ws('-',year, month, day)='${year}-${month}-${day}","pt='${year}-${month}-${day}'","空"]
       let extract_period = ['1','7','30']
        return(
            <div className="table_info">
                <h3 className="table_title">来源表信息</h3>
                <div className="table_form">
                    <Row gutter={128}>
                        <Col span={10}>
                            <label className="control-label"><span className="xing">*</span>hive源表:</label>
                            <Input size="large" value={this.props.hive_table} onChange={this.handleHiveChange.bind(this)} placeholder="请填写hive源表" />
                        </Col>
                        <Col span={10}>
                            <label className="control-label"><span className="xing">*</span>主键：</label>
                            <Input size="large" value={this.props.primary_key} onChange={this.handlePrimaryKeyChange.bind(this)} placeholder="请填写主键" />
                        </Col>                    
                    </Row>
                    <Row gutter={128}>
                        <Col span={10}>
                            <label className="control-label">过滤条件：</label>
                            <Input size="large" value={this.props.filter_condition} onChange={this.handleFilterConditionChange.bind(this)} placeholder="请填写过滤条件" />
                        </Col>
                        <Col span={10}>
                            <label className="control-label"><span className="xing">*</span>分区格式：</label>
                            <Select className="" value={`${this.props.partition}`} onChange={this.handlePartitionChange.bind(this)} size="large" defaultValue={partition_value[0]} style={{width:"100%"}}>
                                <Option value={partition_value[0]}>{partition_value[0]}</Option>
                                <Option value={partition_value[1]}>{partition_value[1]}</Option>
                                <Option value={`N/A`}>{partition_value[2]}</Option>
                            </Select>
                        </Col>                    
                    </Row>                  
                    <Row gutter={128}>
                        <Col span={10} className="demotion-item">
                            <label className="control-label"><span className="xing">*</span>可降级：</label>
                            <RadioGroup defaultValue={1}>
                                <Radio  disabled={false} value={1}>是</Radio>
                                <Radio  disabled={true} value={0}>否</Radio>
                            </RadioGroup>
                            <Tooltip title='凌晨6点数据未产出，则降级取最近一天分区数据' placement='right'>
                                <Icon type="exclamation-circle" style={{fontSize:14,color:"#707070"}}/>
                            </Tooltip>
                        </Col>
                        <Col span={10}>
                            <label className="control-label"><span className="xing">*</span>提取周期：</label>
                            <Select className="" value={`${this.props.extract_period}`} onChange={this.handlePeriodChange.bind(this)} size="large"  style={{width:"100%"}}>
                                <Option value={extract_period[0]}>{extract_period[0]}天</Option>
                                <Option value={extract_period[1]}>{extract_period[1]}天</Option>
                                <Option value={extract_period[2]}>{extract_period[2]}天</Option>
                            </Select>
                        </Col>     
                        <Tooltip title='数据产出周期' placement='right'>
                            <Icon type="exclamation-circle" style={{fontSize:14,color:"#707070",position:"relative",top:28,left:-30}}/>
                        </Tooltip>             
                    </Row>
                </div>
  
            </div>
        )
    }
    handleInfoShow(){
        this.setState({demotion_info_show:true})
    }
    handleInfoHide(){
        this.setState({demotion_info_show:false})
    }
    componentDidMount = () => {
      
    }
    handleHiveChange = (e)=>{
        this.props.handleTableChange(e,"hive_table")
    }
    handlePrimaryKeyChange = (e)=>{
        this.props.handleTableChange(e,"primary_key")
    }
    handleFilterConditionChange = (e)=>{
        this.props.handleTableChange(e,"filter_condition")
        
    }
    handlePartitionChange = (value)=>{
        this.props.handleTableSelect(value,"partition") 
    }
    handlePeriodChange = (value)=>{
        this.props.handleTableSelect(value,"extract_period") 
    }
    
}
