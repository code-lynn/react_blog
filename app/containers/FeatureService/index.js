import React,{Component} from 'react';
import FeatureServiceSidebar from './FeatureServiceSidebar';
export default class FeatureService extends Component{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div className="hold_sidebar">
                <FeatureServiceSidebar/>
                {this.props.children}
            </div>
        );
    }
    componentDidUpdate(){

    }
}

