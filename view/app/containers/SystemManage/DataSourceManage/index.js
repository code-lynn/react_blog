/**
 * Created by issuser on 2017/9/26.
 */
import React,{Component} from 'react';
import { is } from 'immutable';
import MyTable from '../../../components/MyTable';
import {RButton} from '../../../components/MyRadio';
import {getAjax,postAjax} from '../../../fetch/index';
import {Modal,Form,Icon,Input,Button,message} from 'antd';
const confirm = Modal.confirm;
const FormItem = Form.Item;
import './index.less';
// import reqwest from 'reqwest';

export default class DataSourceManage extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
            pagination: {
                current: 1, pageSize: 10, total: 0
            },
            loading: false,
            modalData: {},//modal数据
            visible:false,//modal
            type:"",//编辑 新增
        };
    }
    componentWillMount(){

    }
    tableFetch(pagination){
        let _this = this;
        this.setState({ loading: true });
        let query = `/oceanus/manage_data_source/getDataSource?page=${pagination.current}&size=${pagination.pageSize}`;
        getAjax(query).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success' && data.value && data.value.length>0) {
                const pagination = { ...this.state.pagination };
                // Read total count from server
                // pagination.total = data.totalCount;
                pagination.total = data.count;
                _this.setState({
                    dataSource: data.value,
                    loading:false,
                    pagination,
                })
            }else {
                _this.setState({
                    loading:false,
                });
                message.warning("无数据！")
            }
        });
    }
    //页码
    handleTableChange = (page,pageSize) => {
        // console.log(page);
        const pagination = { ...this.state.pagination };
        pagination.current = page;
        this.setState({
            pagination,
        },function () {
            this.tableFetch(pagination);
        });
    };
    //关闭modal
    hideModal = () => {
        this.setState({
            visible: false,
        });
    };
    //添加
    addData(type){
        this.setState({
            modalData:{},
            visible:true,
            type:type,
        })
    }
    //编辑
    editData(record,type){
        this.setState({
            modalData:record,
            visible:true,
            type:type,
        })
    }
    //删除
    deleteData(record,type){
        let {pagination} = this.state;
        let post = ()=>{
            let _this = this;
            let dataPost = {
                id:record.id,
            };
            let query = `/oceanus/manage_data_source/delDataSource`;
            postAjax(query,dataPost).then(res => res.json()).then(data => {
                // console.log(data);
                if (data.status == 'success') {
                    message.success("删除成功！");
                    _this.tableFetch(pagination);
                }else {
                    message.warning("删除失败！")
                }
            });
        };
        confirm({
            title: '提示',
            className:"modal_confirm",
            content: '确定要删除么？',
            onOk() {
                // console.log('OK');
                post();
            },
            onCancel() {
                // console.log('Cancel');
            },
        });
    }
    //恢复
    recoverData(record,type){
        let _this = this;
        let {pagination} = this.state;
        let dataPost = {
            id:record.id,
        };
        let query = `/oceanus/manage_data_source/recoverDataSource`;
        postAjax(query,dataPost).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
                message.success("恢复成功！");
                _this.tableFetch(pagination);
            }else {
                message.warning("恢复失败！")
            }
        });
    }
    //点击modal保存
    sourceFetch(dataPost,type){
        let _this = this;
        const {pagination} = this.state;
        let dataType = type == "add"?"createDataSource":"editDataSource";
        let query = `/oceanus/manage_data_source/${dataType}`;
        postAjax(query,dataPost).then(res => res.json()).then(data => {
            // console.log(data);
            if (data.status == 'success') {
                _this.setState({
                    visible:false,
                },function () {
                    message.success("保存成功！");
                    _this.tableFetch(pagination);
                })
            }else {
                message.warning("保存失败！");
            }
        });
    }
    componentDidMount(){
        this.tableFetch(this.state.pagination);
    }
    render(){
        const {dataSource,loading,pagination,modalData,visible,type} = this.state;
        const columns = [
            {
                title: 'hive表',
                dataIndex: 'hive_table',
                sorter: (a,b)=>a.hive_table-b.hive_table,
                // width: '10%',
                render:(text,record)=>{
                    return(
                        <span>{record.hive_table}</span>
                    )
                }
            },
            {
                title: '别名',
                dataIndex: 'alias',
                sorter: (a, b) => {
                    return a.alias - b.alias
                },
                width: '20%',
                render:(text,record)=>{
                    return(
                        <span>{record.alias}</span>
                    )
                }
            },
            {
                title: '逻辑表',
                dataIndex: 'logic_table',
                // sorter: true,
                sorter: (a,b)=>a.logic_table-b.logic_table,
                // width: '10%',
                render:(text,record)=>{
                    return(
                        <span>{record.logic_table}</span>
                    )
                }
            },
            {
                title: '操作',
                dataIndex: 'operate',
                onCellClick:(record,e)=>{
                    // console.log(record);
                },
                render:(text,record)=>{
                    return record.status == "0"?(
                            <span>
                                 <span className="public-table-btn-modify" onClick={this.editData.bind(this,record,"edit")}>编辑</span>
                                 <span className="public-table-btn-modify" onClick={this.deleteData.bind(this,record,"delete")}>删除</span>
                            </span>
                        ):(
                            <span>
                                 <span className="public-table-btn-modify" style={{"color":"#5e6971"}} onClick={this.recoverData.bind(this,record,"recover")}>恢复</span>
                            </span>
                        )
                }
            }
        ];
        const tableData = {
            loading:loading,
            className:"excellent_case_table",
            pagination:{
                total:pagination.total,
                current:pagination.current,
                pageSize:pagination.pageSize
            },
            ///改变分页回调
            onPageChange:this.handleTableChange
        };
        // console.log(modalData);
        return(
            <div className="data_source_content">
                <Button type="primary" onClick={this.addData.bind(this,"add")} className={"data_source_button"}>新增</Button>
                <MyTable
                    columns={columns}
                    rowKey={record => record.id+""+record.status}
                    dataSource={dataSource}
                    tableData={tableData}
                />
                <LocalizedModal
                    ref={"localizedModal"}
                    hideModal={this.hideModal.bind(this)}
                    modalData={JSON.parse(JSON.stringify(modalData))}
                    sourceFetch={this.sourceFetch.bind(this)}
                    visible = {visible}
                    type = {type}
                />
            </div>
        )
    }
}
/*modal*/
class sourceModal extends React.Component {
    state = {
        visible: false,
        modalData:{
            "primary_key":"",
            "extra_key":"",
            "hive_table":"",
            "logic_table":"",
            "path":"",
            "back_days":"",
        },
    };
    showModal = (type) => {
        this.setState({
            visible: true,
            type:type,
        });
    };
    hideModal = () => {
        this.props.hideModal();
    };
    componentWillReceiveProps(props) {
        if (props) {
            this.setState({
                visible: props.visible,
            })
        }
    }
    afterClose(){
        // this.props.form.setFieldsValue({
        //     primary_key:"",
        // })
        this.props.form.resetFields();
    }
    //保存
    handleSubmit(e){
        e.preventDefault();
        let _this = this;
        let {type,modalData} = this.props;
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if(type == "edit"){
                    values.id = modalData.id;
                }
                _this.props.sourceFetch(values,type)
            }
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
        const {type,modalData} = this.props;
        /*if(type == "edit"){
            this.props.form.setFieldsValue({
                primary_key:modalData.primary_key,
                extra_key:modalData.extra_key,
                hive_table:modalData.hive_table,
                logic_table:modalData.logic_table,
                path:modalData.path,
                back_days:modalData.back_days,
            })
        }else {
            this.props.form.setFieldsValue({
                primary_key:"",
                extra_key:"",
                hive_table:"",
                logic_table:"",
                path:"",
            })
        }*/
    }
    render() {
        let {visible} = this.state;
        let {modalData,type} = this.props;
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
        // console.log(type);
        // console.log(modalData);
        return (
            <Modal
                title={type=="add"?"增加":"编辑"}
                width="600px"
                visible={visible}
                wrapClassName="data_source_modal"
                //maskClosable={false}
                onCancel={this.hideModal}
                footer={false}
                //onOk={this.confirmModal.bind(this)}
                //okText="保存" cancelText="取消"
                afterClose={this.afterClose.bind(this)}
            >
                <Form onSubmit={this.handleSubmit.bind(this)}  >
                    <FormItem
                        {...formItemLayout}
                        label="主键"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('primary_key', {
                            rules: [{
                                required: true, message: '请输入主键',
                            }],
                            initialValue:modalData.primary_key?modalData.primary_key:null
                        })(
                            <Input placeholder="请输入主键" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="外键"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('extra_key', {
                            rules: [{
                                required: true, message: '请输入外键',
                            }],
                            initialValue:modalData.extra_key?modalData.extra_key:null
                        })(
                            <Input placeholder="请输入外键" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="hive表"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('hive_table', {
                            rules: [{
                                required: true, message: '请输入hive表',
                            }],
                            initialValue:modalData.hive_table?modalData.hive_table:null
                        })(
                            <Input placeholder="请输入hive表" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="逻辑表"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('logic_table', {
                            rules: [{
                                required: true, message: '请输入逻辑表',
                            }],
                            initialValue:modalData.logic_table?modalData.logic_table:null
                        })(
                            <Input placeholder="请输入逻辑表" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="路径"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('path', {
                            rules: [{
                                required: true, message: '请输入路径',
                            }],
                            initialValue:modalData.path?modalData.path:null
                        })(
                            <Input placeholder="请输入路径" />
                        )}
                    </FormItem>
                    {
                        type == "edit" && (
                            <FormItem
                                {...formItemLayout}
                                label="回溯天数"
                                hasFeedback={true}
                            >
                                {getFieldDecorator('back_days', {
                                    rules: [{
                                        required: true, message: '请输入回溯天数',
                                    }],
                                    initialValue:modalData.back_days?modalData.back_days:null
                                })(
                                    <Input placeholder="请输入回溯天数" />
                                )}
                            </FormItem>
                        )
                    }
                    <div style={{"textAlign":"center"}}>
                        <Button type="primary" ref="submitBtn" htmlType="submit" className="login-form-button"  >
                            保存
                        </Button>
                    </div>
                </Form>
            </Modal>
        );
    }
}
const LocalizedModal = Form.create()(sourceModal);