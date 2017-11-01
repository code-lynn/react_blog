import React,{Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Icon,Popover, Button } from 'antd';


class FeatureServiceSidebar extends Component{
    constructor(props){
        super(props);
        this.state = {
            changeSize:'left'
        }

    }
    render(){
        return (
            <div className={`sidebar `+('right'==this.state.changeSize?'active':'')}>
                <div className="changeSize" onClick={this.changeSize.bind(this)}>
                    <Icon type="left" className={'left'==this.state.changeSize?'active':''} />
                    <Icon type="right"  className={'right'==this.state.changeSize?'active':''} />
                </div>
                <ul>
                    <li>
                        <Link to="/feature_service/my_caller" name='my_caller'  className={`ft-color `+('my_caller'==this.props.changeHeader.activeItemSecond ?'active':'')}>
                            <Popover placement="right" content="我的caller" trigger="hover">
                                <Button>
                                    <Icon type="file-text" />
                                </Button>
                            </Popover>
                            <span>我的caller</span>
                        </Link>

                    </li>
                    <li>
                        <Link to="/feature_service/all_caller" name='all_caller'  className={`ft-color `+('all_caller'==this.props.changeHeader.activeItemSecond?'active':'')}>

                            <Popover placement="right" content="所有caller" trigger="hover">
                                <Button>
                                    <Icon type="solution" />
                                </Button>
                            </Popover>
                            <span>所有caller</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/feature_service/my_service" name='myService'  className={`ft-color `+('my_service'==this.props.changeHeader.activeItemSecond || ''==this.props.changeHeader.activeItemSecond ?'active':'')}>

                            <Popover placement="right" content="我的服务" trigger="hover">
                                <Button>
                                    <Icon type="file-text" />
                                </Button>
                            </Popover>
                            <span>我的服务</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/feature_service/all_service" name='allService'  className={`ft-color `+('all_service'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="所有服务" trigger="hover">
                                <Button>
                                    <Icon type="solution" />
                                </Button>
                            </Popover>
                            <span>所有服务</span>
                        </Link>
                    </li>

                    <hr style={{"marginTop":"20px","marginBottom":"20px","border":"0","borderTop":"1px solid #d1dbe5"}}/>

                    <li>
                        <Link to="/feature_service/apply_service" name='applyService'  className={`ft-color `+('apply_service'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="申请服务" trigger="hover">
                                <Button>
                                    <Icon type="check-circle-o" />
                                </Button>
                            </Popover>
                            <span>申请服务</span>
                        </Link>
                    </li>

                </ul>
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
)(FeatureServiceSidebar);