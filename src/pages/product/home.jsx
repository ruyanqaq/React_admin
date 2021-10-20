import React, { Component } from 'react'
import { withRouter } from "react-router-dom"
import {Card, Select, Input, Button, Table, message } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import LinkButton from "../../components/link-button";
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api';

const PAGE_SIZE = 3
const Option = Select.Option;

class ProductHome extends Component {

    state = {
        products: [],
        loading: false,
        total: 0,
        searchName: "",
        searchType: "productName",/* 受控组件 */
    }

    UNSAFE_componentWillMount() {
        this.columns = [
            {
                width: 200,
                title: "商品名称",
                dataIndex: "name",
                key: "name"
            },
            {
                title: "商品描述",
                dataIndex: "desc",
                key: "desc"
            },
            {
                width: 100,
                title: "价格",
                dataIndex: "price",
                key: "price",
                render: (price) => "￥" + price
            },
            {
                width: 100,
                title: "状态",
                dataIndex: "status",
                key: "status",
                render: (status, _id) => {
                    const newStatus = status === 1 ? 2 : 1
                    return (
                        <span>
                            <Button type="primary" onClick={() => this.updateStatus(_id, newStatus)}>{status === 1 ? '下架' : '上架'}</Button>
                            <span>{status === 1 ? '在售' : '已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: "操作",
                key: "action",
                render: (desc) => {
                    return (
                        <span>
                            <LinkButton onClick={() => this.props.history.push('/product/detail', { desc })}>详情</LinkButton>
                            <LinkButton onClick={() => this.props.history.push('/product/addupdate', { desc })}>修改</LinkButton>
                        </span>
                    );
                },
            },
        ]
    }
    componentDidMount() {
        this.getProducts(1)
    }

    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        const { searchName, searchType } = this.state
        console.log(this.state)
        this.setState({ loading: true });
        let result
        if (searchName === '') {
            result = await reqProducts(pageNum, PAGE_SIZE)
        } else {
            result = await reqSearchProducts(pageNum, PAGE_SIZE, searchName, searchType)
        }
        this.setState({ loading: false })
        if (result.status === 0) {
            this.setState({
                products: result.data.list,
                total: result.data.total
            }, () => {
                console.log(this.state)
            })

        } else {
            message.error("请求失败，请重试")
        }
    }

    updateStatus = async (id, status) => {
        const result = await reqUpdateStatus(id, status)
        if (result.status === 0) {
            message.success('更新商品成功')
            this.getProducts(this.pageNum)
        } else {
            message.error('更新商品失败')
        }
    }

    render() {

        const { searchType } = this.state;
        const title = (
            <span>
                <Select
                    value={searchType}
                    style={{ width: 150 }}
                    onChange={(value) =>
                        this.setState({ searchType: value })
                    }
                >
                    <Option value="productName">按名称搜索</Option>
                    <Option value="productDesc">按描述搜索</Option>
                </Select>
                <Input
                    style={{ width: 150, margin: '0 15px' }}
                    placeholder="请输入关键字"
                    onChange={(event) =>
                        this.setState({ searchName: event.target.value })
                    }
                />

                <Button
                    icon={<SearchOutlined />}
                    type="primary"
                    onClick={() => this.getProducts(1)}
                >
                    搜索
                </Button>
            </span>
        )
        const extra = <Button type="primary" onClick={
            () => { this.props.history.push('/product/addupdate') }
        }>添加</Button>;
        return (
            <Card title={title} extra={extra}>
                <Table
                    loading={this.state.loading}
                    pagination={{
                        current: this.pageNum,  //跳转
                        total: this.state.total,
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                        onChange: (pageNum) => {
                            this.getProducts(pageNum);
                        },
                    }}
                    bordered
                    rowKey="_id"
                    dataSource={this.state.products}
                    columns={this.columns}
                />
            </Card>
        )
    }
}

export default withRouter(ProductHome)