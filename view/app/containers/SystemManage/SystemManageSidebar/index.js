import React,{Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Icon,Popover, Button } from 'antd';
import {getCookie} from '../../../methods';

class SystemManageSidebar extends Component{
    constructor(props){
        super(props);
        this.state = {
            changeSize:'left'
        };
        this.user_role = getCookie("user_role");
    }
    render(){
        return (
            <div className={`sidebar `+('right'==this.state.changeSize?'active':'')}>
                <div className="changeSize" onClick={this.changeSize.bind(this)}>
                    <Icon type="left" className={'left'==this.state.changeSize?'active':''} />
                    <Icon type="right"  className={'right'==this.state.changeSize?'active':''} />
                </div>
                {
                    this.user_role =="2"?(
                        <ul>
                            <li>
                                <Link to="/system_manage/data_source_manage" name='data_source_manage'  className={`ft-color `+('data_source_manage'==this.props.changeHeader.activeItemSecond || ''==this.props.changeHeader.activeItemSecond?'active':'')}>
                                    <Popover placement="right" content="数据源管理" trigger="hover">
                                        <Button>
                                            <Icon type="exception" />
                                        </Button>
                                    </Popover>
                                    <span>数据源管理</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/system_manage/admin_manage" name='admin_manage'  className={`ft-color `+('admin_manage'==this.props.changeHeader.activeItemSecond?'active':'')}>
                                    <Popover placement="right" content="权限管理" trigger="hover">
                                        <Button>
                                            <Icon type="lock" />
                                        </Button>
                                    </Popover>
                                    <span>权限管理</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/system_manage/update_manage" name='update_manage'  className={`ft-color `+('update_manage'==this.props.changeHeader.activeItemSecond?'active':'')}>
                                    <Popover placement="right" content="更新管理" trigger="hover">
                                        <Button>
                                            <Icon type="eye-o" />
                                        </Button>
                                    </Popover>
                                    <span>更新管理</span>
                                </Link>
                            </li>
                            <li>
                                <Link to="/system_manage/feature_use" name='feature_use'  className={`ft-color `+('feature_use'==this.props.changeHeader.activeItemSecond?'active':'')}>
                                    <Popover placement="right" content="特征统计" trigger="hover">
                                        <Button>
                                            <Icon type="area-chart" />
                                        </Button>
                                    </Popover>
                                    <span>特征统计</span>
                                </Link>
                            </li>
                        </ul>
                    ):(
                        <ul>
                            <li>
                                <Link to="/system_manage/data_source_manage" name='data_source_manage'  className={`ft-color `+('data_source_manage'==this.props.changeHeader.activeItemSecond || ''==this.props.changeHeader.activeItemSecond?'active':'')}>
                                    <Popover placement="right" content="数据源管理" trigger="hover">
                                        <Button>
                                            <Icon type="exception" />
                                        </Button>
                                    </Popover>
                                    <span>数据源管理</span>
                                </Link>
                            </li>
                        </ul>
                    )
                }

            </div>
        )
    }
    componentDidMount() {

    }
    changeSize(){
        let changeSizeFlag = 'left' == this.state.changeSize?'right':'left';
        this.setState({
            changeSize:changeSizeFlag
        });
    }
}
export default connect(
    state => {
        return {
            //changeHeader会放在this.props上
            changeHeader:state.changeHeader
        }
    },
    dispatch =>{
        return {

        }
    }
    //两个参数  第一个参数是mapStateToProps 获取状态
    //第二个参数 mapActionsToProps 获取action的
)(SystemManageSidebar);