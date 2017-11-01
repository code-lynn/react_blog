import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {configureStore} from './store';
import {setCookie} from './methods';
const store = configureStore({});
import App from './containers';
////设置cookie
(function () {
    ///存入信息得到头部导航和侧边导航的信息
    ///存入信息得到头部导航和侧边导航的信息
    setCookie('caller_role','0',30);
    setCookie('_OMGID','16241f93-261a-444e-96ec-74ace5a5c0cb',30);
    setCookie('omgh5sid','385510768035-1508207915058',30);
    setCookie('username','songyongchao',30);
    setCookie('user_role','2',30);
    setCookie('csrftoken','I0Oa4NoYCyp7r69gKxMg483YKhgk723cpoUtduIaXZXjP7bJU8H7d1gQ5r339CV6',30);

    ///改动 每天更改

    setCookie('sessionid','mjhyuit7sv6mkej0m6la4wfza92paswg',30);
    setCookie('ticket','22f2655c8b7714655ab7667e7fec240a0001110000',30);


})();
import './index.less';
render(
    <Provider  store={store}>
        <App/>
    </Provider>,
    document.getElementById('app')
);
