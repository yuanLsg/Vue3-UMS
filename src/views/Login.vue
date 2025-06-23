<template>
  <div class="body-login">
        <el-form :model="loginForm" class="login-container">
      <h3>系统登录</h3>
        
      <el-form-item>
        <el-input
          type="input"
          placeholder="请输入账号"
          v-model="loginForm.username"
        >
        </el-input>
      </el-form-item>
        
      <el-form-item>
        <el-input
          type="password"
          placeholder="请输入密码"
          v-model="loginForm.password"
        >
        </el-input>
      </el-form-item>
        
      <el-form-item>
        <el-button type="primary" @click="login"> 登录 </el-button>
      </el-form-item>
        
    </el-form>
  </div>
</template>

<!-- <script setup lang="js" name="Login">
import { reactive} from 'vue';
import { getCurrentInstance } from 'vue'
const loginForm=reactive({
  username: '',
  password: ''
})

const { proxy } = getCurrentInstance()
const handleLogin = async () => {
  const res = await proxy.$api.getMenu(loginForm)
  console.log(res)
}
// const handleLogin = async () => {
//   try {
//     const res = await proxy.$api.getMenu(loginForm)
//     console.log(res)
//   } catch (error) {
//     console.error('登录请求失败：', error)
//     // 可以给用户提示
//   }
// }

</script> -->
<script setup>

import {reactive,getCurrentInstance} from 'vue'
import { useRouter } from 'vue-router';
import  {useAllDataStore} from '@/stores'

const { proxy } = getCurrentInstance();
const router=useRouter()
const store=useAllDataStore()
const loginForm = reactive({
  username: 'admin',
  password: 'admin',
});

const login=async ()=>{
    const res = await proxy.$api.getMenu(loginForm);
    // console.log(res);
    store.updateMenuList(res.menuList);
    store.state.token = res.token;
    store.addMenu(router)
    router.push("/home");
    // if(res){
    //   router.push("/home")
    // }
}
</script>


<style scoped lang="less">
.body-login{
  width: 100%;
  height: 100vh;
  background-image: url("../assets/images/pp.png");
  background-size: 85%;
  overflow: hidden;
}
.login-container {
  width: 400px;
  background-color: #fff;
  border: 1px solid #eaeaea;
  border-radius: 15px;
  padding: 35px 35px 15px 35px;
  box-shadow: 0 0 25px #cacaca;
  margin: 250px auto;
  h3{
    text-align: center;
    margin-bottom: 20px;
    color: #505450;
  }
  //穿刺效果
  :deep(.el-form-item__content) {
    justify-content: center
  }
}
</style>