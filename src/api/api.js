// 这个apj.js的意思就是：整个项目api的统一管理
//axios的二次封装

import { mock } from "mockjs";
import request from "./request";


//请求首页左侧的表格数据

export default {
  getTableData() {
    return request({
      url: '/home/getTableData',
      method: 'get',
      // mock: true,
    })
  },
  getCountData() {
    return request({
      url: '/home/getCountData',
      method: 'get',
    })
  },
  getChartData() {
    return request({
      url: '/home/getChartData',
      method: 'get',
    })
  },
  getUserData(data) {
    return request({
      url: '/user/getUserData',//24节
      method: 'get',
      data,
    })
  },
  deleteUser(data) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      data,
    })
  },
  addUser(data) {
    return request({
      url: '/user/addUser',
      method: 'post',
      data,
    })
  },
  editUser(data) {
    return request({
      url: '/user/editUser',
      method: 'post',
      data,
    })
  },
  getMenu(params) {
    return request({
      url: '/permission/getMenu',
      method: 'post',
      data: params
    })
  },
}