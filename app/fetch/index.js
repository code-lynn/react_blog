import 'whatwg-fetch'; //兼容fetch
import 'es6-promise';//兼容es6promise
import $ from 'jquery';
import {message} from 'antd';

export function getAjax(url) {
    return fetch(url,{
        'Accept':'application/json',
        'credentials': "include"  ///带cookie
    }); //接收的数据类型是json数据
}
export function postAjax(url,data){
    // console.log('发送',data);
    let bodyData = '';
    for(let name in data){
        let valueIn = data[name];
        if(typeof data[name] == 'object'){
            valueIn = JSON.stringify(data[name]);
        }
        bodyData+='&'+name + '='+valueIn;
    }
    let sendData = bodyData.substring(1,)||'';
    console.log('fasong',sendData);
    return fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept':'application/json',
        },
        body: sendData
    })
}
export function getAjaxFrom(url,data,fromName,fnSuc){
    let fd=new FormData();
    fd.append(fromName,JSON.stringify(data));
    $.ajax({
        type: 'GET',
        url: url,
        data: fd,
        dataType:'json',
        cache : false,
        processData : false,
        contentType : false,
        success: function (res) {
            if (res.error) {
                message.error(res.error)
            }else{
                fnSuc(res);
            }
        }
    })

}
export function postAjaxFrom(url,data,fromName,fnSuc){
    let fd=new FormData();
    fd.append(fromName,JSON.stringify(data));
    $.ajax({
        type: 'POST',
        url: url,
        data: fd,
        dataType:'json',
        cache : false,
        processData : false,
        contentType : false,
        success: function (res) {
            if (res.error) {
                message.error(res.error)
            }else{
                fnSuc(res);
            }
        }
    })

}


