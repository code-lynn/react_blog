import React,{Component} from 'react';
import './index.less';
import {getAjax,postAjax} from '../../../fetch';
import {findInArr} from '../../../methods';
import { Tree, Input,message,Icon } from 'antd';
const TreeNode = Tree.TreeNode;
import { is,Map } from 'immutable';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import EditorFeatureFormGroup from './EditorFeature';

export default class ManageFea extends Component{
    constructor(props) {
        super(props);
        this.columns = [
            {
                title: '名称',
                dataIndex: 'name',
                width: '15%',
                sorter: (a, b) => {
                    return a.name - b.name
                },
            }, {
                title: '逻辑名称',
                dataIndex: 'logical_name',
                width: '15%',
                sorter: (a, b) => {
                    return a.logical_name.localeCompare(b.logical_name)
                }
            }, {
                title: '数据类型',
                dataIndex: 'data_type',
                width: '20%'
            }, {
                title: '场景',
                dataIndex: 'scenario',
                width: '15%',
                render: (text,item,i) => {
                    let index = 0;
                    if(item.scenario[0]){
                        item.scenario.forEach((val,i)=>{
                            index+=parseInt(val)
                        })
                    }else{
                        index=item.scenario;
                    };
                    const Scenario = ['未知', '冒泡', '分单', '冒泡、分单', '常规', '冒泡、常规', '分单、常规', '冒泡、分单、常规'];
                    return (<span>
                        {Scenario[index]}
                </span>)
                }
            }, {
                title: '状态',
                dataIndex: 'status',
                width: '15%',
                render: (text,item,i) => {
                    return (<span>
                        {item.status===0?<Icon type="check" className="didi-green" />:<Icon type="cross"  className="didi-red" />}
                </span>)
                }
            }, {
                title: '操作',
                dataIndex: 'create',
                width: '15%',
                render: (text,item,i) => {
                    let it_edtior = <a href="javascript:;" className="public-table-btn-modify" onClick={this.handleClickEditor.bind(this,item)}>编辑</a>;
                    return (<span>
                        {it_edtior}
                </span>)
                },
            }
        ];
        this.state = {
            treeData:[],
            searchValue:[],
            parentTree:[],
            ////点击二级数据
            secondData:'',
            ////是否处于搜索
            searchBFlag:false,
            searchData:[],
            ///表格数据源
            dataSource: [],
            tableData:{
                pagination:{
                    total:0,
                    current:1,
                    pageSize:10
                },
                loading:false,
                handleTableChange:this.handleTableChange.bind(this)
            },
            ///x修改弹窗
            visibleModal:false,
            item:{},
            ticker:0,
            ///弹窗里面的类别
            categoryArrInit:[]

        };
        ///弹窗里面的表明
        this.tableNameArr = [];
        this.scenarioArr = ['未知', '冒泡', '分单', '冒泡、分单', '常规', '冒泡、常规', '分单、常规', '冒泡、分单、常规'];

    }
    render() {
        console.log('UploadFeature');
        return (
            <div className="manage_feature_hold_content">
                <div style={{"width":"250px"}}>
                    <div className="manage_feature_searchBox">
                        <Input placeholder="请输入搜索指标" onChange={this.searchChange.bind(this)} />
                        {this.state.searchBFlag?(<ul>
                            {this.state.searchData.length>0?(this.state.searchData.map((item,i)=>{
                                return <li onClick={this.handleClickSearchItem.bind(this,item)} key={item.id}>{item.logical_name}</li>

                            })):(<li>没有搜索结果</li>)}
                        </ul>):''}
                    </div>
                    <Tree expandedKeys={this.state.parentTree} onExpand={this.onExpand.bind(this)} onSelect={this.onSelect.bind(this)} selectedKeys={this.state.searchValue} >
                        {this.getDataTree(this.state.treeData)}
                    </Tree>

                </div>
                <div style={{"flex":"1","paddingLeft":"20px"}}>
                    <AllDataTable tableData={this.state.tableData} columns={this.columns} rowKey={record => record.feature_id?record.feature_id:record.id}  dataSource={this.state.dataSource}/>
                </div>

                <EditorFeatureFormGroup visibleModal={this.state.visibleModal} item={this.state.item} handleSubmit={this.handleSubmit.bind(this)} handleViewCancel={this.handleViewCancel.bind(this)} tableNameArr={this.tableNameArr} categoryArrInit={this.state.categoryArrInit} ticker={this.state.ticker} handleDeleteItem={this.handleDeleteItem.bind(this)} />

            </div>
        );
    }
    componentDidMount() {
        let _this = this;
        ////点击隐藏搜索信息
        document.onclick = function () {
            _this.setState({
                searchData:[],
                searchBFlag:false
            })
        };
        ////获取初始信息
        getAjax('/oceanus/manage_feature/featureTableMenu?get_second=1').then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                _this.setState({
                    treeData:_this.modityData(data.value)
                });
            }else{
                message.error('获取数据错误');
            }

        });
        ////获取弹窗类别初始信息
        getAjax('/oceanus/manage_feature/getMenuFeatureData').then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                _this.setState({
                    categoryArrInit:data.value
                });
            }else{
                message.error('获取数据错误');
            }

        });
        ///获取初始数据
        this.changePage(1,this.state.searchValue);
    }
    ///修改树形控件的数据
    modityData(arr){
        let arrData = [];
        arr.forEach(item=>{
            let json = {};
            for(let name in item){
                json.key = name;
                json.children = item[name].map((val)=>{

                    this.tableNameArr.push(name+'.'+val)
                    return {key:val}
                })
            };
            arrData.push(json);
        })
        return arrData;
    }
    ///整合树形控件的数据
    getDataTree=(arr,parentKey)=>{
        let _this = this;
         return arr.map((item,i) => {
            const title = <span>{item.key}</span>;
            const key = parentKey?parentKey+'>>'+item.key:item.key;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title}>
                        {_this.getDataTree(item.children,item.key)}
                    </TreeNode>
                );
            }else{
                return <TreeNode key={key} title={title} />;
            }

        })

    }
    ///展开节点
    onExpand(node, expanded, expandedKeys){
        this.setState({
            parentTree:node
        });
        console.log(node, expanded, expandedKeys);
    }
    ///点击数里面的节点
    onSelect(node, expanded, expandedKeys){
        if(node.length>0){
            if(node[0].indexOf('>')>-1){
                this.changePage(1,node)
            } 
        }
        console.log(node, expanded, expandedKeys);
    }
    ///搜索
    searchChange(e){
        console.log(e.target.value);
        let content = e.target.value;
        clearTimeout(this.timer);
        this.timer = setTimeout(()=>{
            getAjax('/oceanus/feature_view/searchFeature?has_group=1&search='+content).then(res=>res.json()).then(data=>{
                if(data.status == 'success'){
                   this.setState({
                       searchData:data.value,
                       searchBFlag:true
                   });
                }else{
                    message.error('获取数据错误');
                }

            });
        },100);
    }
    ////点击搜索的结果
    handleClickSearchItem(item){
        let searchValue = [item.table_name.replace('.','>>')];
        let parentTree = [ item.table_name.split('.')[0]];
        console.log(item);
        this.setState({
            searchBFlag:false,
            searchValue,
            parentTree,
            dataSource:[item],
            tableData:{
                pagination:{
                    total:1,
                    current:1,
                    pageSize:15
                },
                loading:false,
                ///改变分页回调
                handleTableChange:this.handleTableChange.bind(this),
            }
        });
    }
    ////获取第一页的数据
    changePage(num,searchValue){
        let tableData1 = Map(this.state.tableData);
        let tableData2 = tableData1.set('loading',true);
        this.setState({
            tableData:tableData2.toJS()
        });
        if(!searchValue[0]){
            this.setState({
                dataSource:[],
                tableData:{
                    pagination:{
                        total:0,
                        current:1,
                        pageSize:15
                    },
                    loading:false,
                    handleTableChange:this.handleTableChange.bind(this)
                },
            });
            return;
        };
        getAjax('/oceanus/manage_feature/getFeatureByTableName?page='+num+'&size=10000&table_name='+searchValue[0].replace('>>','.')).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                data.value.forEach((ite)=>{console.log(ite.category)});
                this.setState({
                    dataSource:data.value,
                    searchValue,
                    tableData:{
                        pagination:{
                            total:data.count,
                            current:1,
                            pageSize:15
                        },
                        loading:false,
                        handleTableChange:this.handleTableChange.bind(this)
                    },
                })
            }else{
                message.error('获取数据错误');
            }

        });
    }
    ///分页回调
    handleTableChange(page,pageSize){
        this.setState({
            tableData:{
                pagination:page,
                loading:false,
                handleTableChange:this.handleTableChange.bind(this)
            },
        })
    }
    ///点击编辑
    handleClickEditor(item){
        console.log(item);
        this.setState({
            visibleModal:true,
            item,
            ticker:1
        });
    }
    ///点击提交修改特征
    handleSubmit(val){
        console.log(val);
        let data = JSON.parse(JSON.stringify(val));
        let arr = [];
        data.scenario.forEach((item,i)=>{
            arr.push(parseInt(findInArr(this.scenarioArr,item)));
        });
        data.scenario = arr;
        let category = '';
        let firstArr = this.state.categoryArrInit;
        let bFlag = true;
        if(data.second_level_category){
            for(let i=0; i<firstArr.length; i++){
                if(firstArr[i].category == -1){
                    let arrSecond = firstArr[i].second;
                    for(let j=0; j<arrSecond.length; j++){
                        if(arrSecond[j].en_second_class_name === data.second_level_category){
                            category = arrSecond[j].category;
                            bFlag = false;
                            break;
                        }
                    }

                };
                if(!bFlag){
                    break;
                }
            }
        }else{
            for(let i=0; i<firstArr.length; i++){
                if(firstArr[i].category != -1){
                    if(firstArr[i].en_first_class_name === data.first_level_category){
                        category = firstArr[i].category;
                        break;
                    }

                };

            }
        };
        data.category = category;
        data.id = this.state.item.feature_id?this.state.item.feature_id:this.state.item.id;
        delete data.first_level_category;
        delete data.second_level_category;

        let _this = this;
        postAjax('/oceanus/manage_feature/saveFeature',data).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                _this.setState({
                    visibleModal:false,
                    item:{},
                    ticker:0
                });
                message.error('保存成功');
            }else{
                message.error('获取数据错误');
            }

        });



    }
    ///点击弹窗取消后的函数
    handleViewCancel(){
        this.setState({
            visibleModal:false,
            item:{},
            ticker:0
        });
    }
    ///点击删除
    handleDeleteItem(item){
        let data = {};
        data.id = item.feature_id?item.feature_id:item.id;
        let _this = this;
        postAjax('/oceanus/manage_feature/saveFeature',data).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                _this.setState({
                    visibleModal:false,
                    item:{},
                    ticker:0
                });
                message.error('保存成功');
            }else{
                message.error('获取数据错误');
            }

        });
    }

}

