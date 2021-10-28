import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {
    Form, Input, Button, Checkbox, message
} from 'antd'
import {
    UserOutlined, LockOutlined
} from "@ant-design/icons"
import "./login.less"
import { reqLogin } from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import logo from "../../assets//images/logo.png"

const Item = Form.Item

export default class Login extends Component {

    onFinish = async values => {
        const { username, password } = values
        const result = await reqLogin(username, password) // {status: 0, data: user}  {status: 1, msg: 'xxx'}
        if (result.status === 0) {
            const user = result.data;
            //登陆成功
            message.success("登陆成功")

            //保存user
            memoryUtils.user = user
            storageUtils.saveUser(user)

            //跳转到管理界面
            this.props.history.replace('/')
        } else {
            //如果失败，分发成功的同步action
            message.error(result.msg)
        }
    }



    /* 对密码自定义验证 */

    validatePwd = (rules, values) => {
        //console.log('validatePwd()', rules, values)
        if (!values) {
            return Promise.reject('密码必须输入')
        } else if (values.length < 4) {
            return Promise.reject('密码长度不能小于4位')
        } else if (values.length > 12) {
            return Promise.reject('密码长度不能大于12位')
        } else {
            return Promise.resolve() // 验证通过
        }
        // callback('xxxx') // 验证失败, 并指定提示的文本
    }


    render() {

        const memoryUser = memoryUtils.user
        if(memoryUser && memoryUser.id){
            return <Redirect to='/'/>
        }

        return (
            <div className="login">
                <header className="login-header">
                    <img src={logo} alt="logo" />
                    <h1>React项目: 后台管理系统</h1>
                </header>
                <section className="login-content">
                    <h2>用户登录</h2>
                    <Form
                        onFinish={this.onFinish}
                        className="login-form"
                        initialValues={{
                            username: 'admin',
                            remember: true
                        }}
                    >
                        <Item
                            name="username"
                            //声明式验证，直接使用别人定义好的验证规则
                            rules={[
                                {
                                    required: true,
                                    whitespace: true, //自动过滤空格
                                    message: '用户名必须输入!',
                                },
                                {
                                    min: 4,
                                    message: '用户名至少4位!'
                                },
                                {
                                    max: 12,
                                    message: '用户名至多12位!'
                                },
                                {
                                    pattern: /^[a-zA-Z0-9_]+$/,
                                    message: '用户名必须是英文、数字或下划线组成'
                                }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Username" />
                        </Item>

                        <Item
                            name="password"
                            rules={[
                                {
                                    validator: this.validatePwd
                                }
                            ]}
                        >
                            <Input.Password
                                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                                placeholder="Password" />
                        </Item>
                        <Item>
                            <Item name="remember" onChange={check => this.rememberMe(check)} valuePropName="checked" noStyle>
                                <Checkbox>Remember me</Checkbox>
                            </Item>
                            {/* <a className="login-form-forgot" href="#">
                                Forgot password
                            </a> */}
                        </Item>
                        <Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                登陆
                            </Button>
                            {/* Or <a href="">register now!</a> */}
                        </Item>


                    </Form>
                </section>
            </div>
        )
    }
}


/*
1. 高阶函数
    1). 一类特别的函数
        a. 接受函数类型的参数
        b. 返回值是函数
    2). 常见
        a. 定时器: setTimeout()/setInterval()
        b. Promise: Promise(() => {}) then(value => {}, reason => {})
        c. 数组遍历相关的方法: forEach()/filter()/map()/reduce()/find()/findIndex()
        d. 函数对象的bind()
        e. Form.create()() / getFieldDecorator()()    ##antd已遗弃
    3). 高阶函数更新动态, 更加具有扩展性

2. 高阶组件
    1). 本质就是一个函数
    2). 接收一个组件(被包装组件), 返回一个新的组件(包装组件), 包装组件会向被包装组件传入特定属性
    3). 作用: 扩展组件的功能
    4). 高阶组件也是高阶函数: 接收一个组件函数, 返回是一个新的组件函数
 */

/*
1. 前台表单验证
2. 收集表单输入数据
*/

/*
async和await
1. 作用?
   简化promise对象的使用: 不用再使用then()来指定成功/失败的回调函数
   以同步编码(没有回调函数了)方式实现异步流程
2. 哪里写await?
    在返回promise的表达式左侧写await: 不想要promise, 想要promise异步执行的成功的value数据
3. 哪里写async?
    await所在函数(最近的)定义的左侧写async
 */