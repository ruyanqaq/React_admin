import React, { Component } from 'react'
import { Form, Input } from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
export default class UpdateForm extends Component {

    static propTypes = {
        setForm: PropTypes.func.isRequired
    }

    render() {
        /* console.log(this) */
        const { categoryName } = this.props
        return (
            <Form>
                <Item name="username" initialValue={categoryName ? categoryName : ''} rules={[{ required: true, message: "名称必须输入!" }]}>
                    <Input placeholder='请输入分类名称' ref={form => this.props.setForm(form)} /* defaultValue={categoryName ? categoryName : ''} */></Input>
                </Item>
            </Form>
        )
    }
}
