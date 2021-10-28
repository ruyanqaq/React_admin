import React, { Component } from 'react'
import { Button, Card, message, Table, Modal, Space } from 'antd'
import { ArrowRightOutlined, PlusOutlined } from '@ant-design/icons'
import { withRouter } from 'react-router-dom'

import { reqCategorys, reqAddCategorys, reqUpdateCategory } from '../../api'
import LinkButton from '../../components/link-button'
import AddForm from "./addform";
import UpdateForm from "./updateform";

class Category extends Component {

    state = {
        loading: false, // 是否正在获取数据中
        categorys: [], // 一级分类列表
        subCategorys: [], // 二级分类列表
        parentId: '0', // 当前需要显示的分类列表的父分类ID
        parentName: '', // 当前需要显示的分类列表的父分类名称
        showStatus: 0, // 标识添加/更新的确认框是否显示, 0: 都不显示, 1: 显示添加, 2: 显示更新
    }

    initColumns = () => { //初始化列
        this.columns = [
            {
                title: '分类的名称',
                dataIndex: 'name', // 显示数据对应的属性名
            },
            {
                title: '操作',
                width: "30%",
                render: (category) => ( // 返回需要显示的界面标签
                    <span>
                        <LinkButton onClick={
                            () => {
                                this.showUpdate(category)
                            }}>修改分类</LinkButton>
                        {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
                        {this.state.parentId === '0' ? <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}
                    </span>
                )
            }
        ]
    }

    getCategorys = async (parentId) => { //异步获取类名
        //获取数据前，现实loading中
        this.setState({ loading: true })

        parentId = parentId || this.state.parentId
        //异步获取数据
        const result = await reqCategorys(parentId)
        // 在请求完成后, 隐藏loading
        this.setState({ loading: false })

        if (result.status === 0) {
            const categorys = result.data
            if (parentId === '0') {
                // 更新一级分类状态
                this.setState({
                    categorys
                })
            } else {
                // 更新二级分类状态
                this.setState({
                    subCategorys: categorys
                })
            }
        } else {
            message.error("获取分类列表失败")
        }
    }

    //显示二级分类列表
    showSubCategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => { // 在状态更新且重新render()后执行
            /* console.log('parentId', this.state.parentId) */ // '0'
            // 获取二级分类列表显示
            this.getCategorys()
        })

        // setState()不能立即获取最新的状态: 因为setState()是异步更新状态的
        // console.log('parentId', this.state.parentId) // '0'
    }

    componentDidMount() {    //渲染成功后获取分类数据
        this.getCategorys()
    }
    UNSAFE_componentWillMount() {  //组件渲染前初始化列
        this.initColumns()
    }

    /* showCategorys = () => {
        // 更新为显示一列表的状态
        this.setState({
            parentId: '0',
            parentName: '',
            subCategorys: []
        })
    } */

    //新增分类
    addCategory = async () => {
        this.setState({ showStatus: 0 })
        /* console.log(this.classes) */
        //获取列表级数
        const parentId = this.classes.props.value
        /* console.log(parentId) */
        //获取名称
        const categoryName = this.input.state.value
        /* console.log(categoryName) */
        if (categoryName) {
            const result = await reqAddCategorys(categoryName, parentId)
            console.log(result.status)
            if (result.status === 0) {
                this.getCategorys();//重新获取当前分类列表
                message.success('添加成功')
            } else {
                message.error('添加失败')
            }
        } else {
            message.error('名称不能为空!')
            return
        }
    }
    //修改后更新列表
    updateCategory = async () => {
        //更新显示状态
        this.setState({ showStatus: 0 });
        console.log(this.form)
        //获取修改项的id
        const categoryId = this.category._id
        //获取修改后的名称
        const categoryName = this.form.state.value
        if (categoryName) {
            const result = await reqUpdateCategory(categoryId, categoryName)
            if (result.status === 0) {
                this.getCategorys()
                message.success('修改成功')
            } else {
                message.error('修改失败')
            }
        } else {
            message.error("名称不能为空！")
            return
        }
    }

    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
    }

    showUpdate = (category) => {
        // 保存分类对象
        this.category = category
        // 更新状态
        this.setState({
            showStatus: 2
        })
    }

    render() {

        //读取state的数据
        const { categorys, subCategorys, parentId, parentName, loading, showStatus } = this.state
        //如果没有则为空
        const category = this.category || {}
        //card左侧title，二级列表时点击返回一级
        const title = parentId === '0' ? '一级分类列表' : (
            <Space>
                <LinkButton onClick={
                    () => {
                        this.setState({
                            subCategorys: [], // 二级分类列表
                            parentId: '0', // 当前需要显示的分类列表的父分类ID
                            parentName: '', // 当前需要显示的分类列表的父分类名称
                        }, () => {
                            this.getCategorys()

                        })
                    }
                }>一级分类列表</LinkButton>
                <ArrowRightOutlined /> {parentName}
            </Space>

        )
        //card右侧添加按钮
        const extra = (
            <Button
                icon={<PlusOutlined />}
                type="primary"
                onClick={() => {
                    this.setState({ showStatus: 1 });
                }}
            >
                添加
            </Button>
        );

        return (
            <Card title={title} extra={extra} style={{ width: "100%" }}>
                <Table
                    bordered
                    dataSource={parentId === '0' ? categorys : subCategorys}
                    loading={loading}
                    rowKey='_id'
                    columns={this.columns}
                    pagination={{ defaultPageSize: 5, showQuickJumper: true }}
                />

                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    destroyOnClose={true} //让对话框关闭时候清空输入值
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm
                        parentId={parentId}
                        categorys={categorys}
                        setClasses={(classes) => {
                            this.classes = classes
                        }}
                        setInput={(input) => {
                            this.input = input
                        }}
                    />
                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    destroyOnClose={true} //让对话框关闭时候清空输入值
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >
                    <UpdateForm
                        categoryName={category.name}
                        setForm={(form) => {
                            this.form = form
                        }}
                    />
                </Modal>
            </Card>
        )
    }
}
export default withRouter(Category)