// import { defineStore } from "pinia";
// import { ref } from "vue";
// export const useAllDataStore = defineStore('allData', () => {
//   //ref state 属性
//   //computed getters
//   //function actions
//   let isCollapse = ref(false)

//   return { isCollapse }
// })
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

//初始化state数据，这里我们使用一个函数来返回
function initState() {
  return {
    isCollapse: false,
    tags: [
      {
        path: '/home',
        name: 'home',
        label: '首页',
        icon: 'house',
      },
    ],
    currentMenu: null,
    menuList: [],
    token: "",
    routerList: [],
  };
}
//第一个参数要求是一个独一无二的名字
//第二个参数可接受两类值：Setup 函数或 Option 对象。
export const useAllDataStore = defineStore('allData', (a) => {
  //在 Setup Store 中：
  //ref() 就是 state 属性
  //computed() 就是 getters
  //function() 就是 actions	

  const state = ref(initState())//state属性，保存所有的状态数据
  //使用watch监听state
  watch(state, (newObj) => {
    //如果变化后的state中的token不存在，代表用户退出(一般退出后会清除token)，不需要持久化存储state了
    if (!newObj.token) return//token不存在，表示用户退出登录
    //否则持久化存储state
    localStorage.setItem('store', JSON.stringify(newObj))
  }, { deep: true })//deep开启深度监听

  function selectMenu(val) {
    if (val.name === 'home') {
      state.value.currentMenu = null
    } else {
      state.value.currentMenu = val
      let index = state.value.tags.findIndex(item => item.name === val.name)
    }
  }
  function undateTags(tag) {
    let index = state.value.tags.findIndex(item => item.name === tag.name)
  }


  //实现动态路由
  //实现动态路由
  //实现动态路由
  function addMenu(router, type) {
    if (type === 'refresh') {//如果是刷新页面，直接从localStorage中获取持久化存储的state
      if (JSON.parse(localStorage.getItem("store"))) {
        state.value = JSON.parse(localStorage.getItem("store"))
        state.value.routerList = []
      } else {
        return;
      }
    }
    const menu = state.value.menuList
    const module = import.meta.glob('../views/**/*.vue')//动态导入所有的.vue文件
    // **0个或多个目录，*0个或1个目录，*.vue文件
    const routerArr = []
    menu.forEach((item) => {
      if (item.children) {
        item.children.forEach((val) => {
          let url = `../views/${val.url}.vue`//动态导入对应的组件
          val.component = module[url]//动态导入对应的组件
          routerArr.push(...item.children)
        })
      } else {
        let url = `../views/${item.url}.vue`//动态路由
        item.component = module[url]
        routerArr.push(item)
      }
    })
    let routers = router.getRoutes()//获取当前路由器中已经存在的路由
    routers.forEach(item => {
      if (item.name == 'main' || item.name == 'login' || item.name == '404') {
        return
      } else {
        router.removeRoute(item.name)//删除当前路由器中已经存在的路由
      }
    })
    routerArr.forEach(item => {
      state.value.routerList.push(
        router.addRoute('main', item)
      )
    })
  }

  function clean() {
    state.value.routerList.forEach((item) => {
      if (item) item()

    })
    //清除路由器中所有的路由
    state.value = initState()
    //清除持久化存储的state
    localStorage.removeItem("store")
  }

  function updateMenuList(val) {
    state.value.menuList = val
  }



  //需要把所有定义的state，getters，actions返回出去

  return {
    state,
    selectMenu,
    updateMenuList,
    clean,
    addMenu
  }
})