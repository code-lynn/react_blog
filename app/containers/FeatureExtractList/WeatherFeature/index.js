import React,{Component} from 'react';
import { is } from 'immutable';
import {hashHistory} from 'react-router';
import { postAjax } from '../../../fetch';
import {message} from 'antd';
import './index.less';
import WeatherFormGroup from './WeatherFormGroup';
export default class WeatherFeature extends Component{
    constructor(props){
        super(props);
    }

    render(){
       /// console.log('weather');
        return (

            <div className="weather_feature_hold_content">
                <div>
                    <WeatherFormGroup handleSubmit={this.handleSubmit.bind(this)}/>
                </div>
            </div>
        )
    }
    componentDidMount() {

    }
    handleSubmit(value){
        // console.log('接受',value);
        let data = JSON.parse(JSON.stringify(value));
        if(data.model_type == 1){
            data.model_content = data.model_type_new;
            delete  data.model_type_new;
        }else if(data.model_type == 2){
            data.model_content = "";
        }else if(data.model_type == 3){
            data.model_content = data.other_content;
            delete data.other_content
        };
        delete data.isagree;
        ////console.log(data);
        postAjax('/oceanus/feature_extract_weather_request/postRequest',data).then(res=>res.json()).then(data=>{
            if(data.status == 'success'){
                let url = `/feature_extract_list/my_task/`;
                hashHistory.push(url)
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
