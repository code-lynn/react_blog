import React,{Component} from 'react';
import FeatureManageSidebar from './FeatureManageSidebar';

export default class FeatureManage extends Component{
    constructor(props) {
        super(props);

    }
    render() {
        console.log('FeatureManage');
        return (
            <div className="hold_sidebar">
                <FeatureManageSidebar/>
                {this.props.children}
            </div>
        );
    }
    componentDidMount() {

    }

}

