import React from 'react';
import {getCookie,showTimeLength,formatDate,dateFormat} from '../../../methods';
import {getAjax,postAjax} from '../../../fetch/index';
import {Select, Form, Input, Radio,Button,message,Icon} from 'antd';
import { is ,Map} from 'immutable';
import moment from 'moment';
const dateFormatStr = 'YYYY-MM-DD';
const Option = Select.Option;
import {MRadio,RGroup,RButton} from '../../../components/MyRadio';
const FormItem = Form.Item;
const RadioGroup = Radio.Group;
import SingleDatePicker from '../../../components/DatePicker/SingleDatePicker';
import RangeDatePicker from '../../../components/DatePicker/RangeDatePicker';

class SelectForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            options:{
                requirePurposeType:[
                    { label: '模型开发', value:"1" },
                    { label: '数据挖掘/分析', value:"2" },
                    { label: '其他', value:"3" },
                ],//需求目的
            },
            params:{
                requirePurposeValue: "1",//需求目的
                outputDataValue: "2",//需求目的
                periodValue: "1",//有效期
                cityValue: ["1"],//城市
                dateValue: this.props.dataLimitTime,//时间
                scheduleTaskValue:"0",//任务类型
                executePeriodValue:"1",//例行周期
                deadlineValue:this.props.dataLimitTime,//截止日期
            },
            requirePurposeFlag:false,
            modalFlag:true,
            dateSingleDefault:{
                maxValue:this.props.dataLimitTime,
                //minValue:'2017-09-27',
                startValue:this.props.dataLimitTime,
                handleDateChange:this.handleSingleChange.bind(this)
            },
            dateRangeDefault:{
                maxValue:this.props.dataLimitTime,
                // minValue:dateFormat(new Date()-24*60*60*1000),
                startValue:showTimeLength(this.props.dataLimitTime,1),
                endValue:this.props.dataLimitTime,
                handleDateChange:this.handleRangeChange.bind(this)
            },
            deadlineDefault:{
                minValue:showTimeLength(this.props.dataLimitTime,-1),
                //minValue:'2017-09-27',
                startValue:showTimeLength(this.props.dataLimitTime,-2),
                handleDateChange:this.deadlineChange.bind(this)
            },
        };
        this.titleName = {
            applier: "需求人",
            background: "背景",
            city: "城市",
            current_situation: "现状",
            data_type: "数据格式",
            department: "需求人所在部门",
            expect_gain: "预期收益",
            model_type: "需求目的",
            other_content: "其他需求目的",
            requirement_name: "需求人",
            time: "时间",
            data_path: "输出数据路径",
        };
        this.periodName = {
            "1":"7",
            "2":"14",
            "-1":"30",
        };
        this.username = getCookie("username");
        this.periodTime = (limit,num)=>{
            limit = limit?limit:dateFormat(new Date()-24*60*60*1000);
            let m = limit;
            let n = -Number(num)-1;
            return showTimeLength(m,n)
        };
    }
    componentWillMount(){
        // console.log(this.props.dataLimitTime);
    }
    componentWillReceiveProps(props){
        // dataLimitTime 改变时子组件 日期的值相应改变

        let {dateSingleDefault,dateRangeDefault,deadlineDefault} =this.state;
        if(props){
            // console.log(props.dataLimitTime);
            /*
            if(props.jumpData){
                //时间
                dateSingleDefault.maxValue = props.dataLimitTime;
                dateSingleDefault.startValue = props.jumpData.start_day;
                //开始-结束
                dateRangeDefault.maxValue = props.dataLimitTime;
                dateRangeDefault.startValue =props.jumpData.start_day;
                dateRangeDefault.endValue = props.jumpData.end_day;
                //截止日期
                deadlineDefault.minValue = props.dataLimitTime;
                deadlineDefault.startValue = props.jumpData.end_date;
                this.setState({
                    dateSingleDefault,
                    dateRangeDefault,
                    deadlineDefault,
                })
            }else {
                dateSingleDefault.maxValue = props.dataLimitTime;
                dateSingleDefault.startValue = props.dataLimitTime;
                //开始-结束
                dateRangeDefault.maxValue = props.dataLimitTime;
                dateRangeDefault.startValue =showTimeLength(props.dataLimitTime,1);
                dateRangeDefault.endValue = props.dataLimitTime;
                //截止日期
                deadlineDefault.minValue = showTimeLength(props.dataLimitTime,-1);
                deadlineDefault.startValue = showTimeLength(props.dataLimitTime,-2);
                this.setState({
                    dateSingleDefault,
                    dateRangeDefault,
                    deadlineDefault,
                })
            }
             */
        }
    }
    //点击提交
    handleSubmit(e){
        e.preventDefault();
        let _this = this;
        this.props.form.validateFieldsAndScroll((err, values) => {
            // console.log(err);
            if (!err) {
                // console.log(values);
                _this.props.handleSubmit(values);//
            }else {
                for(let attr in err ){
                    message.error('请填写'+this.titleName[attr]);
                    break
                }
            }
        });
    }

    /*需求目的change事件*/
    requirePurposeChange(e){
        // console.log(e.target.value);
        let {params,requirePurposeFlag,modalFlag} =this.state;
        params.requirePurposeValue = e.target.value;
        switch (e.target.value){
            case "1":
                requirePurposeFlag = false;
                modalFlag = true;
                this.setState({
                    params,
                    requirePurposeFlag,
                    modalFlag,
                });
                break;
            case "2":

                requirePurposeFlag = false;
                modalFlag = false;
                this.setState({
                    params,
                    requirePurposeFlag,
                    modalFlag,
                });
                break;
            case "3":
                requirePurposeFlag = true;
                modalFlag = false;
                this.setState({
                    params,
                    requirePurposeFlag,
                    modalFlag,
                },function () {
                    // console.dir(document.getElementsByClassName("feature_second_other"));
                    document.getElementsByClassName("feature_second_other")[0].focus();
                    // console.dir(this.refs);
                    // this.refs["feature_second_other"].focus();
                });
                break;
        }
    }
    //输出数据格式
    outputDataChange(e){
        // console.log(e.target.value);
        let {params,dataFlag} =this.state;
        params.outputDataValue = e.target.value;
        this.setState({
            params,
        })
    }
    //hadoop单选按钮
    hadoopRadio(e){
        // console.log(e.target);
        // console.log(this.props.form.getFieldsValue().hadoop_radio);
        let hadoop = this.props.form.getFieldsValue().hadoop_name;
        if(hadoop){
            this.props.form.setFieldsValue({
                hadoop_name: "",
            });
        }else {
            this.props.form.setFieldsValue({
                hadoop_name: this.username,
            });
        }

    }
    //有效期select
    periodChange(value){
        let {params} = this.state;
        let {dataLimitTime} = this.props;
        params.periodValue = value;
        this.setState({
            params,
        });
       /* this.props.form.setFieldsValue({
            period: this.periodTime(dataLimitTime,params.periodValue),
        });*/
    }
    //城市
    cityChange(value){
        // console.log(value);
        let {params} = this.state;
        if(value&&value.length>=5){
            message.warning("最多支持选择5个城市！");
        }
        params.cityValue = value;
        this.setState({
            params,
        })
    }
    ///单日历变化
    handleSingleChange(v,a){
        // console.log(v,a);
        let {params} = this.state;
        params.dateValue = a;
        this.setState({
            params,
        });
        this.props.form.setFieldsValue({
            time: a,
        });
        let dateSingleDefault1 = Map(this.state.dateSingleDefault);
        let dateSingleDefault2 = dateSingleDefault1.set('startValue',moment(a).format(dateFormatStr));
        this.setState({
            dateSingleDefault:dateSingleDefault2.toJS()
        });


    }
    //双日历
    handleRangeChange(v,a){
        // console.log(a);
        let {params} = this.state;
        params.dateValue = JSON.stringify(a);
        this.setState({
            params,
        });
        this.props.form.setFieldsValue({
            range_time: JSON.stringify(a),
        });
        let dateRangeDefault1 = Map(this.state.dateRangeDefault);
        let dateRangeDefault2 = dateRangeDefault1.set('startValue',moment(a[0]).format(dateFormatStr));
        let dateRangeDefault3 = dateRangeDefault2.set('endValue',moment(a[1]).format(dateFormatStr));
        this.setState({
            dateRangeDefault:dateRangeDefault3.toJS()
        });

    }
    //任务类型
    scheduleTask(e){
        // console.log(e.target.value);// 0  1
        let {params} =this.state;
        params.scheduleTaskValue = e.target.value;
        this.setState({
            params,
        },function () {
            if(e.target.value == "1"){
                this.props.form.setFieldsValue({
                    deadline:showTimeLength(this.props.dataLimitTime,-2),
                });
            }
        });

    }
    //例行周期
    executePeriodChange(value){
        let {params} = this.state;
        params.executePeriodValue = value;
        this.setState({
            params,
        });
    }
    //截止日期
    deadlineChange(v,a){
        // console.log(v,a);
        let {params} = this.state;
        params.deadline = a;
        this.setState({
            params,
        });
        this.props.form.setFieldsValue({
            deadline: a,
        });

        let deadlineDefault1 = Map(this.state.deadlineDefault);
        let deadlineDefault2 = deadlineDefault1.set('startValue',moment(a).format(dateFormatStr));
        this.setState({
            deadlineDefault:deadlineDefault2.toJS()
        });

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
    componentDidMount(){
        let {params,dateSingleDefault,dateRangeDefault,deadlineDefault} = this.state;
        const {scene,filterValue,jumpData,dataLimitTime} = this.props;
        if(jumpData){//点击编辑跳转过来-绑数据
            // console.log(jumpData);
            this.props.form.setFieldsValue({
                requirement_name: jumpData.name,
                applier: jumpData.applier,
                department: jumpData.department,
                model_type: jumpData.model_type+"",
                background: jumpData.background,
                current_situation: jumpData.current_situation,
                expect_gain: jumpData.expect_gain,
                data_type: jumpData.output_fmt+"",
            });
            scene == "4" && this.props.form.setFieldsValue({
                task_type: jumpData.task_type+"",
            });
            //需求目的
            if(jumpData.model_type == 1){
                this.setState({
                    modalFlag:true,
                    requirePurposeFlag:false,
                },function () {
                    this.props.form.setFieldsValue({
                        model_content: jumpData.model_content,//模型
                    });
                });
            }else if(jumpData.model_type == 3){
                this.setState({
                    modalFlag:false,
                    requirePurposeFlag:true,
                },function () {
                    this.props.form.setFieldsValue({
                        other_content: jumpData.model_content,//其他 -需求目的
                    });
                });
            }else {
                this.setState({
                    modalFlag:false,
                    requirePurposeFlag:false,
                })
            }
            //输出数据格式
            if(jumpData.output_fmt == 2){ // hive
                params.outputDataValue = jumpData.output_fmt+"";
                params.periodValue = "1";
                this.setState({
                    params,
                },function () {
                    this.props.form.setFieldsValue({
                        period: "1",//点击编辑进来的数据没有 有效期
                        hadoop_name: jumpData.hadoop_user,
                    });
                });
            }else if(jumpData.output_fmt == 1){ // csv
                params.outputDataValue = jumpData.output_fmt+"";
                this.setState({
                    params,
                },function () {
                    this.props.form.setFieldsValue({
                        data_path: jumpData.user_define_path,
                    });
                });
            }

            //城市 获知 filterValue
            if(!(scene == "4" && filterValue == "2")){ // hive
                if(jumpData.cities){
                    this.props.form.setFieldsValue({
                        city: jumpData.cities.split(","),
                    });
                }
            }

            //时间   点击编辑进来的限制日期以最新的为准
            if( scene == "4" ){ //时间
                // console.log(jumpData.start_day);
                dateSingleDefault.maxValue = dataLimitTime;
                dateSingleDefault.startValue = jumpData.start_day;
                params.dateValue = jumpData.start_day;
                this.setState({
                    dateSingleDefault,
                    params,
                },function () {
                    this.props.form.setFieldsValue({
                        time: jumpData.start_day,
                    });
                });
            }else {//开始 结束
                dateRangeDefault.maxValue = dataLimitTime;
                dateRangeDefault.startValue =jumpData.start_day;
                dateRangeDefault.endValue = jumpData.end_day;
                this.setState({
                    dateSingleDefault,
                },function () {
                    this.props.form.setFieldsValue({
                        range_time: JSON.stringify([jumpData.start_day,jumpData.end_day]),
                    });
                });
            }
            //任务类型 scheduleTaskValue  禁用状态
            if(jumpData.task_type == 1){ // 例行
                // debugger
                params.scheduleTaskValue = jumpData.task_type+"";
                deadlineDefault.minValue = dataLimitTime;
                deadlineDefault.startValue = jumpData.end_date;
                this.setState({
                    params,
                    deadlineDefault,
                },function () {
                    this.props.form.setFieldsValue({
                        hadoop_radio:jumpData.task_type,
                        execute_period: jumpData.execute_period+"",
                        deadline: jumpData.end_date,
                    });
                });
            }else if(jumpData.task_type == 0){ // 单词
                params.scheduleTaskValue = jumpData.task_type+"";
                this.setState({
                    params,
                },function () {
                    // this.props.form.setFieldsValue({
                    //     // data_path: jumpData.user_define_path,
                    // });
                });
            }

        }else {
            dateSingleDefault.maxValue = dataLimitTime;
            dateSingleDefault.startValue = dataLimitTime;
            //开始-结束
            dateRangeDefault.maxValue = dataLimitTime;
            dateRangeDefault.startValue =showTimeLength(dataLimitTime,1);
            dateRangeDefault.endValue = dataLimitTime;
            //截止日期
            deadlineDefault.minValue = showTimeLength(dataLimitTime,-1);
            deadlineDefault.startValue = showTimeLength(dataLimitTime,-2);
            this.setState({
                dateSingleDefault,
                dateRangeDefault,
                deadlineDefault,
            },function () {
                if(scene == "4"){
                    this.props.form.setFieldsValue({
                        time: dataLimitTime,
                    });
                }else {
                    let range_time = [showTimeLength(dataLimitTime,1),dataLimitTime];
                    this.props.form.setFieldsValue({
                        range_time: JSON.stringify(range_time),
                    });
                }
            })
        }
    }
    render(){
        const {params,options,requirePurposeFlag,modalFlag,dateSingleDefault,dateRangeDefault,deadlineDefault} = this.state;
        const {dataLimitTime,cityData,scene,filterValue,jumpData,listArr} = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 6 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 14 },
            },
        };
        // console.log(jumpData);
        let deadlineParams = {};//截止日期参数对象
        deadlineParams.disabled = jumpData?true:false;
        let periodArr = {
          "1":"7",
          "2":"14",
          "-1":"30",
        };
        // console.log(222,jumpData);
        // console.log(222,listArr);
        return (
            <Form onSubmit={this.handleSubmit.bind(this)} >
                <FormItem
                    {...formItemLayout}
                    label= {<span className="feature_second_title">需求名称</span>}
                    hasFeedback
                >
                    {getFieldDecorator('requirement_name', {
                        rules: [{
                            required: true, message: '请输入需求名称',
                        }],
                    })(
                        <Input placeholder="请输入需求名称" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">需求人</span>}
                    hasFeedback
                >
                    {getFieldDecorator('applier', {
                        rules: [{
                            required: true, message: '请输入您的名字',
                        }],
                    })(
                        <Input placeholder="请输入您的名字" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">需求人所在部门</span>}
                    hasFeedback
                >
                    {getFieldDecorator('department', {
                        rules: [{
                            required: true, message: '请输入您的所属部门',
                        }],
                    })(
                        <Input placeholder="请输入您的所属部门" />
                    )}
                </FormItem>
                <div style={{"position":"relative"}}>
                    <FormItem
                        {...formItemLayout}
                        label={<span className="feature_second_title">需求目的</span>}
                    >
                        {getFieldDecorator('model_type', {
                            rules: [{
                                required: false, message: '请选择需求目的',
                            }],
                            initialValue:"1"
                        })(
                            <RadioGroup onChange={this.requirePurposeChange.bind(this)} >
                                <Radio value="1" className="common_radio_self" disabled={jumpData?true:false}>模型开发</Radio>
                                <Radio value="2" className="common_radio_self" disabled={jumpData?true:false}>数据挖掘/分析</Radio>
                                <Radio value="3" className="common_radio_self" disabled={jumpData?true:false}>其他</Radio>
                            </RadioGroup>
                        )}
                    </FormItem>
                    {
                        requirePurposeFlag&&(
                            <FormItem
                                {...formItemLayout}
                                label=" "
                                hasFeedback
                                colon={false}
                                style={{"width":"340px","position":"absolute","left":"45%","top":"0"}}
                            >
                                {getFieldDecorator('other_content', {
                                    rules: [{
                                        required: requirePurposeFlag, message: '请输入需求目的',
                                    }],
                                    initialValue:""
                                })(
                                    <Input placeholder="请输入需求目的" disabled={jumpData?true:false} className={"feature_second_other"} />
                                )}
                            </FormItem>
                        )
                    }
                </div>
                {modalFlag? (<FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">模型</span>}
                    hasFeedback
                >
                    {getFieldDecorator('model_content', {
                        rules: [{
                            required: true, message: '请填写模型名称',
                        }],
                    })(
                        <Input style={{"width":"200px","marginRight":"20px"}} disabled={jumpData?true:false} placeholder="请填写模型名称" />
                    )}
                    {/*<span className="feature_model_hint">模型提取任务审批更快，能使用更多特征</span>*/}
                </FormItem>):''}
                <FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">背景</span>}
                    hasFeedback
                >
                    {getFieldDecorator('background', {
                        rules: [{
                            required: true, message: '请填写背景',
                        }],
                    })(
                        <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="为了更快地通过审批，请尽量详细填写" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">现状</span>}
                    hasFeedback
                >
                    {getFieldDecorator('current_situation', {
                        rules: [{
                            required: true, message: '请输入现状',
                        }],
                    })(
                        <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="请输入现状" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">预期收益</span>}
                    hasFeedback
                >
                    {getFieldDecorator('expect_gain', {
                        rules: [{
                            required: true, message: '请填写预期收益',
                        }],
                    })(
                        <Input type="textarea" style={{"height":"120px","lineHeight":"28px","resize":"none"}} placeholder="为了更快地通过审批，请尽量详细填写" />
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label={<span className="feature_second_title">输出数据格式</span>}
                >
                    {getFieldDecorator('data_type', {
                        rules: [{
                            required: true, message: '请选择输出数据格式',
                        }],
                        initialValue:"2"
                    })(
                        <RadioGroup onChange={this.outputDataChange.bind(this)}>
                            <Radio value="2" className="common_radio_self" >Hive表</Radio>
                            <Radio value="1" className="common_radio_self" >CSV</Radio>
                        </RadioGroup>
                    )}
                    {
                        params.outputDataValue == "2" &&(
                            <span className="feature_model_hint">推荐使用，需提供使用方Hadoop账号并到 <a target="_blank" href="http://dpp.intra.xiaojukeji.com/index#/apply/dataAuth">D++</a> 平台上申请表权限</span>
                        )
                    }
                    {
                        params.outputDataValue == "1" &&(
                            <span className="feature_model_hint">需提供输出的HDFS路径并确保该路径存在且权限为777</span>
                        )
                    }
                </FormItem>
                {
                    params.outputDataValue == "2" &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">设置有效期</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('period', {
                                rules: [{
                                    required: true, message: '请输入需求名称',
                                }],
                                initialValue:"1"
                            })(
                                <Select style={{ width: 120 }} onChange={this.periodChange.bind(this)}>
                                    <Option value="1">一周</Option>
                                    <Option value="2">两周</Option>
                                    <Option  title="按30天计算" value="-1">一个月</Option>
                                </Select>
                            )}
                            {/*<span className="feature_model_hint">{this.periodTime(dataLimitTime,periodArr[params.periodValue])+"日期后会不定期删除"+this.periodName[params.periodValue]+"之前的数据"}</span>*/}
                            <span className="feature_model_hintHover">
                                <Icon className="feature_model_icon" type="info-circle-o" />
                                <span className="feature_model_hint">{"Hive表TTL="+this.periodName[params.periodValue]}</span>
                            </span>
                        </FormItem>
                    )
                }
                {
                    params.outputDataValue == "2" &&(
                        <div style={{"position":"relative"}}>
                            <FormItem
                                {...formItemLayout}
                                label= {<span className="feature_second_title">设置Hadoop账户</span>}
                                hasFeedback
                                style={{"width":"50%","marginLeft":"12.5%"}}
                            >
                                {getFieldDecorator('hadoop_name', {
                                    rules: [{
                                        required: true, message: '请设置Hadoop账户',
                                    }],
                                    initialValue:""
                                })(
                                    <Input placeholder="请设置Hadoop账户" />
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                //label= {<span className="feature_second_title">设置Hadoop账户</span>}
                                //hasFeedback
                                style={{"width":"400px","position":"absolute","left":"56%","top":"0"}}
                            >
                                {getFieldDecorator('hadoop_radio', {
                                    rules: [{
                                        required: false, message: '请输入需求名称',
                                    }],
                                })(
                                    <MRadio
                                        label="我不知道什么是Hadoop账户"
                                        onChange = {this.hadoopRadio.bind(this)}
                                    />
                                )}
                            </FormItem>
                        </div>
                    )
                }
                {
                    params.outputDataValue == "1" &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">输出数据路径</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('data_path', {
                                rules: [{
                                    required: true, message: '请输入自定义路径',
                                }],
                            })(
                                <Input placeholder="请输入自定义路径" />
                            )}
                        </FormItem>
                    )
                }
                {
                    !(scene == "4" && filterValue == "2"&& listArr && listArr.length>=1) &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">请选择城市</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('city', {
                                rules: [{
                                    required: true, message: '请选择城市',
                                }],
                                //initialValue:["1"]
                            })(
                                <Select
                                    //key={params.cityValue}
                                    showSearch
                                    mode="multiple"
                                    style={{ width: 450,marginRight:20 }}
                                    placeholder="请选择城市"
                                    optionFilterProp="children"
                                    onChange={this.cityChange.bind(this)}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {
                                        cityData&&cityData.map((t,i)=>{
                                            if(params.cityValue.length>=5){
                                                let arr = params.cityValue;
                                                if(t.id == arr[0]||t.id == arr[1]||t.id == arr[2]||t.id == arr[3]||t.id == arr[4]){
                                                    return (
                                                        <Option key={t.id} value={t.id+""}>{t.cn_name}</Option>
                                                    )
                                                }else {
                                                    return (
                                                        <Option disabled={true} key={t.id} value={t.id+""}>{t.cn_name}</Option>
                                                    )
                                                }
                                            }else {
                                                return (
                                                    <Option key={t.id} value={t.id+""}>{t.cn_name}</Option>
                                                )
                                            }
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    )
                }
                {
                    scene == "4" &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">时间</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('time', {
                                rules: [{
                                    required: true, message: '请选择时间',
                                }],
                            })(
                                <SingleDatePicker datePickerData={dateSingleDefault} />
                            )}
                            <span className="feature_model_hintHover">
                                <Icon className="feature_model_icon" type="info-circle-o" />
                                <span className="feature_model_hint">{"您已选择 "+params.dateValue+" 的数据"}</span>
                            </span>
                        </FormItem>
                    )
                }
                {
                    scene != "4" &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">开始~结束时间</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('range_time', {
                                rules: [{
                                    required: true, message: '请选择时间',
                                }],
                            })(
                                <RangeDatePicker datePickerData={dateRangeDefault}
                                                 ///key={dateRangeDefault.startValue+dateRangeDefault.endValue}
                                />
                            )}
                            <span className="feature_model_hintHover">
                                <Icon className="feature_model_icon" type="info-circle-o" />
                                <span className="feature_model_hint_duo">建议选择一个月内的时间，如需提取更多数据，请发送邮件到dulongzhi，zhuochengxiang，wangzhimingjimmy，
                                    抄送至lizhang和您的leader，其内容主要包含取数需求、取数起止日期、城市。然后在特征平台上提交一个任务取数起止日期和城市选择子集。</span>
                            </span>
                        </FormItem>
                    )
                }
                {
                    scene == "4" &&(
                        <FormItem
                            {...formItemLayout}
                            label={<span className="feature_second_title">任务类型</span>}
                        >
                            {getFieldDecorator('task_type', {
                                rules: [{
                                    required: true, message: '请选择任务类型',
                                }],
                                initialValue:"0"
                            })(
                                <RadioGroup onChange={this.scheduleTask.bind(this)}>
                                    <Radio value="0" className="common_radio_self" disabled={jumpData?true:false}>单次</Radio>
                                    <Radio value="1" className="common_radio_self" disabled={jumpData?true:false}>例行</Radio>
                                </RadioGroup>
                            )}
                        </FormItem>
                    )
                }
                {
                    params.scheduleTaskValue == "1" &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">例行周期</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('execute_period', {
                                rules: [{
                                    required: true, message: '请输入需求名称',
                                }],
                                initialValue:"1"
                            })(
                                <Select style={{ width: 120,marginRight:20 }} onChange={this.executePeriodChange.bind(this)} disabled={jumpData?true:false}>
                                    <Option value="1">1天</Option>
                                    <Option value="7">7天</Option>
                                    <Option value="30">30天</Option>
                                </Select>
                            )}
                        </FormItem>
                    )
                }
                {
                    params.scheduleTaskValue == "1" &&(
                        <FormItem
                            {...formItemLayout}
                            label= {<span className="feature_second_title">截止日期</span>}
                            hasFeedback
                        >
                            {getFieldDecorator('deadline', {
                                rules: [{
                                    required: true, message: '请选截止日期',
                                }],
                            })(
                                <SingleDatePicker datePickerData={deadlineDefault} params = {deadlineParams}  ///key={deadlineDefault.startValue}
                               />
                            )}
                        </FormItem>
                    )
                }
                <div style={{"textAlign":"center"}}>
                    <Button type="primary" ref="submitBtn" htmlType="submit" className="login-form-button"  >
                        提交申请
                    </Button>
                </div>
            </Form>
        )
    }
}

const SelectFormGroup = Form.create({})(SelectForm);
export default SelectFormGroup

