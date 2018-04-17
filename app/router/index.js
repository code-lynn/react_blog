import React,{Component} from 'react';
import {Router, Route, hashHistory, IndexRoute } from 'react-router';
import Main from '../main';
import Home from '../main/Home';///首页

import Web from '../main/Web'
import HTML from '../main/Web/HTML'
import CSS from '../main/Web/CSS'
import JavaScript from '../main/Web/JavaScript'
import React_my from '../main/Web/React'


export default class App extends Component{
    render(){
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Main}>
                    {/*首页*/}
                    <IndexRoute component={Home} />
                    {/*首页*/}
                    <Route path="home" component={Home} />
                    <Route path="web" component={Web}>
                        <IndexRoute component={HTML} />
                        <Route path="html" component={HTML}/>
                        <Route path="css" component={CSS}/>
                        <Route path="javaScript" component={JavaScript}/>
                        <Route path="react" component={React_my}/>
                    </Route>

                </Route>
            </Router>
        )
    }
}
