import { createApp } from 'vue';
import App from './App.vue';
import "@/assets/less/index.less";
import router from './router';
//这里ElementPlus我们使用完整引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//注册@element-plus/icons-vue图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import { createPinia } from 'pinia';

// 之所以用mock是因为，在请求后端数据但是后端数据还没有做好时，我们可以用mock这个api制造假数据并且拦截请求，让我们的程序先跑起来
import "@/api/mock.js";//开启拦截数据
import api from './api/api';
import { useAllDataStore } from '@/stores'
import { use } from 'echarts';


// function isRoute(to) {
//   //filter() 方法用于对数组进行过滤，创建一个新数组，其中包含通过所提供函数实现的测试的所有元素。
//   return router.getRoutes().filter(item => item.path === to.path).length > 0
// }
// //router.beforeEach是一个全局前置守卫，可以在路由跳转之前执行一些逻辑
// router.beforeEach((to, from) => {
//   if (to.path !== '/login' && !store.store.token) {
//     return { name: 'login' }//如果没有token就跳转到登录页面
//   }
//   if (!isRoute(to)) {
//     return { name: '404' }//如果路由不存在就跳转到404页面  
//   }
// })
//getRoutes获得所有路由记录的完整列表。
//这个方法判断要跳转的路由是否存在
function isRoute(to) {
  let res = router.getRoutes()
  let resFil = res.filter((item) => item.path === to.path)
  return resFil.length > 0
}

router.beforeEach((to, from) => {
  //如果要跳转的不是login,且token不存在(可以通过不存在token判断出用户未登录)
  if (to.path !== '/login' && !store.state.token) {
    //跳转到login
    return { name: 'login' }
  }
  //如果路由记录不存在
  if (!isRoute(to)) {
    // console.log(11);

    //跳转到404界面
    return { name: "404" }
  }
})



const pinia = createPinia()
const app = createApp(App);


//注册api
app.config.globalProperties.$api = api;
app.use(ElementPlus)
app.use(router);
app.use(pinia)

const store = useAllDataStore()
store.addMenu(router, "refresh")//添加菜单到路由中,需要在app.use(router)之前执行
// 这里的addMenu方法会将menuList中的菜单添加到路由中
app.mount('#app');
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}