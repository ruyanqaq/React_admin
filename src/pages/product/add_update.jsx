import React, { Component } from 'react'
import { Card, Form, Input, Cascader, Button } from "antd";
import { RollbackOutlined } from '@ant-design/icons'

import RichTextEditor from './rich-text-editor'
import { reqCategorys } from "../../api";
import LinkButton from '../../components/link-button'
import PicturesWall from "./pictures-wall";

const Item = Form.Item
export default class ProductAddUpdate extends Component {

    state = {
        options: [],
        setOptions: () => { },
        fClass: "",
        sClass: "",
    }
    constructor(props) {
        super(props);
        //创造保存ref标识的标签对象的容器
        this.pw = React.createRef(); //pictureWall
        this.editor = React.createRef();
    }

    UNSAFE_componentWillMount() {
        // const product = this.props.location.state.desc
        let product
        try {
            product = this.props.location.state.desc
            //console.log({product})
        } catch {
            product = {}
        }
        this.isUpdate = !!product  //是否为更新商品
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategorys("0")
    }
    initOptions = async (categorys) => {
        //初始化options
        const options = categorys.map(c => ({
            value: c._id,
            label: c.name,
            isLeaf: false
        }))
        //如果是一个二级分类列表
        const { isUpdate, product } = this;
        const { pCategoryId } = product;
        if (isUpdate && pCategoryId !== "0") {
            const subCategorys = await this.getCategorys(pCategoryId)

            const childOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))

            const targetOption = options.find(
                option => option.value === pCategoryId
            )
            if (targetOption) {
                targetOption.children = childOptions
            }
        }


        //更新options
        this.setState({ options })
    }

    /* 异步获取一个一级/二级列表，async函数返回一个promise */
    //初始化一级分类，如果获取的是二级分类，则返回二级分类列表
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)
        if (result.status === 0) {
            const categorys = result.data
            if (parentId === "0") { //如果是一级分类
                this.initOptions(categorys)
            } else {//二级分类
                return categorys //返回二级列表 =>当前async返回的promise成功时的value
            }
        }
    }
    //用于加载下一级列表的回调函数
    loadData = async selectedOptions => {
        // 得到选择的option对象
        const targetOption = selectedOptions[0]
        // 显示loading
        targetOption.loading = true

        //根据所选的一级分类获取二级分类
        const subCategorys = await this.getCategorys(targetOption.value)
        //隐藏loading
        targetOption.loading = false

        //如果二级分类有数据
        if (subCategorys && subCategorys.length > 0) {
            //生成一个有二级列表的options
            const chileOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true
            }))
            targetOption.children = chileOptions
        } else {
            targetOption.isLeaf = true
        }

        // 更新options状态
        this.setState({
            options: [...this.state.options],
        })
    }

    //提交表单，发送更新商品请求
    onFinish = async (values) => {
        const { name, desc, price, categoryIds } = values
        const pCategoryId = categoryIds[0]
        const categoryId = categoryIds[1]
        const imgs = this.pw.current.getImgs()
        const detail = this.editor.getDetails()
        //要更新/添加的商品对象
        const product = { name, desc, price, imgs, detail, pCategoryId, categoryId }
        if(this.isUpdate){
            product._id = this.product._id
        }
    }

    render() {

        const title = (
            <span>
                <LinkButton onClick={() => this.props.history.goBack()}>
                    <RollbackOutlined />
                </LinkButton>
                "修改商品"
            </span>
        )
        const formItemLayout = {
            labelCol: { span: 2 }, //左侧label宽度
            wrapperCol: { span: 8 }, //右侧包裹输入框宽度
        }
        const tailLayout = {
            wrapperCol: { offset: 8, span: 16 }, //offset左侧空白的宽度
        };
        const {
            name,
            desc,
            price,
            detail,
            imgs,
            pCategoryId,
            categoryId,
        } = this.product;
        const categoryIds = [];
        const isUpdate = this.isUpdate
        if (isUpdate) {
            if (pCategoryId !== "0") {
                categoryIds.push(pCategoryId)
            }
        }
        categoryIds.push(categoryId)
        return (
            <Card title={title}>
                <Form {...formItemLayout} onFinish={this.onFinish}>
                    <Item
                        name="name"
                        label="商品名称"
                        initialValue={name}
                        rules={[{ required: true, message: "必须输入商品名称!" }]}
                    >
                        <Input placeholder="请输入商品名称"></Input>
                    </Item>
                    <Item name="desc" label="商品描述" initialValue={desc}>
                        <Input.TextArea
                            placeholder="请输入商品描述"
                            autoSize={{ minRows: 2, maxRows: 6 }}
                        ></Input.TextArea>
                    </Item>
                    <Item
                        name="price"
                        label="商品价格"
                        initialValue={price}
                        rules={[
                            { required: true, message: "必须输入商品价格!" },
                            {
                                validator: (_, value) => //自定义校验需要回调函数
                                    !value || value * 1 > 0
                                        ? Promise.resolve()
                                        : Promise.reject(new Error("商品价格必须大于0"))
                            }
                        ]}
                    >
                        <Input
                            type="number"
                            placeholder="请输入商品价格"
                            addonAfter="元"
                        ></Input>
                    </Item>
                    <Item
                        name="categoryIds"
                        label="商品类别"
                        rules={[{ required: true, message: "必须选择商品类别!" }]}
                        initialValue={categoryIds}
                    >
                        <Cascader
                            placeholder="请选择"
                            options={this.state.options}
                            loadData={this.loadData}
                            onChange={this.onChange}
                            changeOnSelect
                        ></Cascader>
                    </Item>

                    <Item
                        name="detail"
                        label="商品详情"
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }}
                    >
                        <RichTextEditor ref={this.editor} detail={detail} />
                    </Item>
                    <Item
                        name="imgs"
                        label="商品图片"
                        initialValue={name}
                    >
                        <PicturesWall ref={this.pw} imgs={imgs} />
                    </Item>
                    <Item {...tailLayout}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Item>
                </Form>
            </Card>
        )
    }
}