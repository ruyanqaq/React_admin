import React, { Component } from 'react'
import { Redirect, Switch, Route } from 'react-router-dom'


import ProductHome from './home'
import ProductDetail from './detail'
import ProductAddUpdate from './add_update'
import "./index.less"
/* 商品路由 */
export default class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path="/product" exact component={ProductHome} /> {/* 严格模式，路径完全匹配 */}
                <Route path="/product/addupdate" component={ProductAddUpdate} />
                <Route path="/product/detail" component={ProductDetail} />
                <Redirect to="/product" />
            </Switch>
        )
    }
}
