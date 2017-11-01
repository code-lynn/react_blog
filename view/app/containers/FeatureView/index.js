import React, {Component} from 'react';
import {getAjax} from '../../fetch';
import {setCookie} from '../../methods';
import moment from 'moment';
import echarts from 'echarts';
import { is } from 'immutable';
import {Modal, Button, Row, Col,message,Spin} from 'antd';
import './index.less';

export default class FeatureView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            dataSource: [],
            modalData: [],//modal数据
            treePathInfo: [],//modal标题
            activeLoading: true,
            searchFlag:true,
        }
    }

    componentWillMount() {
        let myHeaders = new Headers();
        let myInit = {
            method: 'GET',
            headers: myHeaders,
            mode: 'no-cors',
            cache: 'default'
        };
        getAjax('/oceanus/feature_view/getMenuFeature?business_type=-1').then(res => res.json()).then(data => {
            if (data.status == 'success') {
                this.setState({
                    dataSource: data.value,
                    activeLoading: false,
                }, function () {
                    this.echartsLoad(this.dataChildren)
                })
            }
        });
    }
    /*数据children*/
    dataChildren(data) {
        let dataArr = [];
        data & data.map((v, i) => {
            dataArr.push({
                name: v.cn_second_class_name,
                value: Number(v.category) ? Number(v.category) : 0,
                id: v.category_id,
                label: {
                    normal:{
                        color: '#666',
                        fontSize: 15,
                        borderRadius: 15,
                        /*b: {
                            color: 'red',
                            width:"110%",
                            height:"110%",
                            borderRadius: 16
                        },*/
                    },

                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: "{b}",
                            ellipsis: true,
                            // formatter: "{b}: {c}",
                            textStyle: {
                                color: '#666',
                                // fontFamily: 'Times New Roman",Georgia,Serif',
                                fontSize: 15,
                                // fontStyle: 'italic',
                                fontWeight: 'bolder'
                            }
                        },
                        borderRadius: [10,10,10,10],
                        borderWidth:2,
                        borderColor:"#eeeeee",
                    },
                    emphasis: {
                        label: {
                            show: true,
                            formatter: "{b}",
                            textStyle: {
                                // color: '#fa8919',
                                fontFamily: 'Times New Roman",Georgia,Serif',
                                fontSize: 15,
                                fontStyle: 'normal',
                                fontWeight: 'bold'
                            }
                        },
                        // borderWidth: 2,
                        // borderColor: '#fa8919',

                    }
                },
            })
        });
        return dataArr;
    }
    /*echarts option数据*/
    echartsLoad(callback) {
        const _this = this;
        let {dataSource} = this.state;
        let option = {
            tooltip: {
                trigger: 'item',
                formatter: "{b}"
            },
            /*toolbox: {
             show : true,
             feature : {
             mark : {show: true},
             dataView : {show: true, readOnly: false},
             restore : {show: true},
             saveAsImage : {show: true}
             }
             },*/
            /*legend: {///？？？？
             show:true,
             data:["矩形图"]
             },*/
            grid: {//组件距离容器距离
                width: "100%",
                height: "100%",
                top: 0,
                bottom: 0,
                right: 0,
                left: 0,
                borderRadius: 10
            },
            // hoverable: true,
            series: [
                {
                    name: '特征仓库',
                    type: 'treemap',
                    top: 20,
                    bottom: 20,
                    right: 20,
                    left: 20,
                    breadcrumb:{
                        show:false
                    },
                    roam: "false",
                    nodeClick: false,
                    tooltip: {
                        trigger: 'item',
                        formatter: "{b}"
                    },
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                formatter: "{b}",
                                textStyle: {
                                    color: '#666',
                                    fontSize: 22,
                                    // fontWeight: 'bolder'
                                }
                            },
                            gapWidth: 10,
                            // borderRadius: 10,
                            background: "#eeeeee",
                            borderWidth:5,
                            opacity:0.2,
                        },
                        emphasis: {
                            /*label: {
                                show: true,
                                formatter: "{b}",
                                textStyle: {
                                    // color: '#fa8919',
                                    fontFamily: 'Times New Roman",Georgia,Serif',
                                    fontSize: 18,
                                    fontStyle: 'normal',
                                    fontWeight: 'bold'
                                }
                            },*/
                            gapWidth: 10,
                        }
                    },
                    data: function () {
                        let data = [];
                        dataSource && dataSource.map((v, i) => {
                            data.push({
                                name: v.cn_first_class_name,
                                value: v.second.length,
                                upperLabel: {
                                    normal: {
                                        show: true,
                                        fontSize: 17,
                                        height: 30,
                                        color: '#666',
                                        position: ['50%', '50%']
                                    },
                                    emphasis: {
                                        show: true,
                                        fontSize: 17,
                                        height: 30,
                                        color: '#666',
                                        position: ['50%', '50%']
                                    },
                                },
                                itemStyle: {
                                    normal: {
                                        color: function () {
                                            switch (v.en_first_class_name) {
                                                case "driver":
                                                    return  "#ffc6f5";
                                                case "passenger":
                                                    return '#99ccff';
                                                case "order":
                                                    return '#9999cc';
                                                case "bubble":
                                                    return '#ccffcc';
                                                case "weather":
                                                    return '#c9ca7f';
                                            }
                                        }(),
                                        label: {
                                            show: true,
                                            formatter: "{b}",
                                        },
                                        gapWidth: 5,
                                        padding: 10,
                                        borderWidth: 5,
                                        borderColor: '#eeeeee',
                                        borderRadius: 10,
                                    },
                                    emphasis: {
                                        label: {
                                            show: true,
                                            formatter: "{b}",
                                        },
                                        gapWidth: 5,
                                        padding: 10,
                                        borderWidth: 2,
                                        borderColor: '#eeeeee',
                                        background: "#eeeeee",
                                        borderRadius: 10,
                                    }
                                },
                                color: function () {
                                    /*
                                    switch (v.en_first_class_name)
                                     */
                                    return ['rgb(111, 168, 209)','rgb(151, 198, 226)', 'rgb(187, 218, 234)', 'rgb(215, 230, 244)', 'rgb(238, 136, 86)',
                                        'rgb(254, 175, 119)', 'rgb(254, 198, 151)','rgb(254, 222, 190)', 'rgb(111, 191, 135)', 'rgb(158, 214, 159)',
                                        "rgb(189, 228, 185)","rgb(216, 240, 211)", "rgb(158, 151, 200)","rgb(187, 184, 217)","rgb(208, 209, 231)",
                                        "rgb(229, 229, 241)","rgb(146, 146, 146)","rgb(182, 182, 182)","rgb(209, 209, 209)","rgb(228, 228, 228)",];
                                }(),
                                // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
                                children: callback && callback(v.second)
                            });
                        });
                        return data
                    }()
                },
            ]
        };
        let echarts_box = echarts.init(document.getElementById('featureView_echarts_box'));
        echarts_box.setOption(option);
        echarts_box.on('click', function (params) {
            // 控制台打印数据的名称
            // console.log(params);
            if (params.treePathInfo.length <= 2) {//点击小方块外层-不产生逻辑
                return
            }
            /*加载gif*/
            _this.setState({
                activeLoading:true,
            });
            let query = `/oceanus/feature_view/getFeatureDataByCategoryId?category=${params.data.value}`;
            getAjax(query).then(res => res.json()).then(data => {
                if (data.status == 'success') {
                    _this.setState({
                        modalData: data.value,
                        treePathInfo: params.treePathInfo,
                        activeLoading:false,
                    }, function () {
                        /*loading动画 关闭*/
                        // $(".active-loading").stop().fadeOut(1500);
                        this.refs.LocalizedModal.showModal();
                    })
                }
            });
        });
    }

    componentDidMount() {
        /**/

    }
    /*搜索*/
    searchInput(){
        let _this = this;
        let value = this.refs.input_content.value;
        let searchFlag = this.state;
        if(!searchFlag || !value){
            return
        }
        // 按钮失效，以实现防止重复点击
        this.setState({
            searchFlag:false,//防止快速重复点击
            activeLoading:true,//加载动画
        });
        let query = `/oceanus/feature_view/searchFeature?search=${value}`;
        getAjax(query).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success' && data.value && data.value.length>0) {
                let arr = data.value;
                arr.map((v,i)=>{

                });

                _this.setState({
                    modalData: data.value,
                    treePathInfo: `包含"${value}"的特征`,
                    activeLoading:false,
                }, function () {
                    /*1s 后恢复搜索按钮功能*/
                    setTimeout(function () {
                        _this.setState({
                            searchFlag:true,
                        });
                    }, 1000);
                    _this.refs.LocalizedModal.showModal();
                })
            }else {
                _this.setState({
                    activeLoading:false,
                }, function () {
                    /*1s 后恢复搜索按钮功能*/
                    setTimeout(function () {
                        _this.setState({
                            searchFlag:true,
                        });
                    }, 1500);
                });
                message.warning("您查询的特征不存在！")
            }
        });
    }
    /*回车搜索*/
    inputKeyDown(e){
        if (e.keyCode == 13){
            this.searchInput()
        }
    }

    render() {
        let {modalData, treePathInfo,activeLoading} = this.state;
        return (
            <div className="feature_view clearfix">
                <div className="featureView_input_box">
                    <input type="text" id="featureView_input_search" ref={"input_content"} className="featureView_input_search" onKeyDown={this.inputKeyDown.bind(this)}/>
                    <span ref={"search_tag_input"} onClick={this.searchInput.bind(this)} className="featureView_search_span">搜索</span>
                </div>
               {/* <div className="echarts_driver_box">
                    <span className="echarts_driver_driver">
                        <i className="echarts_driver" title="司机"></i><em className="echarts_driver" title="司机">司机</em>
                    </span>
                    <span className="echarts_driver_passenger">
                        <i className="driver_passenger" title="乘客"></i><em className="driver_passenger"
                                                                           title="乘客">乘客</em>
                    </span>
                    <span className="echarts_driver_order">
                        <i className="driver_order" title="订单"></i><em className="driver_order" title="订单">订单</em>
                    </span>
                    <span className="echarts_driver_bubble">
                        <i className="driver_bubble" title="冒泡"></i><em className="driver_bubble" title="冒泡">冒泡</em>
                    </span>
                    <span className="echarts_driver_weather">
                        <i className="driver_weather" title="天气"></i><em className="driver_weather" title="天气">天气</em>
                    </span>
                </div>*/}
                <div ref={"active-loading"} className={activeLoading?"active-loading":"active-loading change-driver-display"}>
                    <div className="loading-img-box">
                        <Spin tip="Loading..."  size="large"/>
                    </div>
                </div>
                <div id="featureView_echarts_box" className="featureView_echarts_box clearfix">
                    <LocalizedModal
                        ref={"LocalizedModal"}
                        modalData={JSON.parse(JSON.stringify(modalData))}
                        treePathInfo={treePathInfo}
                    />
                </div>

            </div>
        )
    }
}
/*Modal*/
class LocalizedModal extends React.Component {
    state = {
        visible: false,
        itemData: null,
        dependencyFlag: false,
    };
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };

    componentWillReceiveProps(props) {
        if (props) {
            this.setState({
                itemData: props.modalData[0],
            })
        }
    }
    /*名称、值类型等基本信息*/
    itemLoad() {
        let data = this.state.itemData;
        if (!data) {
            return
        }
        return (
            <div>
                {
                    data.name ? (
                        <div className="right_p_box">
                            <p><i></i>特征英文名称:</p>
                            <p className="p_padding">{data.name}</p>
                        </div>
                    ) : ""
                }
                {
                    data.logical_name ? (
                        <div className="right_p_box">
                            <p><i></i>特征中文名称:</p>
                            <p className="p_padding">{data.logical_name}</p>
                        </div>
                    ) : ""
                }
                {
                    data.explanation ? (
                        <div className="right_p_box">
                            <p><i></i>特征值解释:</p>
                            <p className="p_padding">{data.explanation}</p>
                        </div>
                    ) : ""
                }
                {
                    data.data_type ? (
                        <div className="right_p_box">
                            <p><i></i>值类型:</p>
                            <p className="p_padding">{data.data_type}</p>
                        </div>
                    ) : ""
                }
                {
                    data.comment ? (
                        <div className="right_p_box">
                            <p><i></i>注释:</p>
                            <p className="p_padding">{data.comment}</p>
                        </div>
                    ) : ""
                }
                {
                    data.cal_logic ? (
                        <div className="right_p_box">
                            <p><i></i>计算逻辑:</p>
                            <p className="p_padding">{data.cal_logic}</p>
                        </div>
                    ) : ""
                }
                {
                    data.update_frequency ? (
                        <div className="right_p_box">
                            <p><i></i>更新频次:</p>
                            <p className="p_padding">{data.update_frequency}</p>
                        </div>
                    ) : ""
                }
                {
                    data.storage_period ? (
                        <div className="right_p_box">
                            <p><i></i>存储时间:</p>
                            <p className="p_padding">{data.storage_period}</p>
                        </div>
                    ) : ""
                }
                {
                    data.source ? (
                        <div className="right_p_box">
                            <p><i></i>来源:</p>
                            <p className="p_padding">{data.source}</p>
                        </div>
                    ) : ""
                }
                {
                    data.maintainer ? (
                        <div className="right_p_box">
                            <p><i></i>维护方:</p>
                            <p className="p_padding">{data.maintainer}</p>
                        </div>
                    ) : ""
                }
                {
                    data.version ? (
                        <div className="right_p_box">
                            <p><i></i>版本:</p>
                            <p className="p_padding">{data.version}</p>
                        </div>
                    ) : ""
                }
                {
                    data.flow_channel ? (
                        <div className="right_p_box">
                            <p><i></i>流量通道:</p>
                            <p className="p_padding">{data.flow_channel}</p>
                        </div>
                    ) : ""
                }

            </div>
        )
    }
    //服务或接口 点击
    dependencyDom(){
        let {dependencyFlag} = this.state;
        this.setState({
            dependencyFlag:!dependencyFlag,
        })
    }
    //服务或接口
    serviceInterface() {
        let {itemData,dependencyFlag} = this.state;
        if (!itemData) {
            return
        }
        if(itemData.dependency_service_info_interface_name){
            let arr = itemData.dependency_service_info_interface_name.split(",");
            let img_id = itemData.name;
            let span_id = "span_" + itemData.name;
            /*服务或接口显示隐藏*/
            let dependencyInfo = ()=>{
                let arrDom = JSON.parse(JSON.stringify(arr));
                arrDom.shift();// 删除第一个元素
                return arrDom.map((v,i)=>{
                    return (
                        <p key={i}>{v}</p>
                    )
                })
            };
            if(arr.length<=1){
                return(
                        <div className="right_p_box">
                            <p><i></i>服务或接口名字（依赖服务信息）:</p>
                            <p className="p_padding">{arr.toString()}</p>
                        </div>
                    )
            }else {
                return dependencyFlag?(
                    <div className="right_p_box">
                        <p><i></i>服务或接口名字（依赖服务信息）:</p>
                        <p className="p_padding">
                            {arr[0]}
                            <img onClick={this.dependencyDom.bind(this)} className="right_text_justify"
                                 id={img_id} src ="/oceanus/static/images/ic_more_horiz_black_18dp_1x.png"/>
                            <br/>
                        </p>
                        {/*服务或接口 加载*/}
                        {dependencyInfo()}
                    </div>
                    ):(
                    <div className="right_p_box">
                        <p><i></i>服务或接口名字（依赖服务信息）:</p>
                        <p className="p_padding">
                            {arr[0]}
                            <img onClick={this.dependencyDom.bind(this)} className="right_text_justify"
                                 id={img_id} src ="/oceanus/static/images/ic_more_horiz_black_18dp_1x.png"/>
                        </p>
                    </div>
                )

            }
        }
    }
    //访问方式
    accessMode(){
        let {itemData,dependencyFlag} = this.state;
        if (!itemData) {
            return
        }
        return (
            <div>
                {
                    itemData.dependency_service_info_offline_access_mode ? (
                        <div className="right_p_box">
                            <p><i></i>线下访问方式（依赖服务信息）:</p>
                            <p className="p_padding">{itemData.dependency_service_info_offline_access_mode}</p>
                        </div>
                    ) : ""
                }
                {
                    itemData.online_access_info_access_mode ? (
                        <div className="right_p_box">
                            <p><i></i>访问方式（线上访问信息）:</p>
                            <p className="p_padding">{itemData.online_access_info_access_mode}</p>
                        </div>
                    ) : ""
                }
                {
                    itemData.online_access_info_interface_name ? (
                        <div className="right_p_box">
                            <p><i></i>服务或接口名字（线上访问信息）:</p>
                            <p className="p_padding">{itemData.online_access_info_interface_name}</p>
                        </div>
                    ) : ""
                }
                {
                    itemData.dependency_service_info_online_access_mode ? (
                        <div className="right_p_box">
                            <p><i></i>线上访问方式（依赖服务信息）:</p>
                            <p className="p_padding">{itemData.dependency_service_info_online_access_mode}</p>
                        </div>
                    ) : ""
                }
            </div>
        );
    }
    //统计信息
    statistics(){
        let {itemData,dependencyFlag} = this.state;
        if (!itemData) {
            return
        }
        let percentile = ()=>{
            let percent = histogramData.stats&&histogramData.stats.percent;
            percent = [1,2,3];
            return(
                <div ref={"statisticsDom"} id="statistics" className="echarts100">
                    {
                        percent&&percent.map((v,i)=>{
                            return(
                                <div className="percentile_echarts_circle">
                                    <div className="percentile_echarts_circleup"></div>
                                    <p className="percentile_echarts_circledown"></p>
                                </div>
                            )
                        })
                    }
                </div>
            )
        };
        if(itemData.stats){
            let histogramData = eval("("+itemData.stats+")");
            // console.log(histogramData);
            if(histogramData.stats){
                return(
                    <div>
                        <p className="histogram_gray"><i></i>统计信息:</p>
                        {
                            histogramData.stats.min || histogramData.stats.min == 0 ?(<p><span className="orange">Min:</span>{histogramData.stats.min}</p>):""
                        }
                        {
                            histogramData.stats.max || histogramData.stats.max == 0 ?(<p><span className="orange">Max:</span>{histogramData.stats.max}</p>):""
                        }
                        {
                            histogramData.stats.mean || histogramData.stats.mean == 0 ?(<p><span className="orange">Mean:</span>{histogramData.stats.mean}</p>):""
                        }
                        {
                            histogramData.stats.std || histogramData.stats.std == 0 ?(<p><span className="orange">Std:</span>{histogramData.stats.std}</p>):""
                        }
                        {
                            histogramData.stats.percent ?(<p><span className="orange">Percentile:</span></p>):""
                        }
                        {
                            histogramData.stats.percent ?(<div ref={"statisticsDom"} id="statistics" className="statistics"></div>):""
                        }
                        {
                            histogramData.stats ?(<p className="histogram_gray"><i></i>直方图数据:</p>):""
                        }
                        {
                            histogramData.stats ?(<div ref={"histogramDom"} className="echarts100"></div>):""
                        }
                    </div>
                );
            }

        }
    }
    /*左侧点击*/
    modalLeftClick(data, i, e) {
        let {modalData} = this.props;
        let reg = /select/g;
        if (reg.test(e.target.className)) {
            return;
        } else {
            /*先令所有p 删除select类名*/
            modalData && modalData.map((m, n) => {
                let refName = "leftp" + n;
                if (i == n) {
                    this.refs[refName].className = "select";
                    // e.target.className = "select";
                } else {
                    this.refs[refName].className = "";
                }
            });
        }
        this.setState({
            itemData: data
        });
    }
    componentDidMount(){
        // console.log(456465);
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
    componentDidUpdate(prevProps,prevState){
        let _this = this;
        let {itemData,dependencyFlag} = this.state;
        let histogramData = itemData&&itemData.stats;
        if(histogramData){
            histogramData = JSON.parse(histogramData);
        }else {
            histogramData={};
        }
        let statisticsDom;
        let histogramDom;
        /**
         * 防止 首次获取dom 拿不到*/
        setTimeout(function () {
            statisticsDom = _this.refs["statisticsDom"];//DOM
            histogramDom = _this.refs["histogramDom"];//DOM
            // console.log(statisticsDom);
            echartsLoad();
        },30);
        /**
         * 拿到dom innerHTML
         * 遍历数组 返回dom数组
         * ${dom_arr.join("")}
         * */
        let echartsLoad = ()=>{
            if(statisticsDom){
                let data = histogramData&&histogramData.stats&&histogramData.stats.percent;
                let xAxisData = [];
                let yAxisData = [];
                for (let i = 0; i < data.length; i++) {
                    for (let key in data[i]) {
                        yAxisData.push(key.slice(1,key.length));
                        xAxisData.push(data[i][key]);
                    }
                }
                let xAxis_fun = ()=>{
                    return xAxisData.map((v,i)=>{
                        return `<div class="statistics_axis">
                                    <div class="statistics_up">
                                        ${yAxisData[i]}
                                    </div>
                                    <div class="statistics_down">
                                        ${v}
                                    </div>
                                </div>`
                    })
                };
                let axis_dom = xAxis_fun();
                // console.log(axis_dom);
                statisticsDom.innerHTML=axis_dom.join("");
            }
            //直方图数据
            if(histogramDom){
                let data = histogramData.hist?histogramData.hist:[];
                let xAxisData = [];
                let yAxisData = [];
                data.map(function (item) {
                    if (item.from == "-inf") {
                        xAxisData.push("小于" + item.to);
                    } else if (item.to == "+inf") {
                        xAxisData.push("大于" + item.from);
                    } else if (item.from == item.to) {
                        xAxisData.push(item.from);
                    } else {
                        xAxisData.push(item.from + "~" + item.to)
                    }
                    yAxisData.push((Math.round(item.val * 1000)) / 10);
                });
                let option = {
                    tooltip: {
                        formatter:"{b}:{c}%",
                    },
                    xAxis: {
                        data: xAxisData
                    },
                    yAxis: {
                        show:false,
                    },
                    grid: {
                        top: 20,
                        bottom:20,
                        right:10,
                        left:10
                    },
                    series: [{
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#fa8919',
                                label : {
                                    show:true,
                                    position:'top',
                                    formatter:"{c}%",
                                }
                            }
                        },
                        data: yAxisData
                    }]
                };
                let echarts_p = echarts.init(histogramDom);
                echarts_p.setOption(option);
            }
        };
    }
    afterClose(e){
        // console.log(e);
        let {modalData} = this.props;
        /*先令所有p 删除select类名*/
        modalData && modalData.map((m, n) => {
            let refName = "leftp" + n;
            if (n == 0){
                this.refs[refName].className = "select";
            }else {
                this.refs[refName].className = "";
            }

        });
    }
    render() {
        let {modalData, treePathInfo} = this.props;
        let {itemData} = this.state;
        let title = "";
        if(typeof treePathInfo == "string"){
            title = treePathInfo
        }else {
            treePathInfo && treePathInfo.map((v, i) => {
                if (i == treePathInfo.length - 1) {
                    title += v.name;
                } else {
                    title += v.name + ">";
                }
            });
        }
        // console.log(modalData);
        // console.log(treePathInfo);
        return (
            <div>
                <Modal
                    title={title}
                    width="1000px"
                    visible={this.state.visible}
                    wrapClassName="featureView_modal"
                    onCancel={this.hideModal}
                    footer={false}
                    afterClose={this.afterClose.bind(this)}
                >
                    <div className="featureView_modal_box">
                        <div className="featureView_modal_left">
                            {
                                modalData && modalData.map((v, i) => {
                                    if (i == 0) {
                                        return (
                                            <p ref={"leftp" + i} className="select"
                                               onClick={this.modalLeftClick.bind(this, v, i)}
                                               title={v.logical_name}
                                               key={v.feature_id?v.feature_id:v.id}>{v.logical_name}</p>
                                        )
                                    } else {
                                        return (
                                            <p ref={"leftp" + i} className=""
                                               onClick={this.modalLeftClick.bind(this, v, i)}
                                               title={v.logical_name}
                                               key={v.feature_id?v.feature_id:v.id}>{v.logical_name}</p>
                                        )
                                    }
                                })
                            }
                        </div>
                        <div ref={"featureView_modal_right"} className="featureView_modal_right">
                            {this.itemLoad()}
                            {this.serviceInterface()}
                            {this.accessMode()}
                            {this.statistics()}
                        </div>

                    </div>
                </Modal>
            </div>
        );
    }
}