import React, { Component } from "react";
import { Button, Card, Table, Modal, message } from "antd";
import { PAGE_SIZE } from "../../utils/constants";
import { formateDate } from "../../utils/dataUtils";
import LinkButton from "../../components/link-button";
import UserForm from './user-form'
import { reqDelUser, reqUsers, reqAddOrUpdateUser } from "../../api";


export default class User extends Component {

    state = {
        loading: false,
        showStatus: false,
        users: [],
        roles: []
    }

    constructor(props) {
        super(props)
        this.userRef = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: "用户名",
                dataIndex: "username",
            },
            {
                title: "邮箱",
                dataIndex: "email",
            },
            {
                title: "电话",
                dataIndex: "phone",
            },
            {
                title: "注册时间",
                dataIndex: "create_time",
                render: (create_time) => formateDate(create_time),
            },
            {
                title: "所属角色",
                dataIndex: "role_id",
                render: (role_id) =>
                    // {
                    //     const role=this.state.roles.find(role=>role._id===role_id)
                    //     return role?role.name:''}
                    //防止反复生成
                    this.roleNames[role_id],
            },
            {
                title: "操作",
                render: (user) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(user)}>修改</LinkButton>
                        <LinkButton onClick={() => this.deleteUser(user)}>删除</LinkButton>
                    </span>
                ),
            },
        ];
    }

    initRoleName = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
        this.roleNames = roleNames
    }

    getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            const { users, roles } = result.data
            this.initRoleName(roles)
            this.setState({ users, roles })
        } else {
            message.error("获取角色列表失败")
        }
    }

    deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDelUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功!')
                    this.getUsers()
                }
            }
        })
    }

    addOrUpdateUser = async () => {
        this.setState({ showStatus: false })
        let user = this.userRef.current.addOrUpdateUser()

        //如果是修改用户，则给user赋_id值
        if (this.user) {
            user._id = this.user._id
        }
        // 2. 提交添加的请求
        const result = await reqAddOrUpdateUser(user)
        // 3. 更新列表显示
        if (result.status === 0) {
            message.success(`${this.user ? '修改' : '添加'}用户成功`)
            this.getUsers()
        }
    }

    showAdd = () => {
        this.user = {} //标记当前action为增加用户
        this.setState({ showStatus: true })
    }
    showUpdate = (user) => {
        this.user = user // 保存user
        this.setState({ showStatus: true })
    }
    handleCancel = () => {
        this.setState({ showStatus: 0 });
    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getUsers()
    }


    render() {

        // 获取列表内容
        const { users, roles, showStatus } = this.state
        //标记是否为增加用户
        const user = this.user || {}

        const title = (
            <Button
                type="primary"
                onClick={
                    this.showAdd
                }
            >
                创建用户
            </Button>
        )

        return (
            <Card title={title} >
                <Table
                    rowKey="_id"
                    pagination={{
                        pageSize: PAGE_SIZE,
                        // , total: 50
                    }}
                    dataSource={users}
                    columns={this.columns}
                    bordered
                />
                <Modal
                    title={user._id ? '修改用户' : '添加用户'}
                    visible={showStatus}
                    onOk={this.addOrUpdateUser}
                    onCancel={this.handleCancel}
                    destroyOnClose={true}
                >
                    <UserForm
                        roles={roles}
                        user={user}
                        ref={this.userRef}
                    />
                </Modal>

            </Card>
        )
    }
}
