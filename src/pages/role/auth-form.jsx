import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
    Form,
    Input,
    Tree
} from 'antd'

import menuConfig from '../../config/menuConfig'

const Item = Form.Item

export default class AuthForm extends PureComponent {
    static propTypes = {
        role: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props)

        const { menus } = this.props.role
        this.state = {
            checkedKeys: menus
        }
    }

    getMenus = () => this.state.checkedKeys;

    // getTreeNodes = (menuConfig) => {
    //     return menuConfig.reduce((pre, menu) => {
    //         pre.push(
    //             <TreeNode title={menu.title} key={menu.key}>
    //                 {menu.children ? this.getTreeNodes(menu.children) : null}
    //             </TreeNode>
    //         )
    //         return pre
    //     }, [])

    //     /*  return (
    //          menuList.map(item => {
    //              <TreeNode title={menu.title} key={menu.key}>
    //                  {menu.children ? this.getTreeNodes(meunu.children) : null}
    //              </TreeNode>
    //          })
    //      ) */
    // }

    // componentWillMount() {
    //     this.TreeNodes = this.getTreeNodes(menuConfig)
    // }

    render() {

        const { role } = this.props
        const { checkedKeys } = this.state
        const treeData = menuConfig;

        // 指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 4 },  // 左侧label的宽度
            wrapperCol: { span: 15 }, // 右侧包裹的宽度
        }

        //写进render避免更改角色时，被选中项不刷新的bug，也可以使用componentWillReceiveProps
        const onCheck = (checkedKeys) => {
            // console.log("onCheck", checkedKeys);
            this.setState({ checkedKeys: checkedKeys });
        };
        return (
            <div>
                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                </Item>

                <Tree
                    checkable
                    defaultExpandAll={true}
                    checkedKeys={checkedKeys}
                    onCheck={onCheck}
                    treeData={treeData}
                    key="all"
                >
                </Tree>
            </div>
        )
    }

}