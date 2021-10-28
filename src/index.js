/* 
    入口文件
*/

import ReactDOM from "react-dom";
import {BrowserRouter} from 'react-router-dom'
import React from 'react'
import App from "./App";
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取本地Local中的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(
    <BrowserRouter>
        <App/>
    </BrowserRouter>,
    document.getElementById("root"))