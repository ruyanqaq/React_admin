/*
要求: 能根据接口文档定义接口请求
包含应用中所有接口请求函数的模块
每个函数的返回值都是   promise

基本要求: 能根据接口文档定义接口请求函数
 */
import { message } from "antd";
import jsonp from 'jsonp'
import ajax from './ajax'
/* const BASE ="http://localhost:5000" */
const BASE = ''

//登录
/* export function reqLogin(username, password) {
    return ajax('/login', {username, password}, 'POST')
} */
export const reqLogin = (username, password) => ajax(BASE + "/login", { username, password }, "POST");
//获取分类
export const reqCategorys = (parentId) => ajax(BASE + '/manage/category/list', { parentId })
//添加分类
export const reqAddCategorys = (categoryName, parentId) => ajax(BASE + 'manage/category/add', { categoryName, parentId }, "POST");
//更新分类名称,传进的参数为对象
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BASE + 'manage/category/update', { categoryId, categoryName }, 'POST');

export const reqWeather = city => {
    return new Promise((resolve, reject) => {
        const url = `https://restapi.amap.com/v3/weather/weatherInfo?city=${city}&key=28d5d8f514304e84a359b18b5c6b5b0b`
        jsonp(url, {}, (err, data) => {
            if (!err && data.status === "1") {
                const { weather } = data.lives[0];
                resolve({ weather });
            } else {
                message.error("天气获取失败");
            }
        })
    })
}

// 获取一个分类
export const reqCategory = (categoryId) => ajax(BASE + '/manage/category/info', { categoryId })

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(BASE + '/manage/product/list', { pageNum, pageSize })

// 更新商品的状态(上架/下架)
export const reqUpdateStatus = (productId, status) => ajax(BASE + '/manage/product/updateStatus', { productId, status }, 'POST')

/*
搜索商品分页列表 (根据商品名称/商品描述)
searchType: 搜索的类型, productName/productDesc
 */
export const reqSearchProducts = (pageNum, pageSize, searchName, searchType) =>
    ajax("/manage/product/search", {
        pageNum,
        pageSize,
        [searchType]: searchName,
    })

// 删除指定名称的图片
export const reqDeleteImg = (name) => ajax(BASE + '/manage/img/delete', { name }, 'POST')

// 添加/修改商品
export const reqAddOrUpdateProduct = (product) => ajax(BASE + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')
// 修改商品
// export const reqUpdateProduct = (product) => ajax(BASE + '/manage/product/update', product, 'POST')
//获取所有角色列表
export const reqRoleList = () => ajax(BASE + "/manage/role/list");
//添加角色   //参数加{}要求名字对应 不加要求顺序对应
export const reqAddRole = (roleName) => ajax(BASE + "/manage/role/add", { roleName }, "POST");
//更新权限
export const reqUpdateRole = (role) => ajax(BASE + "/manage/role/update", role, "POST");
//获取所有用户的列表
export const reqUsers = () => ajax(BASE + "/manage/user/list");
//删除指定用户
export const reqDelUser = (userId) => ajax(BASE + "/manage/user/delete", { userId }, "post");
//添加用户
// export const reqAddUser = (user) => ajax('http://120.55.193.14:5000/manage/user/add',{user},'post')
// 添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BASE + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')
