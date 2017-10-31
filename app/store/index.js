import reducers from  '../reducers';
import {createStore}  from 'redux';

export function configureStore(initState) {
    //创建store,第一个参数是reducer 第二个是初始状态
    return createStore(reducers,initState,
        //使用reduxTools工具
        //window.devToolsExtension()
    );
}