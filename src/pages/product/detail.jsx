import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Card, List, Message } from "antd"
import { RollbackOutlined } from '@ant-design/icons'
import { reqCategory } from '../../api'
import { BASE_IMG_URL } from '../../utils/constants'
const Item = List.Item
class ProductDetail extends Component {

    state = {
        fClass: '',
        sClass: ''
    }

    async componentDidMount() {
        const { pCategoryId, categoryId } = this.props.location.state.desc
        if (pCategoryId === "0") {
            const result = await reqCategory(categoryId)  //如果无父分类，则只查一级分类
            if (result.status === 0) {
                const fClass = result.name;
                this.setState({ fClass });
            } else {
                Message.error("请求分类失败")
            }
        } else { //有父分类，查两级分类，
            // const result1 = await reqCategory(pCategoryId)
            // const result2 = await reqCategory(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name
            const results = await Promise.all([reqCategory(pCategoryId), await reqCategory(categoryId)])//所有请求都成功，才返回成功结果
            const fClass = results[0].data.name
            const sClass = results[1].data.name
            this.setState({
                fClass,
                sClass
            })
        }
    }

    render() {

        const { fClass, sClass } = this.state
        const { name, desc, price, detail, imgs } = this.props.location.state.desc;
        const title = (
            <span>
                <RollbackOutlined onClick={() => this.props.history.goBack()} />{" "}
                商品详情
            </span>
        )
        return (
            <Card title={title}>
                <List className="product-detail">
                    <Item >
                        <span className="left">商品名称:</span>
                        <span >{name}</span>
                    </Item>
                    <Item>
                        <span className="left">商品描述:</span>
                        <span>{desc}</span>
                    </Item>
                    <Item>
                        <span className="left">商品价格:</span>
                        <span>{price}</span>
                    </Item>
                    <Item>
                        <span className="left">所属分类:</span>
                        <span>{fClass}{sClass ? "->" + sClass : ""}</span>
                    </Item>
                    <Item>
                        <span className="left">商品图片:</span>
                        <span>
                            {
                                imgs.map(img => (
                                    img ?
                                        <img
                                            key={img}
                                            src={BASE_IMG_URL + img}
                                            className="product-img"
                                            alt="img"
                                        /> : ""
                                ))
                            }
                        </span>
                    </Item>
                    <Item>
                        <span className="left">商品详情:</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }}>
                        </span>
                    </Item>
                </List>
            </Card>
        )
    }
}

export default withRouter(ProductDetail)