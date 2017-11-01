import React,{Component} from 'react';
import { is } from 'immutable';
import {hashHistory} from 'react-router';
import { postAjax } from '../../../fetch';
import {message} from 'antd';
import './index.less';
import ApplyServiceFormGroup from './ApplyServiceFormGroup';
export default class ApplyService extends Component{
    constructor(props) {
        super(props);
        this.dataId = this.props.params.id?this.props.params.id.substring(1,):'';
    }
    render() {
        ///console.log('ApplyService');
        return (
            <div className="apply_service">
                <ApplyServiceFormGroup dataId={this.dataId} handleSubmit={this.handleSubmit.bind(this)}/>
            </div>
        );
    }
    componentDidMount(){

    }
    handleSubmit(value){
        // console.log('接受',value);
        let data = JSON.parse(JSON.stringify(value));
        ////设置默认的business_type
        if(!data.business_type){
            data.business_type = 1;
        }
        ////设置默认的已选特征
        if(!data.feature_list){
            data.feature_list = '';
        }

        ///console.log('接受',data);

        let url = 'saveNewService';
        if(this.dataId){
            url = 'editServiceById';
            data.id = this.dataId;
        }
        postAjax('/oceanus/feature_service/'+url,data).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                message.success("申请成功");
                let url = `/feature_service/my_service/`;
                hashHistory.push(url);
                ///console.log('success');
            }else{
                message.error(data.message);
            }
        });

    }
    shouldComponentUpdate(nextProps = {}, nextState = {}){
        if(!nextProps){
            nextProps = {}
        }
        if(!nextState){
            nextState = {}
        }
        const thisProps = this.props || {}, thisState = this.state || {};
        if (Object.keys(thisProps).length !== Object.keys(nextProps).length||Object.keys(thisState).length !== Object.keys(nextState).length){
            return true;
        }

        for (const key in nextState) {
            if (thisState[key] !== nextState[key] || !is(thisState[key], nextState[key])) {
                return true;
            }
        }
        return false;
    }
}

