/* 
    应用的根组件
*/
import { Route, Link, Switch } from 'react-router-dom'
import React, { Component } from 'react'
import { Button, message } from 'antd'
import 'antd/dist/antd.css'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {


    render() {
        return (
            <div>
                <Link to="/login">登录</Link> &nbsp;&nbsp;
                <Link to="/admin">管理</Link>
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/admin" component={Admin}></Route>
                </Switch>
            </div>

        )
    }
}
