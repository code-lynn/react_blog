import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {configureStore} from './redux/store';
import {setCookie} from './utils';
const store = configureStore({});
import App from './router';
//设置cookie
(function () {
    setCookie('username','liuyuelin_v',30);

})();
import './index.less';
ReactDOM.render(
    <Provider  store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
