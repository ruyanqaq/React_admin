/* 
    应用的根组件
*/
import { Route, Switch } from 'react-router-dom'
import React, { Component } from 'react'
import 'antd/dist/antd.css'
import Login from './pages/login/login'
import Admin from './pages/admin/admin'

export default class App extends Component {

    render() {
        return (
            <Switch>
                <Route path='/login' component={Login} />
                <Route path='' component={Admin} />
            </Switch>

        )
    }
}
