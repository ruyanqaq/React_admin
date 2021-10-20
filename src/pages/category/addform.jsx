import React, { Component } from 'react'
import { Form, Select, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const { Option } = Select
export default class AddForm extends Component {

    formRef = React.createRef()

    static propTypes = {
        categorys: PropTypes.array.isRequired,
        parentId: PropTypes.string.isRequired,
        setClasses: PropTypes.func.isRequired,
        setInput: PropTypes.func.isRequired
    }

    componentDidMount() {
        this.formRef.current.setFieldsValue({
            classer: this.props.parentId
        })
    }

    render() {
        console.log(this)
        const { categorys } = this.props
        return (
            <Form ref={this.formRef}>
                <Item
                    name='classer'>
                    <Select ref={option => this.props.setClasses(option)}>
                        <Option key='0' value='0'>一级分类</Option>
                        {
                            categorys.map(category =>
                                <Option value={category._id} key={category._id} >{category.name}</Option>
                            )
                        }
                    </Select>
                </Item>
                <Item>
                    <Input placeholder='请输入分类名称' rules={[{ required: true, message: "名称必须输入!" }]} ref={input => this.props.setInput(input)}></Input>
                </Item>
            </Form>
        )
    }
}
