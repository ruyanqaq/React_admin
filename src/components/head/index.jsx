import React, { Component } from 'react'
import { ExclamationCircleOutlined, CloudOutlined } from '@ant-design/icons'
import { Modal } from "antd";

import menuList from '../../config/menuConfig'
import { formateDate } from '../../utils/dataUtils'
import { reqWeather } from '../../api'
import './head.less'
import { withRouter } from 'react-router'
import storageUtils from '../../utils/storageUtils'
import memoryUtils from '../../utils/memoryUtils'
import LinkButton from '../../components/link-button'

const { confirm } = Modal;

class Head extends Component {

    state = {
        currentTime: formateDate(Date.now()),
        weather: ""
    }
    getTime = () => {
        this.flushTimeFn = setInterval(() => {
            this.setState({ currentTime: formateDate(Date.now()) })
        }, 1000)
    }
    getWeather = async () => {
        const { weather } = await reqWeather('武汉')
        this.setState({ weather })
    }

    getTitle = () => {
        let title
        const path = this.props.location.pathname
        menuList.forEach(item => {
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => 
                    path.indexOf(cItem.key)===0
                )
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    Logout = () => {
        //显示确认框
        // console.log(history)
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: "确定退出登陆吗?",

            onOk: () => {
                //删除user
                storageUtils.removeUser()
                memoryUtils.user = {}
                //跳转到登录页
                this.props.history.replace('/login')
            },
            onCancel: () => {
                console.log("取消");
            },
        });
    }

    componentDidMount() {
        this.getTime();
        this.getWeather();
    }
    componentWillUnmount() {
        clearInterval(this.flushTimeFn);
    }
    render() {
        const { currentTime, weather } = this.state
        const title = this.getTitle()
        return (
            <div className='header'>
                <div className="header-top">
                    <span>欢迎，{memoryUtils.user.username}</span>
                    <LinkButton onClick={this.Logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">
                        <span>{title}</span>
                    </div>
                    <div className="header-bottom-right">
                        <span>{currentTime}</span>
                        <CloudOutlined
                            style={{ width: "30px", height: "20px", margin: "15 15 15 15" }}
                        />
                        <span>{weather}</span>
                    </div>
                </div>

            </div>
        )
    }
}

export default withRouter(Head)