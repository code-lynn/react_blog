import React,{Component} from 'react';
import SystemManageSidebar from './SystemManageSidebar';

export default class SystemManage extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        console.log('SystemManage');
        return (
            <div className="hold_sidebar">
                <SystemManageSidebar/>
                {this.props.children}
            </div>
        );
    }
    componentDidMount() {

    }

}

