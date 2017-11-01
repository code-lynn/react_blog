import React,{Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Icon,Popover, Button } from 'antd';


class FeatureListSidebar extends Component{
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
                        <Link to="/feature_extract_list/my_task" name='my_task'  className={`ft-color `+('my_task'==this.props.changeHeader.activeItemSecond || ''==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="我的任务" trigger="hover">
                                <Button>
                                    <Icon type="file-text" />
                                </Button>
                            </Popover>
                            <span>我的任务</span>
                        </Link>

                    </li>
                    <li className={'all_task'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/feature_extract_list/all_task" name='my_task'  className={`ft-color `+('all_task'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="全部任务" trigger="hover">
                                <Button>
                                    <Icon type="solution" />
                                </Button>
                            </Popover>
                            <span>全部任务</span>
                        </Link>

                    </li>
                    <li className={'audit_task'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/feature_extract_list/audit_task" name='audit_task'  className={`ft-color `+('audit_task'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="待审核" trigger="hover">
                                <Button>
                                    <Icon type="edit" />
                                </Button>
                            </Popover>
                            <span>待审核</span>
                        </Link>

                    </li>
                    <li className={'excellent_case'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/feature_extract_list/excellent_case" name='excellent_case'  className={`ft-color `+('excellent_case'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="优秀案例" trigger="hover">
                                <Button>
                                    <Icon type="database" />
                                </Button>
                            </Popover>
                            <span>优秀案例</span>
                        </Link>

                    </li>
                    <li className={'feature_statistics'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/feature_extract_list/feature_statistics" name='feature_statistics'  className={`ft-color `+('feature_statistics'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="特征统计" trigger="hover">
                                <Button>
                                    <Icon type="area-chart" />
                                </Button>
                            </Popover>
                            <span>特征统计</span>
                        </Link>
                    </li>

                    <hr style={{"marginTop":"20px","marginBottom":"20px","border":"0","borderTop":"1px solid #d1dbe5"}}/>

                    <li className={'weather_feature'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/feature_extract_list/weather_feature" name='weather_feature'  className={`ft-color `+('weather_feature'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="天气特征" trigger="hover">
                                <Button>
                                    <Icon type="cloud-o" />
                                </Button>
                            </Popover>
                            <span>天气特征</span>
                        </Link>
                    </li>

                    <li className={'selected_feature'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/feature_extract_list/selected_feature" name='selected_feature'  className={`ft-color `+('selected_feature'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="选取特征" trigger="hover">
                                <Button>
                                    <Icon type="check-square-o" />
                                </Button>
                            </Popover>
                            <span>选取特征</span>
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
)(FeatureListSidebar);