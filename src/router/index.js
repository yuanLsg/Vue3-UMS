import { createRouter, createWebHashHistory, } from "vue-router";

import Main from "@/views/Main.vue";
import Home from "@/views/Home.vue";
import User from "@/views/User.vue";
import Login from "@/views/Login.vue";

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Main,
      // 默认到home页面去
      redirect: "/home",
      children: [
        {
          path: 'mall',
          name: 'mall',
          component: () => import('@/views/Mall.vue')
        },
        {
          path: 'home',
          name: 'home',
          component: Home,
        },
        {
          path: 'user',
          name: 'user',
          component: User,
        }
      ],
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/404',
      name: '404',
      component: () => import('@/views/404.vue')
    }
  ]
})
export default router;
//引入两个方法，第一个创建路由器对象，第二个是开启hash模式的方法
// import { createRouter, createWebHashHistory } from 'vue-router'

// //路由规则
// const routes = [
//   {
//     path: '/',
//     name: 'main',
//     component: () => import('@/views/Main.vue')
//   }
// ]

// const router = createRouter({
//   //history设置路由模式
//   history: createWebHashHistory(),
//   routes
// })

// //把路由器暴露出去
// export default router