import React,{Component} from 'react';
import {DatePicker} from 'antd';
import { is } from 'immutable';
import moment from 'moment';
const dateFormat = 'YYYY-MM-DD';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

export default class SingleDatePicker extends Component{
    constructor(props){
        super(props);
        this.state = {
            objDate:{
                allowClear:false,
                format:'YYYY-MM-DD',

            },
            maxValue:this.props.datePickerData.maxValue,
            minValue:this.props.datePickerData.minValue,
            startValue:this.props.datePickerData.startValue,
        }
    }
    render(){
        // console.log('single');
        const {params} = this.props;
        return (
            <DatePicker
                disabledDate={this.disabledDate.bind(this)}
                value={moment(this.props.datePickerData.startValue,dateFormat)}
                onChange={this.handleDateChange.bind(this)}
                {...this.state.objDate}
                {...params}
            />
        )
    }
    componentDidMount() {

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
                return true;
            }
        }
        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
    handleDateChange(date, dateString){
        this.props.datePickerData.handleDateChange(date, dateString);
    }
    disabledDate(current){
        const maxValue = this.props.datePickerData.maxValue || null;
        const minValue = this.props.datePickerData.minValue || null;
        if(minValue && maxValue){
            return (current.valueOf() > new Date(maxValue.valueOf()).getTime()) || (current.valueOf() < (new Date(minValue.valueOf()).getTime())-86400000);
        }else if(minValue && !maxValue){
            return current.valueOf() < (new Date(minValue.valueOf()).getTime())-86400000;
        }else if(!minValue && maxValue){
            return current.valueOf() > new Date(maxValue.valueOf()).getTime();
        }

    }
}

////日历api  传进参数有四种   最大日期 2017-08-01 || null maxValue:this.props.maxValue, 最小日期 2017-06-01 或者null  minValue:this.props.minValue, 默认显示的日期 2017-08-01 startValue:this.props.startValue  再传一个回调函数  this.props.handleDateChange(date, dateString);  名字是  handleDateChange  如果变化  自动触发handleDateChange

// 父组件中的使用
// 1，import SingleDatePicker 传参   <SingleDatePicker maxValue={this.state.maxValue}  minValue={this.state.minValue}  startValue={this.state.startValue}  handleDateChange={this.handleDateChange}/>
///2 当子组件改变日期后 触发
// handleDateChange(date, dateString){
//     console.log(date, dateString);
// }
// 3、params 自定义参数对象


