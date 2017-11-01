/**
 * Created by issuser on 2017/9/26.
 */
import React,{Component} from 'react';
import AllDataTable from '../../../components/MyTable/AllDataTable';
import {getAjax,postAjax} from '../../../fetch/index';
import {Modal,Icon,Input,Table,message} from 'antd';
import './index.less';
// import reqwest from 'reqwest';

export default class ExcellentCase extends Component{
    constructor(props){
        super(props);
        this.state={
            dataSource:[],
            pagination: {
                pageSize: 10, total: 0
            },
            loading: false,
            modalData: {},
        }
    }
    componentWillMount(){

    }
    tableFetch(pagination){
        let _this = this;
        this.setState({ loading: true });
        let query = `/oceanus/feature_extract_publish/getFeatureExtractPublishList?page=1&size=10000`;
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
    handleTableChange = (page,pageSize) => {
        // console.log(page);
        const pagination = { ...this.state.pagination };
        // pagination.current = page;
        this.setState({
            pagination,
        },function () {
            this.tableFetch(pagination);
        });
    };
    componentDidMount(){
        this.tableFetch(this.state.pagination);
    }
    render(){
        const {dataSource,loading,pagination,modalData} = this.state;
        const columns = [
            {
                title: '任务ID',
                dataIndex: 'id',
                // sorter: true,
                sorter: (a, b) => {
                    return a.id - b.id
                },
                width: '10%',
                render:(text,record)=>{
                    return(
                        <span>{record.id}</span>
                    )
                }
            },
            {
                title: '需求名称',
                dataIndex: 'name',
                sorter: (a, b) => {

                    return a.name.localeCompare(b.name);
                },
                width: '20%',
                render:(text,record)=>{
                    return(
                        <span>{record.name}</span>
                    )
                }
            },
            {
                title: '需求人',
                dataIndex: 'applier',
                /*render:(record)=>{
                    return(
                        <span>{record.applier}</span>
                    )
                }*/
            },
            {
                title: '需求人所在部门',
                dataIndex: 'department',
               /* render:(text,record)=>{
                    console.log(record);
                    return(
                        <span>{record.department}</span>
                    )
                }*/
            },
            {
                title: '创建时间',
                sorter: (a,b)=>new Date(a.create_time).getTime() - new Date(b.create_time).getTime(),
                dataIndex: 'create_time',
                /*render:(record)=>{
                    return(
                        <span>{record.create_time}</span>
                    )
                }*/
            },
            {
                title: '配置',
                dataIndex: 'configure',
                onCellClick:(record,e)=>{
                    // console.log(record);
                    this.setState({
                        modalData:record,
                    },function () {
                        this.refs.localizedModal.showModal();
                    })
                },
                render:(record)=>{
                    return(
                        <span className="public-table-btn-modify">查看</span>
                    )
                }
            }
        ];
        const tableData = {
            loading:loading,
            className:"excellent_case_table",
            pagination:{
                total:pagination.total,
                pageSize:pagination.pageSize
            },
            ///改变分页回调
            onPageChange:this.handleTableChange
        };
        return(
            <div className="excellent_case_content">
                <AllDataTable
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={dataSource}
                    tableData={tableData}
                />
                <LocalizedModal
                    ref={"localizedModal"}
                    modalData={modalData}
                />
            </div>
        )
    }
}
/*modal*/
class LocalizedModal extends React.Component {
    state = {
        visible: false,
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
            /*this.setState({
                itemData: props.modalData[0],
            })*/
        }
    }
    componentDidMount(){
        // console.log(456465);
    }
    componentDidUpdate(prevProps,prevState){

    }
    render() {
        const { TextArea } = Input;
        let {modalData} = this.props;
        // console.log(modalData);
        return (
            <div>
                <Modal
                    title={"查看"}
                    width="600px"
                    visible={this.state.visible}
                    wrapClassName="excellent_case_modal"
                    onCancel={this.hideModal}
                    footer={false}
                >
                   <div className="excellent_modal_inputBox">
                       <div className="excellent_modal_sspan">
                           <span>背景:</span>
                       </div>
                       <div className="excellent_modal_tspan">
                           <span>{modalData.background}</span>
                       </div>
                   </div>
                    <div className="excellent_modal_inputBox">
                        <div className="excellent_modal_sspan">
                            <span>现状:</span>
                        </div>
                        <div className="excellent_modal_tspan">
                            <span>{modalData.current_situation}</span>
                        </div>
                    </div>
                    <div className="excellent_modal_inputBox">
                        <div className="excellent_modal_sspan">
                            <span>预期收益:</span>
                        </div>
                        <div className="excellent_modal_tspan">
                            <span>{modalData.expect_gain}</span>
                        </div>
                    </div>
                </Modal>
            </div>
        );
    }
}