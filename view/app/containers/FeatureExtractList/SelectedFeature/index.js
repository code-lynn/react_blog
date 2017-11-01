/**
 * Created by issuser on 2017/9/28.
 */
import React,{Component} from 'react';
import {hashHistory} from 'react-router';
import MyTable from '../../../components/MyTable';
import {getCookie,dateFormat,showTimeLength,formatDate,findInArr} from '../../../methods';
import {getAjax,postAjax} from '../../../fetch/index';
import { Select,Tree,Input,message,Popover, Icon, Button} from 'antd';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
import './index.less';
import SelectFormGroup from'./selectedFormGroup';
import RadioSelect from'./RadioSelect';
const Option = Select.Option;

export default class SelectedFeature extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
            pagination: {
                current: 1, pageSize: 10, total: 0
            },
            loading: false,
            jumpData:{},
            params:{},
            glData:[],//左侧数据
            tbData:{},//table数据
            keyRowObj:{},//所有table数据的key：row
            aliasIdObj:{},//所有table数据的 alias_name:feature_id
            selectedRowKeys:[],//固定-选中的项
            fixedData:[],//固定table数据
            search:{
                searchValue:"",
                searchFlag:true,
                searchData:[],
            },
            stepFlag:true,
            requirePurposeFlag:false,
        };
        this.username = getCookie("username");
        this.treeOne = [];
        this.dataLimitTime = dateFormat(new Date()-24*60*60*1000);//根据用户类型的限制时间
        this.periodTime = (limit,num)=>{
            limit = limit?limit:dateFormat(new Date()-24*60*60*1000);
            let m = limit;
            let n = -Number(num)-1;
            return showTimeLength(m,n)
        };
        this.userRelateTime = {};//限制时间对应关系
        this.cityData = [];//城市列表
        this.queryId = this.props.params.id;
        this.queryFlag = true;
        this.timer = null;
        this.submitFlag = true;
    }
    componentWillMount(){
        this.getWhiteTableFetch();
        this.getLimitTime();
        this.getCityDataFetch();

        // console.log(this.props.params);
        // console.log(this.props.location);
    }
    /*限制时间*/
    getLimitTime(){
        let query_white = `getBusinessLineDate`;
        getAjax("/oceanus/feature_extract_list/"+query_white)
            .then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
                let userTags = data.value;
                this.userRelateTime  = {
                    "1":userTags.passenger,
                    "2":userTags.driver_gulfstream,
                    "3":userTags.driver_taxi,
                    "4":userTags.driver_dj,
                    "5":userTags.driver_sofa,
                    "6":userTags.driver_beatles,
                    "7":userTags.passenger_uber,
                    "13":dateFormat(new Date()-24*60*60*1000)
                };
                this.dataLimitTime = formatDate(this.userRelateTime[1]);
                /*this.setState({
                    dataLimitTime:this.dataLimitTime,
                })*/
            }else {
                message.warning("获取限制时间失败！");
            }
        });
    }
    /*权限 ？？？？*/
    getWhiteTableFetch(){
        let query_white = `getWhiteTable?username=${this.username}`;
        getAjax("/oceanus/feature_extract_list/"+query_white)
            .then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
                // $scope.person_group = res.right.person_group == 1?true:false;
                // $scope.schedule_task = res.right.schedule_task == 1?true:false;
            }else {
                message.warning("无权限，请联系统管理员！");
            }
        });
    }
    /*城市*/
    getCityDataFetch(){
        let query_city = `getCityData`;
        getAjax("/oceanus/create_exp/"+query_city)
            .then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
               this.cityData = data.value;
            }else {
                message.warning("获取城市信息失败！");
            }
        });
    }

    // 左侧树及表格-数据请求
    tableFetch(params,callback){
        let _this = this;
        let status = 0;
        let {jumpData,fixedData,selectedRowKeys} = this.state;
        this.setState({ loading: true });
        let query = `getFeatureData?business_type=${params.businessValue}&scenario=${params.scene}&status=${status}&user_type=${params.userValue}`;
        getAjax("/oceanus/manage_feature/"+query).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
                // 左侧数据
                /* {title: "0-0", key: "0-0", children: [
                 {title: "0-a", key: "0-a" },
                 {title: "0-b", key: "0-b"},
                 {title: "0-c", key: "0-c"},
                 ],},
                 {title: "0-1", key: "0-1", children: [
                 {title: "0-q", key: "0-q" },
                 {title: "0-w", key: "0-w"},
                 {title: "0-e", key: "0-e"},
                 ],},
                 {title: "0-2", key: "0-2"},*/
                let glData = [];//左侧数据
                let tbData = {};//表格数据
                let first = "";//首次默认选中
                data.value.map((v,i)=>{
                    let gl_item = {};
                    gl_item.title = v.cn_first_class_name;
                    gl_item.key = v.en_first_class_name;
                    this.treeOne.push(v.en_first_class_name);
                    if(v.second && v.second.length>=1){
                        let gl_children = [];
                        v.second.map((m,n)=>{
                            let gl_item_item = {};
                            gl_item_item.title = m.cn_second_class_name;
                            gl_item_item.key = v.en_first_class_name+"_"+m.category_id;
                            if(v.second.length == 1){
                                if(i == 0 && n == 0){
                                    first = v.en_first_class_name+"_"+m.category_id;
                                }
                            }else {
                                if(i == 0 && n == 1){
                                    first = v.en_first_class_name+"_"+m.category_id;
                                }                            }

                            gl_children.push(gl_item_item);
                            tbData[gl_item_item.key] = m.features;
                        });
                        gl_item.children = gl_children;
                    }
                    glData.push(gl_item);
                });
                //所有的表格的key(feature_id)：row
                let keyRowObj = {};
                for(let attr in tbData){
                    attr && tbData[attr].length>=1 && tbData[attr].map((v,i)=>{
                        keyRowObj[v.feature_id] = v;
                    })
                }
                //所有的表格的 alias_name:feature_id
                let aliasIdObj = {};
                for(let attr in tbData){
                    attr && tbData[attr].length>=1 && tbData[attr].map((v,i)=>{
                        aliasIdObj[v.alias_name] = v.feature_id;
                    })
                }
                // console.log(glData);
                // console.log(tbData);
                // console.log(keyRowObj);
                // console.log(first);
                if(this.queryId && this.queryFlag){//点击编辑进来
                    this.queryFlag = false;//用户再次操作->重新刷新数据
                    //左侧树
                    for(let attr in tbData){
                        let flag = false;
                        let cur = tbData[attr];
                         if(cur && cur.length>0){
                             for(let i=0;i<cur.length;i++){
                                 let vn = cur[i];
                                 // console.log(jumpData);
                                 let name = jumpData.feature_list.split(",")[0];
                                 // console.log(vn.alias_name);
                                 if(name == vn.alias_name){
                                     first = attr;
                                     flag=true;
                                     break;
                                 }
                             }
                         }
                         if(flag){//跳出循环
                             break;
                         }
                    }
                    //已选择特征表格
                    selectedRowKeys = jumpData.feature_list.split(",").map((v,i)=>{
                        return aliasIdObj[v];
                    });
                    let arr = [];
                    selectedRowKeys.forEach((v,i)=>{
                        // tbData[first]&&tbData[first].forEach((m,n)=>{
                        //     if(m.alias_name == v){
                        //         arr.push(m);
                        //     }
                        // });
                        arr.push(keyRowObj[v]);
                    });
                    fixedData = arr;

                    _this.setState({
                        glData,
                        tbData,//所有表格数据
                        keyRowObj,//
                        aliasIdObj,//
                        dataSource: tbData[first],
                        selectedRowKeys,
                        fixedData,
                        loading:false,
                    },function () {
                        this.refs.searchTree.setState({
                            expandedKeys:[first],
                            selectedKeys:[first]
                        });
                    });
                }else{//正常 下一步
                    _this.setState({
                        glData,
                        tbData,
                        keyRowObj,
                        aliasIdObj,
                        dataSource: tbData[first],
                        fixedData:[],
                        selectedRowKeys:[],
                        loading:false,
                    },function () {
                        this.refs.searchTree.setState({
                            expandedKeys:[first],
                            selectedKeys:[first]
                        });
                    })
                }
            }else {
                _this.setState({
                    loading:false,
                });
                message.warning("无数据！")
            }
        });
    }
    //子组件-》父组件数据变化
    otherDataChange(type,data){
        // console.log(data);
        switch (type){
            case "limitTime":
                if(data){
                    if(data == "13"){
                        this.dataLimitTime = this.userRelateTime[data]
                    }else {
                        this.dataLimitTime = formatDate(this.userRelateTime[data])
                    }
                }else {
                    this.dataLimitTime = formatDate(this.userRelateTime[1]);
                }
                break;
            case "jumpData":
                let jumpData = JSON.parse(JSON.stringify(data.jumpData));
                let params = JSON.parse(JSON.stringify(data.params));
                this.setState({
                    jumpData,
                    params,
                },function () {
                    this.tableFetch(params);
                });
                break;
            case "params":
                let params1 = JSON.parse(JSON.stringify(data));
                this.setState({
                    params:params1,
                });
                break;
            case "table":
                let params2 = JSON.parse(JSON.stringify(data));
                this.setState({
                    params:params2,
                },function () {
                    this.tableFetch(params2);
                });
                break;
        }
    }
    /*搜索回调*/
    searchChange(value){
        console.log(value);
        if(!value){return};
        let _this = this;
        let {params,search} = this.state;
        let postSearch = ()=>{
            let _this = this;
            let {search} = this.state;
            let getA = ()=>{

                let query = `searchFeature?business_type=${params.businessValue}&scenario=${params.scene}&search=${value}&user_type=${params.userValue}`;
                getAjax("/oceanus/feature_extract_request/"+query).then(res => res.json()).then(data => {
                    if (data.status == 'success'){
                        search.searchData = data.value?data.value:[];
                        // search.searchValue = value;
                        search.searchFlag = true;
                        _this.setState({
                            search,
                        })
                    }else {
                        message.warning("搜索失败！")
                    }
                })
            };
            search.searchFlag = false;
            this.setState({
                search,
            },getA);
        };
        //阻止输入太快
        search.searchValue = value;
        _this.setState({
            search,
        }, function () {
            clearTimeout(this.timer);
            this.timer=setTimeout(function(){
                postSearch();
            },300);
        });
        /*search.searchFlag = true;
         if(search.searchFlag){
         //
         }*/
    }
    //select点击回调
    selectChange(value){
        let _this = this;
        let{tbData,keyRowObj,search,selectedRowKeys,fixedData} = this.state;
        // console.log(value);
        let row = keyRowObj[value];
        search.searchValue = row.name;
        //table的 selectedRowKeys
        let selectedRowKeys_s = JSON.parse(JSON.stringify(selectedRowKeys));
        let valueFlag = true;
        selectedRowKeys.map((v,i)=>{
            if(v == value){
                valueFlag = false;
                message.warning("已选择此特征");
            }
        });
        if(valueFlag){
            selectedRowKeys_s.push(Number(value));
        }
        //已选择表格fixedData 数据
        let fixedData_s = [];
        selectedRowKeys_s.map((v,i)=>{
            fixedData_s.push(keyRowObj[v]);
        });
        /**
         * 树节点展开*/
        let first = "";//树节点
        for(let attr in tbData){
            let flag = false;
            let cur = tbData[attr];
            if(cur && cur.length>0){
                for(let i=0;i<cur.length;i++){
                    let vn = cur[i];
                    if(value == vn.feature_id){
                        first = attr;
                        flag=true;
                        break;
                    }
                }
            }
            if(flag){//跳出循环
                break;
            }
        }
        this.setState({
            search,
            selectedRowKeys:selectedRowKeys_s,
            fixedData:fixedData_s,
            dataSource: tbData[first],//当前显示的表格数据
        },function () {
            // console.log(first);
            _this.refs.searchTree.setState({
                expandedKeys:[first],
                selectedKeys:[first]
            });
        });

    }
    /*页码*/
    handleTableChange = (page,pageSize) => {
        let {pagination} = this.state;
        pagination.current = page;

        // console.log(pagination);
        this.setState({
            pagination,
        },function () {
            // this.tableFetch();
        });
    };
    /*左侧点击-表格数据*/
    tableUpdate(key){
        // console.log(key);
        let {tbData} = this.state;
        this.setState({
            dataSource:tbData[key],
            // fixedData:[],//不清空
            // selectedRowKeys:[],//不清空
        })
    }
    /*上一步 下一步*/
    stepButton(e){
        // console.dir(e.target);
        let {stepFlag,fixedData} = this.state;
        if(stepFlag){
            if(fixedData&&fixedData.length<=0){
                message.warning("请选取特征！");
                return;
            }
            // e.target.innerText = "上一步";
            // this.refs.stepButton.innerText = "上一步";
            // this.refs.stepButton_up.innerText = "上一步";
            document.getElementById('first').scrollIntoView();
        }else {
            // e.target.innerText = "下一步";
            // this.refs.stepButton.innerText = "下一步";
            // this.refs.stepButton_up.innerText = "下一步";
            document.getElementById('second').scrollIntoView()
        }
        this.setState({
            stepFlag : !stepFlag,
        });
    }
    /*点击提交*/
    handleSubmit(values){
        console.log(values);
        let this_ = this;
        const {selectedRowKeys,params,aliasIdObj} = this.state;
        let feature_list = ()=>{
            let list = [];
            for(let attr in aliasIdObj){
                selectedRowKeys.length>=1&& selectedRowKeys.map((v,i)=>{
                    if(v == aliasIdObj[attr]){
                        list.push(attr);
                    }
                })
            }
            return list.join(",");
        };
        // console.log(feature_list());
        let data = {
            task_scene: params.scene,//场景
            user_type: params.userValue,//用户类型
            business_type: params.businessValue,//业务线
            name: values.requirement_name,//需求名称
            applier: values.applier,//需求人
            feature_list:feature_list(),//已选特征
            model_type: values.model_type,//需求目的
            department: values.department,//需求人部门
            background: values.background,//背景
            current_situation: values.current_situation,//现状
            expect_gain: values.expect_gain,//预期收益
            actual_gain: "",//？？？
            output_fmt: values.data_type,//输出数据格式
            userDefinePath: values.data_path == "undefined" ?"":values.data_path,//自定义数据路径
            hadoopUser: values.hadoop_name == "undefined" ?"":values.hadoop_name,//hadoop账户
            start_day: values.time == "undefined"?"":values.time,//场景4 时间   冒泡-开始时间
            end_day: values.time == "undefined"?"":values.time,//场景4 时间    冒泡-结束时间
            hive_valid_day: values.period=="undefined"?"":this.periodTime(this.dataLimitTime,values.period),//有效期
            task_type: values.task_type? values.task_type:0,//人群-任务类型
            //execute_period: values.execute_period,//人群-例行周期
            //end_date: values.deadline,//人群-截止日期
            status: -1,
            run_status: -1,
            id: -1,
            hive_table: -1,
            is_copy: -1,
            is_weather_task: -1,
            cities: values.city?values.city.join(","):null,//城市
            model_content: values.model_content,//其他需m求目的  或  模型
        };
        /**
         * 常规 、冒泡的 结束时间赋值
         * model_type等于3时，other_content，等于1 时，model_content
         * output_fmt不等于1时，清空路径，否则清空有效期和账户
         *
         * */
        if(params.scene != 4){
            let range_time = JSON.parse(values.range_time);
            data.start_day = range_time?range_time[0]:"";
            data.end_day = range_time?range_time[1]:"";
        }
        if(values.model_type == 1){
            data.model_content = values.model_content;
        }else if(values.model_type == 3){
            data.model_content = values.other_content;
        }else {
            data.model_content = "";
        }
        if(values.data_type == 2){
            data.userDefinePath = "";
        }else {
            data.hadoopUser = "";
            data.hive_valid_day = "";
        }
        ///存入人群清单数据
        if(params.scene == "4" && params.filterValue == "2"){//指定的人群
            data.tag_user_type = params.userValue-1;
            data.tag_message =params.listValue;
        };
        //当分单  在选中出租车
        if((params.scene == "2") && (params.businessValue == "2")){
            data.user_type = 9;
        }
        //task_type 任务类型
        if(values.task_type == 1){
            data.execute_period = values.execute_period;
            data.end_date = values.deadline;
        }else{
            data.execute_period = -1;
            data.end_date = null;
        }
        //isrenew？？？？
        /*
        if(!!$scope.isrenew && $scope.isrenew.length>0){
            data.status = $scope.status;
            data.run_status = $scope.run_status;
            data.id = $scope.id;
            data.hive_table = $scope.hive_table;
            data.is_copy = $scope.is_copy;
            data.is_weather_task = $scope.is_weather_task;
        }else{
            data.status = -1;
            data.run_status = -1;
            data.id = -1;
            data.hive_table = -1;
            data.is_copy = -1;
            data.is_weather_task = -1;
        }
        */
        console.log(data);
        // data = JSON.parse(JSON.stringify(data));
        if(this.submitFlag){//防止重复点击
            this.submitFlag = false;
            postAjax('/oceanus/feature_extract_request/postRequest',data).then(res=>res.json()).then(data=>{
                if(data.status == 'success'){
                    // console.log(data.status);
                    message.success(data.message);
                    this_.submitFlag = true;
                    let url = `/feature_extract_list/my_task/`;
                    hashHistory.push(url)
                }else{
                    this_.submitFlag = true;
                    console.log(data.status);
                    message.error(data.message);
                }
            });
        }else {
            message.success("已提交，请勿重复点击！");
        }
    }
    componentDidMount(){

    }
    render(){
        // console.log(this.radioOptions.other_business);
        const {jumpData,stepFlag,tbData,keyRowObj,dataSource,loading,params,search,glData,fixedData,selectedRowKeys,requirePurposeFlag} = this.state;
        const dataSourceSort = dataSource&&dataSource.sort((a,b)=>{return a.name.length-b.name.length});
        const columns = [
            {
                title: '名称',
                width:"20%",
                sorter:(a,b)=>{return a.name-b.name},
                dataIndex: 'name',
            },
            {
                title: '逻辑名称',
                width:"20%",
                dataIndex: 'logical_name',
            },
            {
                title: '数据类型',
                width:"10%",
                dataIndex: 'data_type',
            },
            {
                title: '说明',
                dataIndex: 'comment',
            },
        ];
        const fixedColumns =  [
            {
                title: '名称',
                width:"20%",
                dataIndex: 'name',
            },
            {
                title: '逻辑名称',
                width:"20%",
                dataIndex: 'logical_name',
            },
            {
                title: '数据类型',
                width:"10%",
                dataIndex: 'data_type',
            },
            /*{
                title: '说明',
                dataIndex: 'comment',
            },*/
        ];
        // console.log(selectedRowKeys);
        const tableData = {
            loading:loading,
            className:"feature_statistics_table",
            rowSelection:{
                selectedRowKeys:selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
                    // console.log(selectedRowKeys);
                    // console.log(selectedRows);
                    let fixedData_s = [];
                    selectedRowKeys.map((v,i)=>{
                        let obj = keyRowObj[v];
                        fixedData_s.push(obj);
                    });
                    this.setState({
                        selectedRowKeys,
                        fixedData:fixedData_s,
                    })
                },
                getCheckboxProps: record => ({
                    // disabled: record.name === 'Disabled User', // 禁选
                }),
            },
            onRowClick:(record, index, event)=>{
                let flag = findInArr(selectedRowKeys,record.feature_id);
                // console.log(flag);
                if(!flag){
                    selectedRowKeys.push(record.feature_id);
                }else {
                    selectedRowKeys.splice(flag,1)
                }
                //fixedData
                let fixedData_s = [];
                selectedRowKeys.map((v,i)=>{
                    let obj = keyRowObj[v];
                    fixedData_s.push(obj);
                });
                // console.log(selectedRowKeys);
                this.setState({
                    selectedRowKeys,
                    fixedData:fixedData_s,
                })
            }
        };
        const fixedTable = {
            className:"feature_fixed_table",
            scroll:fixedData.length>10?{y:400}:{},
        };

        const searchOptions = search.searchData.map(d => <Option key={d.id}>{d.name}</Option>);
        // console.log(searchOptions);
        const fixContent = (
            <div>
                <MyTable
                    columns={fixedColumns}
                    dataSource= {fixedData}
                    rowKey={(record) => record.name+record.feature_id}
                    tableData={fixedTable}
                />
            </div>
        );
        // console.log(jumpData);
        // console.log("000",jumpData);
        return(
            <div className="selected_feature_content" id="first">
                <div className={stepFlag?"feature_content_first":"feature_content_first display"}>
                    <RadioSelect
                        ref={"radioSelect"}
                        queryId = {this.queryId?this.queryId:null}
                        tableFetch={this.tableFetch.bind(this)}
                        otherDataChange={this.otherDataChange.bind(this)}
                    />

                    <div className="feature_content_box clearfix">
                        <div className="feature_content_buttonBox_up">
                            <Button size={"large"} className={"feature_content_button"} ref={"stepButton_up"} onClick={this.stepButton.bind(this)}>下一步</Button>
                        </div>
                        <div className="feature_content_left fl">
                            <Select
                                mode="combobox"
                                value={search.searchValue}
                                placeholder={"搜索指标"}
                                notFoundContent="未搜索到结果"
                                style={{width: 160}}
                                defaultActiveFirstOption={false}
                                showArrow={false}
                                filterOption={false}
                                onSearch={this.searchChange.bind(this)}
                                onSelect={this.selectChange.bind(this)}
                            >
                                {
                                    searchOptions.length>=1 ? searchOptions :(
                                        <Option key="notFoundContent">未搜索到结果</Option>
                                    )
                                }
                            </Select>
                            <Icon className={!search.searchFlag?"feature_left_icon":"display"} type="loading" />
                            <SearchTree
                                ref={"searchTree"}
                                glData={glData}
                                _tableUpdate={this.tableUpdate.bind(this)}
                            />
                        </div>
                        <div className="feature_content_right fl">
                            <MyTable
                                columns={columns}
                                dataSource= {dataSourceSort}
                                rowKey={(record) => record.feature_id}
                                tableData={tableData}
                            />
                        </div>
                    </div>
                    <div className="feature_content_buttonBox">
                        <Button size={"large"} className={"feature_content_button"} ref={"stepButton_down"} onClick={this.stepButton.bind(this)}>下一步</Button>
                    </div>
                    <div className="feature_content_fixed">
                        <Popover content={fixContent} title="已选择特征" placement="left">
                            <Button type="primary">已选择特征</Button>
                        </Popover>
                    </div>
                </div>
                {!stepFlag?(
                    <div className={stepFlag?"feature_content_second display":"feature_content_second"} id="second">
                        <SelectFormGroup
                            //key={jumpData.toString()}
                            dataLimitTime = {this.dataLimitTime}
                            scene = {params.scene}
                            filterValue = {params.filterValue}
                            cityData = {JSON.parse(JSON.stringify(this.cityData))}
                            listArr = {params.listArr}
                            jumpData = {this.queryId?JSON.parse(JSON.stringify(jumpData)):null}
                            handleSubmit={this.handleSubmit.bind(this)}
                        />
                        <div className="feature_content_buttonBox_left">
                            <Button size={"large"} className={"feature_content_button"} ref={"stepButton_two"} onClick={this.stepButton.bind(this)}>上一步</Button>
                        </div>
                    </div>
                ):null}
            </div>
        )
    }
}

class SearchTree extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            expandedKeys: [],
            searchValue: '',
            selectedKeys: [],
            autoExpandParent: true,
        };
    }
    componentWillMount(){

    }
    //展开/收起节点时触发
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };
    /*搜索*/
    onChange = (e) => {
        const value = e.target.value;
        // console.log(typeof value);
        // console.log(this.dataList);
        const expandedKeys = this.dataList.map((item) => {
            if(!item.title || item.title == null){
                item.title = "";
            }
            if (item.title.indexOf(value) > -1) {
                // console.log(item.title);
                return this.getParentKey(item.key, this.props.glData);
            }
            return null;
        }).filter((item, i, self) => item && self.indexOf(item) === i);
        this.setState({
            expandedKeys,
            searchValue: value,
            autoExpandParent: true,
        });
    };
    /*执行父组件函数*/
    tableUpdate(keys){
        this.props._tableUpdate(keys[0])
    }
    /*点击树节点*/
    treeSelect(keys, e){
    // e:{selected: bool, selectedNodes, node, event}
    //     console.log(keys);
    //     console.log(e);
        let {expandedKeys,selectedKeys} = this.state;
        if(keys.toString() == "passenger"||keys.toString() == "weather"||keys.toString() == "driver"){
            this.setState({
                expandedKeys:expandedKeys.toString() == keys.toString()?[]:keys,
                autoExpandParent: true,
            })
        }else {
            this.setState({
                selectedKeys:keys.length>=1?keys:selectedKeys,
                // autoExpandParent: true,
            },function () {
                this.tableUpdate(this.state.selectedKeys)
            })
        }

    }
    componentWillReceiveProps(props){
        if(props){
            // console.log(111);
            this.generateList(this.props.glData);
        }
    }
    /*key*/
    getParentKey = (key, tree) => {
        let parentKey;
        for (let i = 0; i < tree.length; i++) {
            const node = tree[i];
            if (node.children) {
                if (node.children.some(item => item.key === key)) {
                    parentKey = node.key;
                } else if (this.getParentKey(key, node.children)) {
                    parentKey = this.getParentKey(key, node.children);
                }
            }
        }
        return parentKey;
    };
    /*搜索 dataList*/
    generateList = (data) => {
        for (let i = 0; i < data.length; i++) {
            const node = data[i];
            const key = node.key;
            const title = node.title;
            this.dataList.push({ key, title: title });
            if (node.children) {
                this.generateList(node.children, node.key);
            }
        }
    };
    render() {
        const { searchValue, expandedKeys, autoExpandParent,selectedKeys} = this.state;
        /* 搜索 dataList
         [
         {key: "0-0", title: "0-0"},
         {key: "0-0-0", title: "0-0-0"},
         ... ...
         ]
         */
        this.dataList = [];
        this.generateList(this.props.glData);
        const loop = data => data.map((item) => {
            const index = item.title&&item.title.toString().indexOf(searchValue);
            const beforeStr = item.title&&item.title.toString().substr(0, index);
            const afterStr = item.title&&item.title.toString().substr(index + searchValue.length);
            const title = index > -1 ? (
                        <span>
                            {beforeStr}
                            <span className="orange">{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {loop(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} />;
        });
        // console.log(expandedKeys);
        // console.log(autoExpandParent);
        // console.log(selectedKeys);
        return (
            <div className="">
                {/*<Search style={{ marginBottom: 8 }}*/}
                        {/*placeholder="搜索指标"*/}
                        {/*className="feature_left_search"*/}
                        {/*onChange={this.onChange}*/}
                {/*/>*/}
                <Tree
                    key={expandedKeys}
                    className="feature_left_tree"
                    onExpand={this.onExpand}
                    expandedKeys={expandedKeys}//展开制定节点
                    autoExpandParent={autoExpandParent}
                    onSelect={this.treeSelect.bind(this)}
                    selectedKeys={selectedKeys}
                >
                    {loop(this.props.glData)}
                </Tree>
            </div>
        );
    }
}
