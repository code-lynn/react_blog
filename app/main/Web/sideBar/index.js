/**
 * Created by dalyn on 2017/11/22.
 */
import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {Icon,Popover, Button } from 'antd';

class SideBar extends React.Component{
    constructor(props,context){
        super(props);
        this.state={
            changeSize:'left',
        };
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
                        <Link to="/web/html" name='html'
                              className={`ft-color `+('html'==this.props.changeHeader.activeItemSecond
                              || ''==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="HTML" trigger="hover">
                                <Button>
                                    <Icon type="file-text" />
                                </Button>
                            </Popover>
                            <span>HTML</span>
                        </Link>

                    </li>
                    <li className={'css'==this.props.changeHeader.activeItemSecond?'active':''}>
                        <Link to="/web/css" name='css'
                              className={`ft-color `+('css'==this.props.changeHeader.activeItemSecond?'active':'')}>
                            <Popover placement="right" content="CSS" trigger="hover">
                                <Button>
                                    <Icon type="skin" />
                                </Button>
                            </Popover>
                            <span>CSS</span>
                        </Link>
                    </li>
                    <li className={'javaScript' == this.props.changeHeader.activeItemSecond ? 'active' : ''}>
                        <Link to="/web/javaScript" name='javaScript'
                            className={`ft-color ` + ('javaScript' == this.props.changeHeader.activeItemSecond ? 'active' : '')}>
                            <Popover placement="right" content="javaScript" trigger="hover">
                                <Button>
                                    <Icon type="code" />
                                </Button>
                            </Popover>
                            <span>javaScript</span>
                        </Link>
                    </li>
                    <hr style={{ "marginTop": "20px", "marginBottom": "20px", "border": "0", "borderTop": "1px solid #d1dbe5" }} />
                     <li className={'react' == this.props.changeHeader.activeItemSecond ? 'active' : ''}>
                        <Link to="/web/react" name='react'
                            className={`ft-color ` + ('react' == this.props.changeHeader.activeItemSecond ? 'active' : '')}>
                            <Popover placement="right" content="react" trigger="hover">
                                <Button>
                                    <Icon type="trademark" />
                                </Button>
                            </Popover>
                            <span>React</span>
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
)(SideBar);