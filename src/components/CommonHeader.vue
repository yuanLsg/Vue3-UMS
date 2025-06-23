<template>
  <div class="header">
    <div class="l-content">
      <!-- 点击触发 xiaoshi，用于展开/收起侧边栏。 -->
      <el-button size="small" @click="xiaoshi">
         <!-- 动态图标组件 -->
          <!-- //动态渲染名字为menu的组件，component是vue的内置组件 -->
        <component class="icons" is="menu"></component>
      </el-button>

      <!-- 面包屑导航  separator：分隔符为/-->
      <el-breadcrumb separator="/" class="bread">
        <el-breadcrumb-item :to="{ path: '/' }"> 首页 </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="r-content">
      <!-- 下拉菜单组件。 -->
      <el-dropdown>
        <span class="el-dropdown-link">
          <img :src="getImageUrl('user')" class="user">
        </span>
        <!-- 下拉菜单内容 -->
        <!-- 使用插槽来定义下拉菜单的内容 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人中心</el-dropdown-item>
            <el-dropdown-item @click="handleLoginOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script lang="js" setup name="CommonHeader">
import { ref,computed,} from 'vue';
import {useAllDataStore} from '@/stores/index'
import {useRouter} from 'vue-router'
const store=useAllDataStore()
const getImageUrl=(user)=>{
  return  new URL(`../assets/images/${user}.png`,import.meta.url).href
}
//控制侧边栏展开/收起
function xiaoshi(){
  store.isCollapse=!(store.isCollapse)
  
}
const router=useRouter()//获取路由实例
// 退出登录
const handleLoginOut=()=>{
  store.clean()
  router.push('/login')
  
}
</script>

<style lang="less" scoped>
  .header{
    display: flex;
    // 主轴对齐方式
    justify-content: space-between;
    // 交叉轴对齐方式
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: #333;
  }
  .icons{
    width: 20px;
    height: 20px;
  }
  
  .l-content {
    display: flex;
    align-items: center;
    .el-button{
      margin-right: 20px;
    }
  }
  .r-content .user{
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  // 穿透
:deep(.bread span){
  color: #fff !important;
  cursor: pointer !important;
}
</style>