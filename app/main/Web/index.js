import React,{Component} from 'react';
import SideBar from "./sideBar"

export default class HTML_CSS extends Component{
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div className="hold_sidebar">
                <SideBar/>
                {this.props.children}
            </div>
        );
    }
    componentDidMount(){

    }
}
