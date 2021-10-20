import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from "antd";

import { PAGE_SIZE } from "../../utils/constants";
import { reqRoleList, reqAddRole, reqUpdateRole } from "../../api";
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from "../../utils/memoryUtils"
import { formateDate } from '../../utils/dataUtils'
import storageUtils from "../../utils/storageUtils";

const user = memoryUtils.user
export default class Role extends Component {
    state = {
        loading: false,
        roles: [], // 所有角色的列表
        role: {}, // 选中的role
        showStatus: 0, //0不显示，1显示添加角色，2显示修改权限
    }

    constructor(props) {
        //如果你用到了constructor就必须写super(),是用来初始化this的，可以绑定事件到this上
        ///如果你在constructor中要使用this.props,就必须给super加参数：super(props)
        super(props)
        this.auth = React.createRef()
    }

    initColumn = () => {
        this.columns = [
            {
                title: "角色名称",
                dataIndex: "name",
            },
            {
                title: "创建时间",
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time)
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
                render: (auth_time) => formateDate(auth_time)
            },
            {
                title: "授权人",
                dataIndex: "auth_name",
            },
        ]
    }
    getRoles = async () => {
        const result = await reqRoleList()
        if (result.status === 0) {
            const roles = result.data
            this.setState({
                roles
            })
        }
    }

    addRole = async () => {
        const result = await reqAddRole(this.input.props.value)
        if (result.status === 0) {
            message.success("添加角色成功！")
            // this.getRoles()

            // 不请求直接添加到roles列表
            const role = result.data
            // const roles =[...this.state.roles]
            // roles.push(role)
            // this.setState({roles:roles})
            this.setState({
                roles: [...this.state.roles, role]
            })
        } else {
            message.error("添加角色失败");
        }
        this.setState({ showStatus: 0 });
    }

    setRole = async () => {
        const menus = this.auth.current.getMenus()
        const role = this.state.role

        role.menus = menus
        role.auth_time = Date.now()
        role.auth_name = user.username

        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            message.success('设置权限成功')

            //如果更新的是自己角色权限,强制退出
            if (user.username !== 'admin' && role._id === user._id) {
                memoryUtils.user = {}
                storageUtils.removeUser()
                message.info('权限已更改,请重新登录')
                this.props.history.replace("/login")
            }
        } else {
            message.error('设置权限失败')
        }
        this.setState({ showStatus: 0 });
    }

    handleCancel = () => {
        this.setState({ showStatus: 0 })
    }


    componentWillMount() {
        this.initColumn()
    }

    componentDidMount() {
        this.getRoles()
    }


    render() {

        const { roles, role, showStatus, loading } = this.state
        console.log(role)
        const title = (
            <span>
                <Button type="primary"
                    onClick={() => this.setState({ showStatus: 1 })}
                >
                    创建角色
                </Button>&nbsp;&nbsp;
                <Button
                    type="primary"
                    onClick={() => this.setState({ showStatus: 2 })}
                    disabled={!role._id}
                >
                    设置角色权限
                </Button>
            </span>
        )
        return (
            <Card title={title}>
                <Table
                    rowKey="_id"
                    pagination={{
                        pageSize: PAGE_SIZE,
                        // , total: 50
                    }}
                    dataSource={roles}
                    columns={this.columns}
                    loading={loading}
                    rowSelection={{
                        type: "radio", selectedRowKeys: [role._id], onSelect: (role) => {
                            this.setState({ role: role })
                        }
                    }} //设置单选
                    onRow={(role) => {
                        return {
                            onSelect: (event) => {
                                this.setState({ role });
                            },
                            onClick: (event) => {
                                this.setState({ role });
                            }, // 点击行
                            onDoubleClick: (event) => { },
                            onContextMenu: (event) => { },
                            onMouseEnter: (event) => { }, // 鼠标移入行
                            onMouseLeave: (event) => { },
                        };
                    }}
                    bordered
                />
                <Modal
                    title="添加角色"
                    visible={showStatus === 1}
                    onOk={this.addRole}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <AddForm
                        categoryName
                        setInput={(input) => {
                            this.input = input;
                        }}
                    />
                </Modal>
                <Modal
                    title="设置角色权限"
                    visible={showStatus === 2}
                    onOk={this.setRole}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <AuthForm role={role} ref={this.auth} />
                </Modal>
            </Card>
        )
    }
}
