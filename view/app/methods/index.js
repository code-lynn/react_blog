export function getAd() {
    return get('/growth-tool/tag_ut');
}
//获取列表的接口
export function getList(city,page) {
    return get('/api/list/'+city+'/'+page);
}

/*
 *
 * setCookie  name是字段  value是值   days是天数
 *
 * */
export function setCookie(name,value,days) {
    let d = new Date();
    d.setTime(d.getTime() + (days * 24 * 3600 * 1000));
    let expires = "path=/;expires=" + d.toUTCString();
    document.cookie = name + "=" + value + "; " + expires;
};
/*
 *
 * getCookie  name是字段  返回一个取到的value值
 *
 * */
export function getCookie(name) {
    let reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)"),
        r = document.cookie.match(reg);
    return r ? decodeURIComponent(r[2]) : null;
};
/*
 *
 * removeCookie  name是字段   删除这个cookie
 *
 * */
export function removeCookie(name) {
    setCookie(name,null,-1);
};
/*
 *
 * setLocalItem  name是字段   value是值
 *
 * */
export function setLocalItem(name,value) {
    localStorage.setItem(name, value);
};
/*
 *
 * getLocalItem  name是字段
 *
 * */
export function getLocalItem(name) {
    return localStorage.getItem(name)||null;
};
/*
 *
 * removeLocalItem  name是字段
 *
 * */
export function removeLocalItem(name) {
    localStorage.removeItem(name);
};
/*
 *
 * setSessionItem  name是字段   value是值
 *
 * */
export function setSessionItem(name,value) {
    sessionStorage.setItem(name, value);
};
/*
 *
 * getSessionItem  name是字段
 *
 * */
export function getSessionItem(name) {
    return sessionStorage.getItem(name)||null;
};
/*
 *
 * removeSessionItem  name是字段
 *
 * */
export function removeSessionItem(name) {
    sessionStorage.removeItem(name);
};
/*
 *
 * getStyle  obj是元素   attr是他的属性名字  例如width  返回一个样式值
 *
 * */
export function getStyle(obj,attr) {
    if(obj.currentStyle) {
        return obj.currentStyle[attr];
    }else{
        return getComputedStyle(obj, false)[attr];
    }
};
/*
 *
 * getPos  获取一个元素到页面最顶部的距离和页面最左边的距离   top&&left
 * 返回一个json   {left,top}
 *
 * */
export function getPos(obj) {
    let left = obj.offsetLeft;
    let top = obj.offsetTop;
    let current = obj.offsetParent;
    while(current){
        left+=current.offsetLeft;
        top+=current.offsetTop;
        current = current.offsetParent;
    }
    return {left:left,top:top}
};
/*
 *
 * findInArr  查找一个元素是否在数组中 如果在数组中返回时true  否则返回false
 *
 *
 * */

export function findInArr(arr,num) {
    for(let i=0; i<arr.length; i++){
        if(arr[i] == num){
            return i+'';
        }
    }
    return false;
};
/*
 *
 * 补零  如果小于10  =》08  字符串
 *
 *
 * */

export function toDouble(num) {
    let strNum = '';
    num<10?strNum='0'+num:strNum=num+'';
    return strNum;
};

/*
 *
 *一个数字转成千位   10000=》10,000
 *
 *
 * */
export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
};
/*
 *
 *str '2017-07-05' 相差少几天天 例如传1  返回2017-07-04
 *
 *
 * */

export function showTimeLength(str,num){
    let  dd = new Date(new Date(str).getTime() - num*86400000);
    let strDate=dd.getFullYear()+'-'+(dd.getMonth()+1)+'-'+dd.getDate();
    let arr = strDate.split('-');
    arr = arr.map(function (item,i) {
        if(i>0 && item<10){
            return '0'+item;
        }else{
            return item;
        }
    });
    return arr.join('-');
};
/**
 * 日期转格式 20170625 --> 2017-06-25
 * */
export function formatDate(str){
    ///str  == 20170625
    let arr = str.split('');
    arr.splice(4,0,'-');
    arr.splice(7,0,'-');
    return arr.join(''); ///2017-06-25
};
/**
 * 日期格式化 时间戳 转 2017-06-25
 */

export function dateFormat(time){
    if(time == undefined || time == null ||time == "")return;
    let zero=(n)=>{
        return n = n>0&&n<10 ? "0"+n : n;
    };
    let y = new Date(time).getFullYear();
    let m = new Date(time).getMonth() + 1;
    let d = new Date(time).getDate();
    return zero(y)+"-"+zero(m)+"-"+zero(d)
};