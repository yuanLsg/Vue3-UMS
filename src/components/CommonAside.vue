<template>
  <el-aside :width="width">
    <el-menu
      background-color="#545c64"
      text-color="#fff"
      :collapse="isCollapse"
      :collapse-transition="false"
      >
      <h3 v-show="!isCollapse">通用后台管理系统</h3>
      <h3 v-show="isCollapse">后台</h3>
      <el-menu-item
        v-for="item in noChildren"
        :index="item.path"
        :key="item.path"
        @click="handleMenu(item)"
        >
        <!-- 动态渲染菜单图标。 -->
        <component class="icons" :is="item.icon"></component>
        <span>{{ item.label }}</span>
      </el-menu-item>

      <!-- 如果有子菜单，则使用 el-sub-menu 组件 -->
      <!-- v-for 循环遍历 hasChildren 数组，生成子菜单 -->  
        <el-sub-menu
        v-for="item in hasChildren"
        :index="item.path"
        :key="item.path"
        >
          <template #title>
            <component class="icons" :is="item.icon"></component>
            <span>{{ item.label }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item
              v-for="(subItem,subIndex) in item.children"
              :index="subItem.path"
              :key="subItem.path"
              @click="handleMenu(subItem)"
            >
          <component class="icons" :is="subItem.icon"></component>
          <span>{{ subItem.label }}</span>
          </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
      </el-menu>
  </el-aside>
</template>

<script setup name="" lang="js">
import {ref,computed} from 'vue'
import {useAllDataStore} from '@/stores/index'
import { useRouter,useRoute } from 'vue-router'

// const list=ref([
//   {
//     path:'/home',
//     name:'home',
//     label:'首页',
//     icon:'house',
//     url:'Home'
//   },
//   {
//     path:'/mall',
//     name:'mall',
//     label:'商品管理',
//     icon:'video-play',
//     url:'Mall'
//   },
//   {
//     path:'/user',
//     name:'user',
//     label:'用户管理',
//     icon:'user',
//     url:'User'
//   },
//   {
//     path:'other',
//     label:'其他',
//     icon:'location',
//     children:[
//       {
//         path:'/page1',
//         name:'page1',
//         label:'页面1',
//         icon:'setting',
//         url:'Page1'
//       },
//       {
//         path:'/page2',
//         name:'page2',
//         label:'页面2',
//         icon:'setting',
//         url:'Page2'
//       },
//     ]
//   },
// ])

const noChildren=computed(()=>list.value.filter(item=>!item.children))//浅拷贝
const hasChildren=computed(()=>list.value.filter(item=>item.children))

const store=useAllDataStore()
const isCollapse=computed(()=>{
  return store.isCollapse
})
const width=computed(()=>store.isCollapse ? '64px' : '180px')

const router=useRouter()
const route=useRoute()//获取当前路由对象
const activeMenu=computed(()=>route.path)
const handleMenu=(item)=>{
  //获取当前路由对象，实现路由跳转router.push，页面跳转
  router.push(item.path)
  
}

const list=computed(()=>store.state.menuList)//菜单数据，来源于全局状态 menuList。
</script>

<style lang="less" scoped>
  .icons{
    width: 18px;
    height: 18px;
    margin-right: 5px;
  }
  .el-menu{
    border-right: none;
    h3{
      line-height: 48px;
      color: #fff;
      text-align: center;
      // background-color: #545c64;
    }
  }
.el-aside{
    height: 100vh;
    background-color: #545c64;
}
</style>