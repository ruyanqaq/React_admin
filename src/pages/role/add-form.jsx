import React, { PureComponent } from "react";
import { Form, Input } from "antd";
import PropTypes from "prop-types";

const Item = Form.Item;
export default class AddForm extends PureComponent {

    static propTypes = {
        setInput: PropTypes.func.isRequired, // 用来传递form对象的函数
    }

    render() {
        const formInputLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 10 }
        };
        return (
            <Form>
                <Item
                    {...formInputLayout}
                    label="角色名称"
                    name="username"
                    rules={[{ required: true, message: "名称必须输入!" }]}
                >
                    <Input

                        initialvalues="请输入角色名称"
                        ref={(input) => {
                            this.props.setInput(input)
                        }}
                    ></Input>
                </Item>
            </Form>
        )
    }
}