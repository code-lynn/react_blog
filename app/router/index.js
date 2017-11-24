import React,{Component} from 'react';
import {Router, Route, hashHistory, IndexRoute } from 'react-router';
import Main from '../main';
import Home from '../main/Home';///首页

import HTML_CSS from '../main/HTML_CSS'
import HTML from '../main/HTML_CSS/HTML'
import CSS from '../main/HTML_CSS/CSS'


export default class App extends Component{
    render(){
        return (
            <Router history={hashHistory}>
                <Route path="/" component={Main}>
                    {/*首页*/}
                    <IndexRoute component={Home} />
                    {/*首页*/}
                    <Route path="home" component={Home} />
                    <Route path="html_css" component={HTML_CSS}>
                        <IndexRoute component={HTML} />
                        <Route path="html" component={HTML}/>
                        <Route path="css" component={CSS}/>
                    </Route>

                </Route>
            </Router>
        )
    }
}
