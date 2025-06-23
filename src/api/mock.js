import Mock from 'mockjs'
import homeApi from './mockData/home'
import userApi from './mockData/user'
// import menuApi from './mockData/permission'
import permissionApi from './mockData/permission'

// 拦截请求  第一个参数，是拦截的地址（这种是正则写法） 第二个是请求的方法 第三个是处理请求的方法
Mock.mock(/home\/getTableData/, "get", homeApi.getTableData)
Mock.mock(/home\/getCountData/, "get", homeApi.getCountData)
Mock.mock(/home\/getChartData/, "get", homeApi.getChartData)
Mock.mock(/user\/getUserData/, "get", userApi.getUserList)
Mock.mock(/user\/deleteUser/, "get", userApi.deleteUser)
Mock.mock(/user\/addUser/, "post", userApi.createUser)
Mock.mock(/user\/editUser/, "post", userApi.updateUser)
// Mock.mock(/permission\/getMenu/, "post", menuApi.getMenu);
Mock.mock(/permission\/getMenu/, "post", permissionApi.getMenu)

