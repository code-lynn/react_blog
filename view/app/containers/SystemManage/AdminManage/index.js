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
        this.setState({ loading: true });
        let query = `/oceanus/manage_authority/getRoleList?page=${pagination.current}&size=${pagination.pageSize}`;
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
                "user_name":"",
                "group":"",
                "role":"0",
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
                user_id:record.user_id,
            };
            let query = `/oceanus/manage_authority/delRole`;
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
            className:"modal_admin_confirm",
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
        let dataType = type == "add"?"addRole":"editRole";
        let query = `/oceanus/manage_authority/${dataType}`;
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
                title: '用户名',
                dataIndex: 'user_name',
                sorter: (a,b)=>a.user_name-b.user_name,
                // width: '10%',
                render:(text,record)=>{
                    return(
                        <span>{record.user_name}</span>
                    )
                }
            },
            {
                title: '分组',
                dataIndex: 'group',
                sorter: (a, b) => {
                    return a.group - b.group
                },
                width: '20%',
                render:(text,record)=>{
                    return(
                        <span>{record.group}</span>
                    )
                }
            },
            {
                title: '角色',
                dataIndex: 'role',
                sorter: (a,b)=>a.role.localeCompare(b.role),
                // width: '10%',
                render:(text,record)=>{
                    return(
                        <span>{roleObj[record.role]}</span>
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
            <div className="data_admin_content">
                <Button type="primary" onClick={this.addData.bind(this,"add")} className={"data_source_button"}>新增</Button>
                <MyTable
                    columns={columns}
                    rowKey={record => record.user_id}
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
class AdmindModal extends React.Component {
    state = {
        visible: false,
        modalData:{
            "user_name":"",
            "group":"",
            "role":"0",
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
                    values.user_id = modalData.user_id;
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
                wrapClassName="data_admin_modal"
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
                        label="用户名"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('user_name', {
                            rules: [{
                                required: true, message: '请输入用户名',
                            }],
                            initialValue:modalData.user_name?modalData.user_name:null
                        })(
                            <Input placeholder="请输入用户名" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="分组"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('group', {
                            rules: [{
                                required: true, message: '请输入分组',
                            }],
                            initialValue:modalData.group?modalData.group:null
                        })(
                            <Input placeholder="多个组名请以逗号分隔，例如：fe,dm" />
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="角色"
                        hasFeedback={true}
                    >
                        {getFieldDecorator('role', {
                            rules: [{
                                required: true, message: '请输入角色',
                            }],
                            initialValue:modalData.role=="0"||modalData.role?modalData.role+"":null
                        })(
                            <Select
                                style={{ width: "100%" }}
                                className="statistics_box_select"
                                //getPopupContainer={()=>this.refs.box_select}
                                onChange={this.roleChange.bind(this)}
                            >
                                <Option value="0">普通用户</Option>
                                <Option value="1">管理员</Option>
                            </Select>
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
const LocalizedModal = Form.create()(AdmindModal);