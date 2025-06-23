<template>
  <div class="user-header">
    <el-button type="primary" @click="handleAdd">
      新增
    </el-button>
    <!-- 表单 -->
     <!-- :inline="true"：表单横向 -->
    <el-form :inline="true" :model="formInline">
      <el-form-item label="请输入">
        <el-input placeholder="请输入用户名" v-model="formInline.keyWord">
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </el-form-item>
    </el-form>
  </div>
  <div class="table">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column 
      v-for="item in tableLabel"
      :key="item.prop"
      :width="item.width ? item.width : 125"
      :prop="item.prop"
      :label="item.label"
      />
      <el-table-column fixed="right" label="Operations" min-width="120">
        <template #="scope">
          <!-- #="scope":通过插槽，拿到这行数据，要进行操作 -->
          <el-button  type="primary" size="small" @click="handleEdit(scope.row)">
            编辑
          </el-button>
          <el-button  type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    // 分页组件
    <el-pagination
     class="pager"
      background 
      layout="prev, pager, next" :total="config.total"
      size="small"
      @current-change="handleChange"
    />
  </div>
  <!-- Dialog 弹出一个对话框， -->
   <el-dialog
    v-model="dialogVisible"
    :title="action == 'add' ? '新增用户' : '编辑用户'"
    width="35%"
    :before-close="handleClose"
  >
       <!--需要注意的是设置了:inline="true"，
		会对el-select的样式造成影响，我们通过给他设置一个class=select-clearn
		在css进行处理-->
    <el-form :inline="true"  :model="formUser" :rules="rules" ref="userForm">
      <el-row>
        <el-col :span="12">
          <el-form-item label="姓名" prop="name">
            <el-input v-model="formUser.name" placeholder="请输入姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="年龄" prop="age">
            <el-input v-model.number="formUser.age" placeholder="请输入年龄" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item class="select-clearn" label="性别" prop="sex">
            <el-select  v-model="formUser.sex" placeholder="请选择">
              <el-option label="男" value="1" />
              <el-option label="女" value="0" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="出生日期" prop="birth">
            <el-date-picker
              v-model="formUser.birth"
              type="date"
              placeholder="请输入"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item
          label="地址"
          prop="addr"
        >
          <el-input v-model="formUser.addr" placeholder="请输入地址" />
        </el-form-item>
      </el-row>
      <el-row style="justify-content: flex-end">
        <el-form-item>
          <el-button type="primary" @click="handleCancel">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script setup lang="js" name="User">
import {ref,getCurrentInstance,onMounted, reactive,nextTick} from 'vue'
import { ElMessage,ElMessageBox } from 'element-plus'
import { valid } from 'mockjs'//引入mockjs的valid方法
//valid方法是用来验证数据的合法性

const tableData =ref([])
// getCurrentInstance()可以用来获取当前组件实例 
const {proxy}=getCurrentInstance()
// proxy:实例对象，可以理解this
const getUserData=async ()=>{
  let data=await proxy.$api.getUserData(config)
  // console.log(data);
  tableData.value=data.list.map(item=>({
    ...item,
    sexLabel:item.sex==='1' ? '男' : '女'
  }))
  config.total=data.count
}
const tableLabel=reactive([
  {
    prop:'name',
    label:'姓名'
  },
  {
    prop:'age',
    label:'年龄'
  },
  {
    prop:'sexLabel',
    label:'性别'
  },
  {
    prop:'birth',
    label:'出生日期',
    width:200
  },
  {
    prop:'addr',
    label:'地址',
    width:400
  },
])
const formInline=reactive({
  keyWord:''
})
const config=reactive({
  name:'',
  total:0,
  page:1
})

//搜索
const handleSearch=()=>{
  config.name=formInline.keyWord
  getUserData()
}

//显示第几页
const handleChange=(page)=>{
  config.page=page
  getUserData()//重新获取数据
}

//删除数据
const handleDelete=(val)=>{
  // proxy.$api
  //ElMessageBox.confirm：删除提示函数
  //异步操作用async和await
  ElMessageBox.confirm("你确定要删除吗？").then(async ()=>{
    //proxy.$api:拿到实例对象
    //根据这行的id取到值
    await proxy.$api.deleteUser({id:val.id})
    //走到这一步说明删除成功了
    ElMessage({
      showClose:true,
      message:'删除成功',
      type:'success'
    })
    //删除成功后，重新调用getUserData拿到数据并渲染表格
    getUserData()
  })
}

const action=ref('add')
const dialogVisible=ref(false)
const formUser=reactive({
  sex:null
})
//表单校验规则
//表单校验规则
const rules = reactive({
  name: [{ required: true, message: "姓名是必填项", trigger: "blur" }],
  age: [
    { required: true, message: "年龄是必填项", trigger: "blur" },
    { type: "number", message: "年龄必须是数字" },
  ],
  sex: [{ required: true, message: "性别是必选项", trigger: "change" }],
  birth: [{ required: true, message: "出生日期是必选项" }],
  addr:[{ required: true, message: '地址是必填项' }]
})

//左上角关闭对话框
const handleClose=()=>{
  dialogVisible.value=false
  proxy.$refs['userForm'].resetFields()//重置注册表单
}
//取消关闭按钮
const handleCancel=()=>{
  dialogVisible.value=false
  proxy.$refs['userForm'].resetFields()//重置注册表单

}

const handleAdd=()=>{
  dialogVisible.value=true
  action.value='add'
}

const timeFormat=(time)=>{
  var time=new Date(time)
  var year=time.getFullYear()
  var month=time.getMonth()+1
  var date=time.getDate()
  function add(m){
    return m<10 ? '0'+m : m
  }
  return year+"-"+add(month)+"-"+add(date)
}
const onSubmit=()=>{
  //先要校验
  // proxy.$refs['userForm']:拿到表单的实例,上面已经给表单设置了ref="userForm"
  // ref:在vue3中，ref是一个响应式引用，可以用来获取DOM元素或组件实例
  // $refs:是vue实例的一个属性，用来访问子组件或DOM元素
  // validate:表单校验方法
  // valid:校验通过返回true，否则返回false
  proxy.$refs['userForm'].validate(async (valid)=>{
    //验证
    if(valid){
      let res=null
      //给日期赋值，并用正则检验是否符合格式
      // /^\d{4}-\d{2}-\d{2}$/：正则表达式，匹配日期格式YYYY-MM-DD
      // timeFormat(formUser.birth):如果不符合格式，则调用timeFormat函数进行格式化
      formUser.birth=/^\d{4}-\d{2}-\d{2}$/.test(formUser.birth) ? formUser.birth : timeFormat(formUser.birth)
      if(action.value==='add'){
        //新增用户，发送请求，返回结果赋值给res
        res=await proxy.$api.addUser(formUser)
      }else{
        //编辑用户，发送请求，返回结果赋值给res
        res=await proxy.$api.editUser(formUser)
      }
      //新增用户成功，重置表单
      if(res){
        dialogVisible.value=false
        proxy.$refs['userForm'].resetFields()//重置表单
        getUserData()//重新获取数据，刷新页面数据
      }
      //新增用户失败
    }else{
      ElMessage({
        showClose: true,
        message: "请输入输入正确内容",
        type: "error"
      })
    }
  })
}

//编辑用户
const handleEdit=(val)=>{
//这里的val是通过插槽拿到的scope.row
  action.value='edit'
  dialogVisible.value=true
  // Object.assign(formUser,{...val,sex:''+val.sex})
      nextTick(()=>{
        //因为在第一次显示弹窗的时候form组件没有加载出来，如果直接对formUser赋值，这个值会作为form表单的初始值
        //所以使用nextTick，赋值的操作在一个微任务中，这样就可以避免在from表单加载之前赋值
       
        Object.assign(formUser,{...val,sex:""+val.sex})
        //这里需要改变sex数据类型，是因为el-option的value有类型的校验
    })
}

onMounted(()=>{
  getUserData()
})

</script>

<style scoped lang="less">
  .user-header{
    display: flex;
    justify-content: space-between;
  }
  .table{
    position: relative;
    height: 520px;
    .pager{
      position: absolute;
      right: 10px;
      bottom:30px
    }
    .el-table{
      width: 100%;
      height: 500px;
    }
  }
  .select-clearn{
    display: flex;
  }
</style>