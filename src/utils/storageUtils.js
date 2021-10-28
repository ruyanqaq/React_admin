/*
进行local数据存储管理的工具模块
 */

import store from 'store'

const USER_KEY = 'user_key'

export default {

    /* 保存user */
    saveUser(user) {
        // localStorage.setItem(USER_KEY, JSON.stringify(user))
        store.set(USER_KEY, user)
    },

    /* 读取user */
    getUser() {
        // return JSON.parse(localStorage.getItem(USER_KEY) || '{}')
        return store.get(USER_KEY) || {}
    },

    /* 删除user */
    removeUser() {
        // localStorage.removeItem(USER_KEY)
        store.remove(USER_KEY)
    }
}

/* 
    store.js封装了localstorage，会根据浏览器自动选择使用 localStorage、globalStorage 或者 userData 来实现本地存储功能
    相比于Cookies，web Storage的优势：
        1. 存储空间更大
        2. 存储内容不会发送到服务端，而cookie的内容会随着请求一并发送到服务端
        3. 有更多已封闭的接口
        4. 独立的存储空间，每个域都有独立的存储空间，不会造成数据混乱
*/