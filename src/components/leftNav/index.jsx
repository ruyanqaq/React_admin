import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Menu } from 'antd';

import "./leftNav.less"
import logo from "../../assets//images/logo.png"
import menuList from '../../config/menuConfig';

import memoryUtils from "../../utils/memoryUtils";


const { SubMenu } = Menu;
class LeftNav extends Component {

    getMeduNodes_map = (menuList) => { //map获取一级目录
        /*  {
            title: '首页', // 菜单标题名称
            key: '/home', // 对应的path
            icon: 'home', // 图标名称
            children: [], // 可能有, 也可能没有
        } */
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                return (
                    <SubMenu key={item.key} icon={item.icon}>
                        {this.getMeduNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }

    hasAuth = (item) => {
        const { key, isPublic } = item

        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*
        1. 如果当前用户是admin
        2. 如果当前item是公开的
        3. 当前用户有此item的权限: key有没有menus中
         */
        if (username === 'admin' || isPublic || menus.indexOf(key) !== -1) {
            return true
            // 4. 如果当前用户有此item的某个子item的权限
        } else if (item.children) {
            return !!item.children.find(child => menus.indexOf(child.key) !== -1)
        }

        return false
    }


    getMeduNodes = menuList => {
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            if (this.hasAuth(item)) {
                if (!item.children) {
                    pre.push(
                        <Menu.Item key={item.key} icon={item.icon}>
                            <Link to={item.key}>{item.title}</Link>
                        </Menu.Item>
                    )
                } else {
                    //查找与当前路径匹配的字Item
                    const cItem = item.children.find(
                        (cItem) => 0 === path.indexOf(cItem.key)
                    )
                    //如果存在，说明当前item的子列表需要打开
                    if (cItem) {
                        this.openkey = item.key;
                    }

                    pre.push(
                        <SubMenu key={item.key} icon={item.icon} title={item.title}>
                            {this.getMeduNodes(item.children)}
                        </SubMenu>
                    )
                }
                return pre
            }
        })
    }
    
    getMeduNodes = menuList => {
        const path = this.props.location.pathname;
        return menuList.reduce((pre, item) => {
            if (!item.children) {
                pre.push(
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                //查找与当前路径匹配的字Item
                const cItem = item.children.find(
                    (cItem) => 0 === path.indexOf(cItem.key)
                )
                //如果存在，说明当前item的子列表需要打开
                if (cItem) {
                    this.openkey = item.key;
                }

                pre.push(
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>
                        {this.getMeduNodes(item.children)}
                    </SubMenu>
                )
            }
            return pre
        }, [])
    }

    //在第一次render之前执行一次，为第一次render准备数据（必须同步）
    UNSAFE_componentWillMount() {
        this.menuNodes = this.getMeduNodes(menuList);
    }
    render() {

        //得到当前请求的路由路径
        let path = this.props.location.pathname
        const openkey = this.openkey

        if (path.indexOf("/product") === 0) {
            //当前请求的是商品或其子路由界面
            path = "/product"
        }

        return (
            <div className="left-nav">
                <Link to='/' className="left-nav-header" >
                    <img src={logo} alt="logo" />
                    <h1>硅谷后台</h1>
                </Link>

                <Menu
                    selectedKeys={[path]}
                    defaultOpenKeys={[openkey]}
                    mode="inline"
                    theme="dark"
                >
                    {this.menuNodes}
                </Menu>
            </div>
        )
    }
}

{/* <Menu.Item key="1" icon={<HomeOutlined />}>
                        <span>首页</span>
                    </Menu.Item>
                    <Menu.Item key="2" icon={<SafetyOutlined />}>
                        <span>角色管理</span>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<UserOutlined />}>
                        <span>用户管理</span>
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<ShoppingCartOutlined />} title="商品">
                        <Menu.Item key="5" icon={<SyncOutlined />}>品类管理</Menu.Item>
                        <Menu.Item key="6" icon={<AccountBookOutlined />}>商品管理</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<AreaChartOutlined />} title="图形图标">
                        <Menu.Item key="9" icon={<BarChartOutlined />}>柱状图</Menu.Item>
                        <Menu.Item key="10" icon={<LineChartOutlined />}>折线图</Menu.Item>
                        <Menu.Item key="11" icon={<PieChartOutlined />}>饼图</Menu.Item>
</SubMenu> */}

export default withRouter(LeftNav)