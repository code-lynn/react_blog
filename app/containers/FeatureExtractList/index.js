import React,{Component} from 'react';
import FeatureListSidebar from './FeatureListSidebar/';

export default class FeatureExtractList extends Component{
    constructor(props){
        super(props);
    }
    render(){
        return (
            <div className="hold_sidebar">
                <FeatureListSidebar/>
                {this.props.children}
            </div>
        )
    }
    componentDidMount() {

    }
}
