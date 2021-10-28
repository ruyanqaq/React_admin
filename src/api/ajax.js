/*
能发送异步ajax请求的函数模块
封装axios库
函数的返回值是promise对象
1. 优化1: 统一处理请求异常?
    在外层包一个自己创建的promise对象
    在请求出错时, 不reject(error), 而是显示错误提示
2. 优化2: 异步得到不是reponse, 而是response.data
   在请求成功resolve时: resolve(response.data)
 */

import axios from 'axios'
import { message } from 'antd'

export default function ajax(url, data = {}, type = "GET") {

    /*  if(type === "GET") {
         return axios.get(url,{
             params:data
         })
     } else{
         return axios.post(url, data)
     }  */
    return new Promise((resolve, reject) => {
        let promise
        //1.执行异步ajax请求
        if (type === 'GET') {
            //发get请求
            promise = axios.get(url, {//配置对象
                params: data // 指定请求参数
            })
        } else {//发post请求
            promise = axios.post(url,
                data
            )
        }
        //2.如果成功,调用resolve
        promise.then(response => {
            //console.log(response)
            resolve(response.data)
            //3.如果失败,调用reject 
        }).catch(error => {
            //reject(error)
            message.error('请求出错了:' + error.message)
        })

    })
}

/* //请求登录接口
ajax('/login', {usernaem:'Tom',password:'123456'},'POST')
//添加用户
ajax('/manage/user/add', {usernaem:'Tom',password:'123456', phone:'187****0227'},'POST') */