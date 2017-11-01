import React, { Component } from 'react'
import {Input,Radio,Select,Icon,Row,Col} from 'antd'
import BusinessRadio from './BusinessRadio'
import {getAjax,postAjax} from '../../../fetch'
import ThemeSelect from './ThemeSelect'
const RadioGroup = Radio.Group
const Option = Select.Option
export default class FeatureItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            user_type:1,
            business_type_arr:[ 
                                {name:"全局",value:0},
                                {name:"快车",value:-1},
                                {name:"专车",value:1},
                                {name:"出租车",value:2},
                                {name:"优享",value:6},                                
                                {name:"顺风车",value:5},
                                {name:"大巴",value:7},
                                {name:"代驾",value:3},
                                {name:"sofa",value:4},
                                {name:"海浪",value:9},
                                {name:"豪华车",value:8}
                            ],
            default_business_value:1,
            default_theme_value:`基础信息`,
            default_category_value:`1111`,
            attribute:-1,
            category_data:[],
            theme_data:[],
            show:true,
            intro_data:[],
            theme_con_data:[]
        }
    }
    componentWillMount() {
        //获取特征类别的参数 处理后参数格式[{key:13,value:天气}·····{}]
        this.getCategory("passenger")
        getAjax('/oceanus/offline_feature/getFeatureThemeFromTagsystem?user_type=1&business_type=1&attribute=-1')
            .then(res=>res.json())
            .then(res=>{
                let mappingData = res.value
                this.setState({
                    theme_data:mappingData,
                    default_theme_value:mappingData.length===0?`N/A`:mappingData[0]
                })
            })
        this.setState({defaultData:this.props.defaultData})
      
        
    }
    componentWillReceiveProps(nextProps) {
       
    }
    render(){
        console.log(this.props.defaultData)
        let sum_arr = []
        this.props.defaultData.en_name == "" ? "" : sum_arr.push(<span key={0} className="sum-item"><span className="sum-name">英文名：</span>{this.props.defaultData.en_name}</span>)
        this.props.defaultData.ch_name == "" ? "" : sum_arr.push(<span  key={1} className="sum-item"><span className="sum-name">中文名：</span>{this.props.defaultData.ch_name}</span>)
        this.props.defaultData.responsible_person == "" ? "" : sum_arr.push(<span  key={2} className="sum-item"><span className="sum-name">数据接口人：</span>{this.props.defaultData.responsible_person}</span>)
        this.props.defaultData.source_field == "" ? "" : sum_arr.push(<span  key={3} className="sum-item"><span className="sum-name">源字段名称：</span>{this.props.defaultData.source_field}</span>)
        this.props.defaultData.default_value == "" ? "" : sum_arr.push(<span  key={4} className="sum-item"><span className="sum-name">默认值：</span>{this.props.defaultData.default_value}</span>)
        
        return (
            <div className="feature-info">
                <div className="feature-toggle">
                    <div className="feature-intro">
                        <div className={`feature-intro-content` + (this.state.show?``:`active`)}>
                            {sum_arr}
                        </div>
                    </div>
                    <div onClick={this.handleToggleShow} className={`feature-toggle-button `+(this.state.show?`active`:``)}>
                        <Icon type="up" style={{verticalAlign:"middle"}}/>收起
                    </div>
                    <div onClick={this.handleToggleShow} className={`feature-toggle-button `+(!this.state.show?`active`:``)}>
                        <Icon type="down" style={{verticalAlign:"middle"}}/>展开
                    </div>
                </div>
                <div className={`feature-content `+(this.state.show?``:`hide`)}>
                    <h3 className="table_title">基础</h3>
                    <div className="delete-feature" onClick={this.handleDeleteFeature.bind(this)}>删除这条特征</div>
                    <div className='table_form'>
                        <Row >
                            <label className="control-label"><span className="xing">*</span>用户：</label>
                            <RadioGroup onChange={this.userChange.bind(this)}  value={this.props.defaultData.user_type || this.state.user_type} style={{paddingLeft:27}}>
                                <Radio value={`1`}>滴滴乘客</Radio>
                                <Radio value={`2`}>专快司机</Radio>
                                <Radio value={`3`}>出租车司机</Radio>
                                <Radio value={`4`}>代驾司机</Radio>
                                <Radio value={`7`}>uber乘客</Radio>
                                <Radio value={`5`}>sofa司机</Radio>
                                <Radio value={`6`}>顺风车司机</Radio>
                            </RadioGroup>
                        </Row>
                        
                        <BusinessRadio ref="businessRadio" business_type_arr = {this.state.business_type_arr} default_business_value={this.props.defaultData.business_type || this.state.default_business_value} businessChange={this.businessChange}/>
                    
                        <Row >
                            <label className="control-label"><span className="xing">*</span>特征属性：</label>
                            <RadioGroup value={this.props.defaultData.attribute} onChange={this.attributeChange.bind(this)}>
                                <Radio value={`-1`}>全部</Radio>
                                <Radio value={`1`}>挖掘类</Radio>
                                <Radio value={`0`}>统计类</Radio>
                            </RadioGroup>
                        </Row>
                        <Row gutter={128}>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>特征中文名称：</label>
                                <Input size="large" value={this.props.defaultData.ch_name} onChange={this.handleFeatureChange.bind(this,"ch_name")} placeholder="请填写特征中文名称"/>
                            </Col>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>特征英文名称：</label>
                                <Input size="large" value={this.props.defaultData.en_name} onChange={this.handleFeatureChange.bind(this,"en_name")} placeholder="请填写特征英文名称"/>
                            </Col>
                        </Row>
                        <Row gutter={128}>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>数据类型：</label>
                                <Select size="large" value={this.props.defaultData.data_type} style={{width:"100%"}} onChange={this.handleFeatureSelect.bind(this,"data_type")}>
                                    <Option value={"string"}>string</Option>
                                    <Option value={"int"}>int</Option>
                                    <Option value={"bigint"}>bigint</Option>
                                    <Option value={"decimal(19,6)"}>decimal(19,6)</Option>
                                </Select>
                            </Col>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>默认值：</label>
                                <Input size="large" value={this.props.defaultData.default_value} onChange={this.handleFeatureChange.bind(this,"default_value")} placeholder="请填写默认值"/>
                            </Col>
                        </Row>
                        <Row gutter={128}>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>接口人：</label>
                                <Input size="large" value={this.props.defaultData.responsible_person} onChange={this.handleFeatureChange.bind(this,"responsible_person")} placeholder="请填写接口人"/>
                            </Col>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>源字段名称：</label>
                                <Input size="large" value={this.props.defaultData.source_field}  onChange={this.handleFeatureChange.bind(this,"source_field")} placeholder="请填写源字段名称"/>
                            </Col>
                        </Row>
                        <Row gutter={128}>
                            <Col span={10}>
                                <label className="control-label"><span className="xing">*</span>特征类别：</label>
                                <Select 
                                    size="large" 
                                    showSearch 
                                    style={{width:"100%"}}
                                    onChange = {this.handleCategoryChange.bind(this)}
                                    value = { this.props.defaultData.category || this.state.default_category_value}
                                    filterOption={(input, option) => option.props.text.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    optionFilterProp="children"
                                    placeholder="请选择特征类别"
                                >
                                    {this.state.category_data.map((item,index)=>{
                                        return (
                                            <Option key={index} value={item.key} text={item.value}>{item.value}</Option>
                                        )
                                    })}
                                </Select>
                            </Col>
                            <Col span={10}>
                               <ThemeSelect theme_data={this.state.theme_data} default_theme_value={this.props.defaultData.theme || this.state.default_theme_value} handleThemeChange={this.handleThemeChange.bind(this)}/>
                            </Col>
                            
                                <span className="theme-info" style={{color: "#dc5c35",padding:0,position:"relative",top:27}}>请参照 <a style={{color:"#2ea1ff"}} target="_blank" href="http://bigdata.xiaojukeji.com/bigdata-tagsystem/tag-search.html">标签仓库</a> 选择</span>

                        </Row>
                        <Row>
                            <Col span={20}>
                                <label className="control-label"><span className="xing">*</span>解释：</label>
                                <Input type="textarea" value={this.props.defaultData.explanation} onChange={this.handleFeatureChange.bind(this,"explanation")} placeholder="请填写特征的解释说明，如wiki链接等" autosize={{ minRows: 3, maxRows: 6 }} style={{width:"98%"}}/>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={20}>
                                <label className="control-label"><span className="xing">*</span>备注：</label>
                                <Input type="textarea" value={this.props.defaultData.comments} onChange={this.handleFeatureChange.bind(this,"comments")} placeholder="请填写对特征的备注说明" autosize={{ minRows: 3, maxRows: 6 }} style={{width:"98%"}}/>
                            </Col>
                        </Row>
                        
                    </div>
                </div>
            </div>
        )
    }
    userChange(e){
        this.setState({
            user_type:e.target.value
        },function () {
            const gulf =  {name:"专车",value:1}
            const taxi =  {name:"出租车",value:2}
            const fast = {name:"快车",value:-1}
            const all = {name:"全局",value:0}
            const share_car = {name:"顺风车",value:5}
            const big_bus =  {name:"大巴",value:7}
            const hire_driving =  {name:"代驾",value:3}
            const you_share =  {name:"优享",value:6}
            const sofa =  {name:"sofa",value:4}
            const wave =  {name:"海浪",value:9}
            const lux = {name:"豪华车",value:8}
            const ren_uber = {name:"人民优步",value:10}
            const you_uber =  {name:"优选轿车",value:-10}
            switch(this.state.user_type){
                //设置本组件的状态成功后，再设置父组件的state，保证business)type的刷新
                case "1":
                    this.setState({business_type_arr:[all,fast,gulf,taxi,you_share,share_car,big_bus,hire_driving,sofa,wave,lux],default_business_value:"0"},function(){
                        console.log(this.state.default_business_value)
                        this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                        this.getCategory("passenger")
                        
                    })
                    break;
                case "2":
                    this.setState(
                        {
                            business_type_arr:[gulf,fast,ren_uber,you_uber],
                            default_business_value:"1"
                        },
                        function(){
                            this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                            this.getCategory("driver")
                        
                        })
                    break;
                    
                case "3":
                this.setState(
                    {
                        business_type_arr:[taxi],
                        default_business_value:"2"
                    },function(){
                        this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                        this.getCategory("driver")
                        
                    })
                    break;
                    
                case "4":
                this.setState(
                    {
                        business_type_arr:[hire_driving],
                        default_business_value:"3"
                    },function(){
                        this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                        this.getCategory("driver")
                        
                    })
                    break;
                    
                case "7":
                this.setState(
                    {
                        business_type_arr:[ren_uber,you_uber],
                        default_business_value:"10"}
                        ,function(){
                            this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                        this.getCategory("passenger")
                        
                        })
                    break;
                    
                case "5":
                this.setState(
                    {
                        business_type_arr:[sofa],
                        default_business_value:"4"
                    },function(){
                            this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                            this.getCategory("driver")
                        
                    })
                    break;
                    
                case "6":
                this.setState(
                    {
                        business_type_arr:[share_car],
                        default_business_value:"5"
                    },
                    function(){
                        this.props.handleBusinessFresh(this.state.default_business_value,this.props.index)
                        this.getCategory("driver")
                    })
                    break;              
            }
            this.handleThemeConChange()

        })
        this.handleFeatureChange("user_type",e)
       
        
        // this.props.handleBusinessFresh(this.state.default_business_value, this.props.index)
    }
      
    handleFeatureChange(prop,e){
        //特征变化写入state的方法
        this.props.handleFeatureChange(e,this.props.index,prop)   
    }
    handleFeatureSelect(prop,value){
        //特征select选中写入select的方法
        this.props.handleFeatureSelect(value,this.props.index,prop)
    }
    businessChange = (e)=>{
        this.setState({default_business_value:e.target.value},function(){
            this.handleThemeConChange()

        })
        this.handleFeatureChange("business_type",e)
        //同时调用index的state修改方法。

    }
    attributeChange = (e)=>{
        this.setState({attribute:e.target.value},function(){
            this.handleThemeConChange()

        })
        this.handleFeatureChange("attribute",e)
        //同时调用index的state修改方法。
    }
    handleDeleteFeature = ()=>{
        this.props.handleDeleteFeature(this.props.index)
    }
    handleToggleShow = ()=>{
        this.setState({show:!this.state.show})
    }
    handleThemeConChange = ()=>{
        let _user_type = this.state.user_type
        let _business_type = this.state.default_business_value
        let _attribute = this.state.attribute
        getAjax(`/oceanus/offline_feature/getFeatureThemeFromTagsystem?user_type=${_user_type}&business_type=${_business_type}&attribute=${_attribute}`)
            .then(res=>res.json())
            .then(res=>{
                let mappingData = res.value
                this.setState({
                    theme_data:mappingData,
                    default_theme_value:mappingData.length===0?`N/A`:mappingData[0]
                },function(){
                    this.handleFeatureSelect(`theme`,this.state.default_theme_value)
                })
            })
    }
    handleThemeChange(value){
        this.setState({default_theme_value:value}, function(){ 
            this.handleFeatureSelect("theme",this.state.default_theme_value)
        })  
    }
    handleCategoryChange(value){
        this.setState({default_category_value:value},function(){
            this.handleFeatureSelect("category",this.state.default_category_value)
        })
    }
    getCategory(type){
        getAjax(`/oceanus/offline_feature/getCategoryMapping?category_type=${type}`).then(res=>res.json()).then(res=>{
            let mappingData = []
            let resData = res.value
            for(let key in resData){
                let obj = {}
                obj.key = key
                obj.value = resData[key]
                mappingData.push(obj) 
            }
            this.setState({
                            category_data:mappingData,
                            default_category_value:mappingData[0].key
                        },function(){
                            this.handleFeatureSelect("category",this.state.default_category_value)
                        })
            
        })
    }
}