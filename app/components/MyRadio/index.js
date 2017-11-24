/**
 *  Radio RadioGroup RadioButton的封装
 *  使用时 import myRadio from 'MyRadio';
 *          const RGroup = myRadio.RGroup;
            const RButton = myRadio.RButton;
            const MRadio = myRadio.MRadio;
    或者 import {MRadio,RGroup,RButton} from 'MyRadio';

 *  MRadio: 开关按钮
 *      参数：
 *          label 描述文字
 *          checked （默认）是否选中
 *          value 携带value值
 *          className 包裹类名
 *          onChange(value,e) 回调
 *
 *
 *  RGroup: 单选按钮组
 *      参数：
 *          options 匹配参数
 *              [
                     { label: 'Apple', value: 'Apple' },
                     { label: 'Pear', value: 'Pear' },
                     { label: 'Orange', value: 'Orange', disabled: true },
                 ];
 *          defaultValue 默认选中项
 *          onChange(e) 回调
 *          className 包裹类名
 *
 *  RButton ：button按钮形式
 *      参数：
 *      options 匹配参数
 *              [
                 { label: 'Apple', value: 'Apple' },
                 { label: 'Pear', value: 'Pear' },
                 { label: 'Orange', value: 'Orange', disabled: true },
             ];
 *          defaultValue 默认选中项
 *          onChange(e) 回调
 *          className 包裹类名
 *  注意：value的格式统一（options里面的value值 和 指定默认value值 是=== 绝对比较）
 */
import React,{Component} from 'react';
import {Radio}from "antd"
import { is } from 'immutable';
import "./index.less"
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;

class MRadio extends Component{
    constructor(props){
        super(props);
        this.state={
            checked:false
        };
    }
    componentWillMount(){
        this.setState({
            checked:this.props.checked
        });
    }
    onChange(e){
        let checked =this.state.checked;
        this.setState({
            checked:!checked
        });
        this.props.onChange&&this.props.onChange(this.props.value,e)
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
    render(){
        const {label,className,value} = this.props;
        return(
            <Radio className={"common_radio_self  "+className}
                   onClick={this.onChange.bind(this)}
                   checked={this.state.checked}
                   value={value}
            >
                {label}
            </Radio>
        )
    }
}
class RGroup extends Component{
    constructor(props){
        super(props);
        this.state={
            value:this.props.defaultValue
        };
    }
    onChange(e){
        this.setState({
            value:e.target.value
        });
        this.props.onChange&&this.props.onChange(e)
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
    render(){
        const {options,className} = this.props;
        return(
            <RadioGroup options={options}
                        onChange={this.onChange.bind(this)}
                        value={this.state.value}
                        className={"common_radio_group  "+className}
            />
        )
    }
}
class RButton extends Component{
    constructor(props){
        super(props);
        this.state={
            value:this.props.defaultValue
        };
    }
    onChange(e){
        this.setState({
            value:e.target.value
        });
        this.props.onChange&&this.props.onChange(e)
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
    render(){
        const {options,className} = this.props;
        return(
            <RadioGroup
                className={"common_button_group  "+className}
                onChange={this.onChange.bind(this)}
                value={this.state.value} >
                {
                    options && options.map((v, i) => {
                        return (
                            <RadioButton key={v.value} value={v.value} disabled={v.disabled}>{v.label}</RadioButton>
                        )
                    })
                }
            </RadioGroup>
        )
    }
}

export {MRadio,RGroup,RButton}