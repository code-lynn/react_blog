/**
 * Created by issuser on 2017/10/17.
 */
import React from "react";
import {getCookie,showTimeLength,formatDate,dateFormat} from '../../../methods';
import {MRadio,RGroup,RButton} from '../../../components/MyRadio';
import {getAjax,postAjax} from '../../../fetch/index';
import { is } from 'immutable';
import {Select, Form, Input, Radio,Button,message,Icon} from 'antd';
const Option = Select.Option;
// import './index.less';
export default class RadioSelect extends React.Component{
    constructor(props){
        super(props);
        this.state={
            options:{
                userType:[],//用户-radio数组
                businessType:[],//业务线
                requirePurposeType:[
                    { label: '模型开发', value:"modal" },
                    { label: '数据挖掘/分析', value:"data" },
                    { label: '其他', value:"other" },
                ],//需求目的
                listArr:[],//人群清单数组
            },
            params:{
                scene:"4",//场景
                userValue: "1",//用户-选中
                businessValue: "-1",//业务线
                filterValue: "1",//人群过滤
                listValue:"",//人群清单-默认选中
                listArr:[],//人群清单数组
            },
            jumpData:{},
        };
        this.radioOptions = {};
        this.queryFlag = false
    }
    componentWillMount(){
        let _this = this;
        let {params} = this.state;
        this.businessTypeFetch();
        if(this.props.queryId){//点击编辑进来
            // console.log(this.props.queryId);
            this.queryFlag = true;
            this.getFeatureExtractFetch(this.props.queryId,function (jumpData) {
                _this.tagIdMessageFetch(function (params) {
                    _this.props.otherDataChange("jumpData",{
                        params:params,
                        jumpData:jumpData
                    });
                });
            })
        }else {
            this.tagIdMessageFetch();
            this.props.otherDataChange("table",params);
        }
    }
    /*business_type*/
    businessTypeFetch(){
        let _this = this;
        let {options} = this.state;
        let query_white = `data/business_type.beta.json`;
        getAjax("/oceanus/static/"+query_white)
            .then(res => res.json()).then(data => {
            // console.log(data);
            if (data) {
                let common_user = [];
                let common_business = [];
                let bubble_business = [];
                let other_business = [];

                /*常规-用户*/
                if(data.common.userType&&data.common.userType.length>=1){
                    data.common.userType.forEach((v,i)=>{
                        let reg = /(0)|(8)|(9)|(10)|(11)|(12)/g;//禁用项
                        if(reg.test(v.value)){
                            // common_user.push( { label: v.name, value: v.value ,disabled: true});
                        }else if(v.value == 2){
                            common_user.push( { label: "专快司机", value: v.value });
                        }else {
                            common_user.push( { label: v.name, value: v.value });
                        }
                    })
                };
                // console.log(common_user);
                /*常规-业务*/
                if(data.common.businessType&&data.common.businessType.length>=1){
                    data.common.businessType.forEach((v,i)=>{
                        let reg = /(6)|(7)|(8)|(9)/g;//启用项
                        if(reg.test(v.value)){
                            common_business.push( { label: v.name, value: v.value,disabled: true });
                        }else {
                            common_business.push( { label: v.name, value: v.value});
                        }
                    })
                }
                /*冒泡-业务*/
                if(data.bubble.businessType&&data.bubble.businessType.length>=1){
                    data.bubble.businessType.forEach((v,i)=>{
                        let reg = /(1)/g;//启用项
                        if(reg.test(v.value)){
                            bubble_business.push( { label: v.name, value: v.value });
                        }else {
                            bubble_business.push( { label: v.name, value: v.value ,disabled: true});
                        }
                    })
                }
                /*分单-业务*/
                if(data.other.businessType&&data.other.businessType.length>=1){
                    data.other.businessType.forEach((v,i)=>{
                        let reg = /(1)|(2)|(4)/g;//启用项
                        if(reg.test(v.value)){
                            other_business.push( { label: v.name, value: v.value });
                        }else {
                            other_business.push( { label: v.name, value: v.value,disabled: true });
                        }
                    })
                }
                // console.log(common_user);
                this.radioOptions.common_user = common_user;
                this.radioOptions.common_business = common_business;
                this.radioOptions.bubble_business = bubble_business;
                this.radioOptions.other_business = other_business;
                /*初始值*/
                options.userType = common_user;
                options.businessType = common_business;
                // params.userValue = "1";
                // params.businessValue = -1;
                this.setState({
                    options,
                    // params,
                })
            }else {
                message.warning("business_type 数据不存在！");
            }
        });
    }
    /*queryId 跳转过来*/
    getFeatureExtractFetch(id,callback){
        let _this = this;
        let {params,options,jumpData} = this.state;

        let query_white = `getFeatureExtractInfoById?id=${id}`;
        getAjax("/oceanus/feature_extract_list/"+query_white)
            .then(res => res.json()).then(data => {
            if (data.status == 'success') {
                let jumpData = data.value;
                params.scene = jumpData.task_scene+"";
                params.userValue = jumpData.user_type+"";
                params.businessValue = jumpData.business_type+"";
                if(jumpData.tag_id+""){
                    params.filterValue = "2";
                }
                switch (params.scene){
                    case "4":
                        options.userType = this.radioOptions.common_user;
                        options.businessType = this.radioOptions.common_business;
                        break;
                    case "1":
                        options.businessType = this.radioOptions.bubble_business;
                        break;
                    case "2":
                        options.businessType = this.radioOptions.other_business;
                        break;
                }
                _this.setState({
                    params,
                    options,
                    jumpData,
                },function () {
                    callback&&callback(jumpData);
                })
            }else {
                message.warning("数据请求失败！");
            }
        });
    }
    /*清单人群*/
    tagIdMessageFetch(callback){
        let {params,options,jumpData} = this.state;
        /**
         * 用户的value 与 人群的枚举
         * Key: 1乘客，2专快司机，3出租车司机，4代驾司机，5sofa司机，7uber乘客
         * value: 0表示乘客，1表示专快司机，2表示出租车司机，3表示代驾司机，4表示uber乘客，5：sofa司机
         * 其他的用户没有人群过滤
         * */
        let keyValue = {
            "1":"0",
            "2":"1",
            "3":"2",
            "4":"3",
            "5":"5",
            "7":"4",
        };
        let postId = keyValue[params.userValue]?keyValue[params.userValue]:"0";
        let query_tag = `getTagIdMessage?user_type=${postId}`;
        getAjax("/oceanus/feature_extract_statistics/"+query_tag).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
                let dataArr = [];
                if(data.value&&data.value.length>=1){
                    data.value.map((v,i)=>{
                        dataArr.push({"text":v,"value":v})
                    });
                }
                // console.log(this.queryFlag);
                if(this.queryFlag){
                    let tag_id = jumpData.tag_id;
                    data.value&&data.value.length>=1&&data.value.forEach((v,i)=>{
                        let id = v.split(",")[0].split(":")[1].replace(/(^\s*)|(\s*$)/g,"");
                        if(tag_id == id){
                            // console.log(tag_id);
                            // console.log(id);
                            params.listValue = v;
                        }
                    });
                }else {
                    params.listValue = data.value&&data.value.length>=1&&data.value[0];
                }

                options.listArr = dataArr;
                params.listArr = dataArr;
                this.setState({
                    params,
                    options,
                },function () {
                    callback&&callback(params);
                })
            }else {
                message.warning("人群清单 请求数据失败！")
            }
        });
    }
    /*场景*/
    sceneChange(value){
        // console.log(value);
        let {params,options} = this.state;
        switch (value){
            case "4":
                options.userType = this.radioOptions.common_user;
                options.businessType = this.radioOptions.common_business;
                params.userValue = "1";
                params.businessValue = "-1";
                params.scene = value;
                this.setState({
                    params:params,
                    options:options,
                },function () {
                    this.tagIdMessageFetch();
                    this.props.otherDataChange("table",params);
                });
                break;
            case "1":
                options.businessType = this.radioOptions.bubble_business;
                params.businessValue = "1";
                params.userValue = "-1";
                params.scene = value;
                this.setState({
                    params:params,
                    options:options,
                },function () {
                    // this.tagIdMessageFetch();
                    this.props.otherDataChange("table",params);
                });
                break;
            case "2":
                options.businessType = this.radioOptions.other_business;
                params.businessValue = "1";
                params.userValue = "-1";
                params.scene = value;
                this.setState({
                    params:params,
                    options:options,
                },function () {
                    // this.tagIdMessageFetch();
                    this.props.otherDataChange("table",params);
                });
                break;
        }

    }
    /*用户*/
    userChange(e){
        let this_ = this;
        // console.log(e.target.value);
        let {params,} = this.state;
        params = JSON.parse(JSON.stringify(params));
        params.userValue= e.target.value;
        this.queryFlag = false;
        /*
         * 选取用户后 对应 相应的业务 value
         * */
        switch(e.target.value){
            case "1":
                params.businessValue= "-1";
                break;
            case "2":
                params.businessValue= "1";
                break;
            case "3":
                params.businessValue= "2";
                break;
            case "4":
                params.businessValue= "3";
                break;
            case "5":
                params.businessValue= "4";
                break;
            case "6":
                params.businessValue= "5";
                break;
            case "7":
                params.businessValue= "10";
                break;
            case "13":
                params.businessValue= "0";
                break;
            default:
                params.businessValue= -1;
                break;
        }
        //限制时间
        if(params.scene == "4"){
            this.props.otherDataChange("limitTime",params.userValue);
        }else {
            this.props.otherDataChange("limitTime",null);
        }

        this.setState({
            params,
        },function () {
            if(params.userValue != 6 && params.userValue != 13){
                this_.tagIdMessageFetch(function (params) {
                    this_.props.otherDataChange("table",params);
                });
            }
        });
    }
    /*业务线*/
    businessChange(e){
        // console.log( e.target.value);
        let {params} = this.state;
        params.businessValue= e.target.value;
        this.setState({
            params,
        },function () {
            this.props.otherDataChange("table",params);
        });
    }
    /*人群过滤*/
    filterChange(e){
        // console.log( e.target.value);
        let {params} = this.state;
        params.filterValue= e.target.value;
        this.setState({
            params,
        },function () {
            this.props.otherDataChange("params",params);
        });
    }
    /*人群清单*/
    listChange(value){
        // console.log(value);
        let {params} = this.state;
        params.listValue = value;
        this.setState({
            params,
        },function () {
            this.props.otherDataChange("params",params);
        })
    }

    componentDidMount(){
        let {params,options} = this.state;
       /* if(this.props.queryId){
            let tag_id = params.tag_id;
            options.listArr&&options.listArr.length>=1&&options.listArr.forEach((v,i)=>{
                let id = v.split(",")[0].split(":")[1].replace(/\s/g,"");
                if(tag_id == id){
                    params.listValue = v;
                }
            });
            this.setState({
                params,
            })
        }*/
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
        const {params,options,} = this.state;
        const userOptions=[
            { label: '乘客', value: 1 },
            { label: '专快司机', value: 2},
            { label: '出租车司机', value: 3 },
            { label: '代驾司机', value: 4 },
            { label: 'sofa司机', value: 5 },
            { label: '顺风车司机', value: 6 },
            { label: 'uber乘客', value: 7 },
            { label: '乘客关系', value: 13 },
        ];
        const businessOptions=[
            { label: '所有', value: 1 },
            { label: '专快', value: 2},
            { label: '出租车', value: 3 },
            { label: '代驾', value: 4 },
            { label: 'sofa', value: 5 },
            { label: '顺风车', value: 6 },
            { label: '优步', value: 7 },
            { label: '乘客关系', value: 13 },
        ];
        let fun_businessOptions=(params)=>{
            switch (params.scene){
                case "4":
                    let arr = options.businessType.filter((v,i)=>{
                        return v.value == params.businessValue
                    });
                    return arr;
                case "1":
                    return options.businessType;
                case "2":
                    return options.businessType;

            }
        };
        const filterOptions=[
            { label: '不过滤', value: "1" },
            { label: '指定人群', value: "2" },
        ];
        const filterFlag = params.scene == 4 && (params.userValue != 6 && params.userValue != 13);
        const listFlag = params.filterValue ==1||(params.filterValue ==2 && options.listArr && options.listArr.length>=1);
        // console.log(params);
        // console.log(filterFlag);
        // params.listValue = params.listValue?params.listValue:"";
        return(
            <div>
                <div className="statistics_box" ref={"statistics_boxsc"}>
                    <span className="statistics_box_title">场景：</span>
                    <Select value={params.scene}
                            style={{ width: 160 }}
                            className="statistics_box_select"
                            getPopupContainer={()=>this.refs.statistics_boxsc}
                            onChange={this.sceneChange.bind(this)}
                    >
                        <Option value="4">常规</Option>
                        <Option value="1">冒泡</Option>
                        <Option value="2">分单</Option>
                    </Select>
                </div>
                <div className={params.scene == 4?"statistics_box":"statistics_box display"}>
                    <span className="statistics_box_title">用户：</span>
                    <RGroup
                        key={params.userValue}
                        options={options.userType}
                        className ="selected_feature_radio"
                        defaultValue={params.userValue}
                        onChange={this.userChange.bind(this)}
                    />
                </div>
                <div className={params.scene==4&&params.userValue ==5? "statistics_box display":"statistics_box"}>
                    <span className="statistics_box_title">业务线：</span>
                    <RGroup
                        key={params.businessValue}
                        className ="selected_feature_radio"
                        options={fun_businessOptions(params)}
                        defaultValue={params.businessValue}
                        onChange={this.businessChange.bind(this)}
                    />
                </div>
                <div className={filterFlag?"statistics_box":"statistics_box display"}>
                    <span className="statistics_box_title">人群过滤：</span>
                    <RGroup
                        key={params.filterValue}
                        options={filterOptions}
                        defaultValue={params.filterValue}
                        onChange={this.filterChange.bind(this)}
                    />
                    <span className={listFlag?"statistics_box_test display":"statistics_box_test"}>
                        通过&nbsp;
                        <a href="http://bigdata.xiaojukeji.com/bigdata-tagsystem/bigdata-tag/add.html">标签系统</a>
                        &nbsp;创建的清单人群过滤
                    </span>
                </div>
                <div className={filterFlag && params.filterValue ==2? "statistics_box":"statistics_box display"} ref={"statistics_boxpl"}>
                    <span className="statistics_box_title">人群清单：</span>
                    <Select value={params.listValue?params.listValue:""}
                            //key={params.listValue+""+params.userValue+""+JSON.stringify(options.listArr)}
                            style={{ width: 260 }}
                            className="statistics_box_select"
                            getPopupContainer={()=>this.refs.statistics_boxpl}
                            onChange={this.listChange.bind(this)}
                    >
                        {
                            options.listArr&&options.listArr.length>=1&&options.listArr.map((v,i)=>{
                                return (
                                    <Option key={v.value} value={v.value}>{v.text}</Option>
                                )
                            })
                        }
                    </Select>
                    <span className={listFlag?"statistics_box_test display":"statistics_box_test"}>
                        您未创建人群，请通过&nbsp;
                        <a href="http://bigdata.xiaojukeji.com/bigdata-tagsystem/bigdata-tag/add.html">标签系统</a>
                        &nbsp;创建人群列表
                    </span>
                </div>
            </div>
        )
    }
}