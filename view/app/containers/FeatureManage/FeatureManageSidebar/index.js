import React,{Component} from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {Icon,Popover, Button } from 'antd';


class FeatureManageSidebar extends Component{
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
                        <Link to="/feature_manage/upload_feature" name='upload_feature'  className={`ft-color `+('upload_feature'==this.props.changeHeader.activeItemSecond || ''==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="导入特征" trigger="hover">
                                <Button>
                                    <Icon type="upload" />
                                </Button>
                            </Popover>
                            <span>导入特征</span>
                        </Link>

                    </li>
                    <li>
                        <Link to="/feature_manage/manage_fea" name='manage_fea'  className={`ft-color `+('manage_fea'==this.props.changeHeader.activeItemSecond ?'active':'')}>
                            <Popover placement="right" content="管理特征" trigger="hover">
                                <Button>
                                    <Icon type="solution" />
                                </Button>
                            </Popover>
                            <span>管理特征</span>
                        </Link>

                    </li>
                    <li>
                        <Link to="/feature_manage/feature_ad" name='feature_ad'  className={`ft-color `+('feature_ad'==this.props.changeHeader.activeItemSecond ?'active':'')}>
                            <Popover placement="right" content="特征接入" trigger="hover">
                                <Button>
                                    <Icon type="folder-add" />
                                </Button>
                            </Popover>
                            <span>特征接入</span>
                        </Link>

                    </li>
                    <li>
                        <Link to="/feature_manage/feature_ad_list" name='feature_ad_list'  className={`ft-color `+('feature_ad_list'==this.props.changeHeader.activeItemSecond ?'active':'')}>
                            <Popover placement="right" content="接入数据" trigger="hover">
                                <Button>
                                    <Icon type="database" />
                                </Button>
                            </Popover>
                            <span>接入数据</span>
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
)(FeatureManageSidebar);