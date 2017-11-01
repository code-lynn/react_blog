/**
 * Created by issuser on 2017/9/26.
 */
import React,{Component} from 'react';
import { is } from 'immutable';
import MyTable from '../../../components/MyTable';
import {RButton} from '../../../components/MyRadio';
import {getAjax,postAjax} from '../../../fetch/index';
import {Modal,Form,Select,Input,Button,message} from 'antd';
const Option = Select.Option;
const confirm = Modal.confirm;
const FormItem = Form.Item;
const { TextArea } = Input;
import './index.less';
// import reqwest from 'reqwest';

export default class ExcellentCase extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
            pagination: {
                current: 1, pageSize: 10, total: 0
            },
            loading: false,
            modalData: {},
            visible:false,//modal
            type:"",//编辑 新增
        }
    }
    componentWillMount(){

    }
    tableFetch(pagination){
        let _this = this;
        let has_all = "1";
        this.setState({ loading: true });
        let query = `/oceanus/index/getLatestRecord?has_all=${has_all}&page=${pagination.current}&size=${pagination.pageSize}`;
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
            modalData:{
                "title":"",
                "content":"",
            },
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
        let _this = this;
        const {pagination} = this.state;
        let post = ()=>{
            let dataPost = {
                id:record.id,
            };
            let query = `/oceanus/index/deleteRecord`;
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
            className:"modal_update_confirm",
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
    //保存
    sourceFetch(dataPost,type){
        let _this = this;
        const {pagination} = this.state;
        let dataType = type == "add"?"saveRecord":"modifyRecord";
        let query = `/oceanus/index/${dataType}`;
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
        const roleObj = {
            "0":"普通用户",
            "1":"管理员",
        };
        const columns = [
            {
                title: '标题',
                dataIndex: 'title',
                //sorter: (a,b)=>a.user_name-b.user_name,
                width: '20%',
                render:(text,record)=>{
                    return(
                        <span>{record.title}</span>
                    )
                }
            },
            {
                title: '发布',
                dataIndex: 'publisher',
                width: '10%',
                render:(text,record)=>{
                    return(
                        <span>{record.publisher}</span>
                    )
                }
            },
            {
                title: '内容',
                dataIndex: 'content',
                width: '50%',
                render:(text,record)=>{
                    return(
                        <span>{record.content}</span>
                    )
                }
            },
            {
                title: '时间',
                dataIndex: 'modify_time',
                width: '12%',
                render:(text,record)=>{
                    return(
                        <span>{record.modify_time.replace("T"," ")}</span>
                    )
                }
            },
            {
                title: '操作',
                width: '8%',
                dataIndex: 'operate',
                onCellClick:(record,e)=>{
                    // console.log(record);
                },
                render:(text,record)=>{
                    return(
                        <span>
                             <span className="public-table-btn-modify" onClick={this.editData.bind(this,record,"edit")}>编辑</span>
                             <span className="public-table-btn-modify" onClick={this.deleteData.bind(this,record,"delete")}>删除</span>
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
            <div className="data_update_content">
                <Button type="primary" onClick={this.addData.bind(this,"add")} className={"data_source_button"}>新增</Button>
                <MyTable
                    columns={columns}
                    rowKey={record => record.id}
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
class UpdateModal extends React.Component {
    state = {
        visible: false,
        modalData:{
            "title":"",
            "content":"",
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
    /*select*/
    roleChange(value){
        // let { modalData } = this.state;
        // modalData.role = value;
        // this.setState({
        //     modalData,
        // })
    }
    //
    afterClose(){
        this.props.form.resetFields();
    }
    //点击保存
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
        /*this.setState({
            modalData: this.props.modalData,
        })*/
    }
    componentDidUpdate(prevProps,prevState){

    }
    render() {
        let {visible} = this.state;
        const { type,modalData } = this.props;
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
                title={type=="add"?"新增":"编辑"}
                width="600px"
                visible={visible}
                wrapClassName="data_update_modal"
                //maskClosable={false}
                footer={false}
                onCancel={this.hideModal}
                //onOk={this.confirmModal.bind(this)}
                //okText="保存" cancelText="取消"
                afterClose={this.afterClose.bind(this)}
            >
                <Form onSubmit={this.handleSubmit.bind(this)}  >
                    <FormItem
                        {...formItemLayout}
                        label="标题"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('title', {
                            rules: [{
                                required: true, message: '请输入标题',
                            }],
                            initialValue:modalData.title?modalData.title:null
                        })(
                            <Input placeholder="请输入用户名" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="内容"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('content', {
                            rules: [{
                                required: true, message: '请输入内容',
                            }],
                            initialValue:modalData.content?modalData.content:null
                        })(
                            <TextArea rows={4} placeholder="请输入内容" />
                        )}
                    </FormItem>
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
const LocalizedModal = Form.create()(UpdateModal);