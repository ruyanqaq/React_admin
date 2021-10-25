/* 
    入口文件
*/

import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import React from 'react'

import App from "./App";
import store from './redux/store'
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取本地Local中的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
)