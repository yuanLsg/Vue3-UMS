<template>
  <el-row class="home" :gutter="20">
    <el-col :span="8" style="margin-top: 20px;">
      <!-- shadow="hover":放卡片上呈现阴影 -->
      <el-card shadow="hover">
        <div class="user">
          <img :src="getImageUrl('user')" class="user"/>
          <div class="user-info">
            <p class="user-info-admin">Admin</p>
            <p class="user-info-p">超级管理员</p>
          </div>
        </div>
        <div class="login-info">
          <p>上次登录时间:
            <span>
              2025-06-12
            </span>
          </p>
          <p>上次登录地点:
            <span>
              湖北
            </span>
          </p>
        </div>
      </el-card>

      <el-card shadow="hover" class="user-table">
        <el-table :data="tableData">
          <el-table-column
            v-for="(val,key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          >
          </el-table-column>
        </el-table>
      </el-card>
    </el-col>

    <el-col :span="16" style="margin-top: 20px">
      <div class="num">
        <el-card
          :body-style="{display:'flex',padding:0}"
          v-for="item in countData"
          :key="item.name"
          >
          <!-- 图标 -->
          <component :is="item.icon" class="icons" :style="{background:item.color}"></component>
          <div class="detail">
            <p class="num">￥{{ item.value }}</p>
            <p class="txt">￥{{ item.name }}</p>
          </div>
        </el-card>
      </div>
      <!-- 建立折线图容器 -->
      <el-card class="top-echart">
        <div ref="echart" style="height: 280px">
        </div>
      </el-card>

      <div class="graph">
        <el-card>
          <div ref="userEchart" style="height: 240px"></div>
        </el-card>
        <el-card>
          <div ref="videoEchart" style="height: 240px"></div>
        </el-card>
      </div>
    </el-col>
  </el-row>
</template>

<script setup lang="js" name="Home">
import { ref,getCurrentInstance,onMounted,reactive } from 'vue'
import * as echarts from 'echarts'//引入echarts图表库

const {proxy}=getCurrentInstance()//获取当前组件实例
// proxy:实例对象，可以理解this
const getImageUrl=(user)=>{
  //根据传入的user参数，返回对应的图片路径
  // import.meta.url:获取当前模块的URL
  return new URL(`../assets/images/${user}.png`,import.meta.url).href
  }
const tableData = ref([])
const countData=ref([])
const chartData=ref([])
const observer=ref(null)
const tableLabel = ref({
    name: "课程",
    todayBuy: "今日购买",
    monthBuy: "本月购买",
    totalBuy: "总购买",
})

//这个是折线图和柱状图 两个图表共用的公共配置
//详情可以去echarts官网查看
const xOptions = reactive({
      // 图例文字颜色
      textStyle: {
        color: "#333",
      },
      legend: {},
      grid: {
        left: "20%",
      },
      // 提示框
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category", // 类目轴
        data: [],
        axisLine: {
          lineStyle: {
            color: "#17b3a3",
          },
        },
        axisLabel: {
          interval: 0,
          color: "#333",
        },
      },
      yAxis: [
        {
          type: "value",
          axisLine: {
            lineStyle: {
              color: "#17b3a3",
            },
          },
        },
      ],
      color: ["#2ec7c9", "#b6a2de", "#5ab1ef", "#ffb980", "#d87a80", "#8d98b3"],
      series: [],
})

//饼状图的配置
const pieOptions = reactive({
  tooltip: {
    trigger: "item",
  },
  legend: {},
  color: [
    "#0f78f4",
    "#dd536b",
    "#9462e5",
    "#a6a6a6",
    "#e1bb22",
    "#39c362",
    "#3ed1cf",
  ],
  series: []
})

const getTableData=async ()=>{
  const data=await proxy.$api.getTableData()
  // console.log(data);
  tableData.value=data.tableData
}

const getCountData=async ()=>{
  const data=await proxy.$api.getCountData()
  // console.log(data);
  countData.value=data
}

const getChartData=async ()=>{
  const {orderData,userData,videoData}=await proxy.$api.getChartData()
  //对第一个图标进行x轴 和series 赋值
  xOptions.xAxis.data=orderData.date//日期
  xOptions.series=Object.keys(orderData.data[0]).map(val=>{
    return{
      name:val,
      data:orderData.data.map(item=>item[val]),
      type:'line'
    }
  })
  const oneEchart=echarts.init(proxy.$refs['echart'])
  oneEchart.setOption(xOptions)


  //对第二个表格进行渲染
  xOptions.xAxis.data=userData.map(item=>item.date)
  xOptions.series=[
    {
      name:'新增用户',
      data:userData.map(item=>item.new),
      type:'bar'
    },
    {
      name:'活跃用户',
      data:userData.map(item=>item.active),
      type:'bar'
    },
  ]
  const twoEchart=echarts.init(proxy.$refs['userEchart'])
  twoEchart.setOption(xOptions)


  //对饼状图进行渲染
  pieOptions.series=[
    {
      data:videoData,
      type:'pie'
    }
  ]
  const threeEchart=echarts.init(proxy.$refs['videoEchart'])
  threeEchart.setOption(pieOptions)


  //监听页面的变化
  //ResizeObserver:如果监听的容器大小发生变化，改变了以后，会执行回调函数
  observer.value=new ResizeObserver((en)=>{
    oneEchart.resize()
    twoEchart.resize()
    threeEchart.resize()
  })

  //容器存在
  if(proxy.$refs['echart']){
    observer.value.observe(proxy.$refs['echart'])
  }
}

onMounted(()=>{
  getTableData()
  getCountData()
  getChartData()
})

// axios({
//   url:'/home/getTableData',
//   method:'get'
// }).then(res=>{
//   console.log(res.data);
//   //1要学会制造假数据，把交互的请求流程，根据接口文档跑通，还要制造出数据
//   //2有没有一种工具，拦截住请求，把我们制造的数据，根据接口文档来的——》Mock.js
//   if(res.data.code===200){
//     console.log(res.data.data.tableData);
//     tableData.value=res.data.data.tableData
//   }
// })
</script>

<style lang="less" scoped>
  .home{
    height: 120%;
    overflow: hidden;
    .user{
      display: flex;
      align-items: center;
      border-bottom: 1px solid #ccc;
      margin-bottom: 20px;
      .user-info{
        p{
          line-height: 40px;
        }
        .user-info-p{
          color: #999;
        }
        .user-info-admin{
          font-size: 35px;
        }
      }
      img{
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin-right: 40px;
      }
    }
    .login-info{
      p{
        line-height: 30px;
        font-size: 14px;
        color: #999;
        span{
          color: #666;
          margin-left: 60px;
        }
      }
    }
    .user-table{
      margin-top: 20px;
    }
    .num{
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .el-card{
        width: 32%;
        margin-bottom: 20px;
      }
      .icons{
        width: 80px;
        height: 80px;
        font-size: 30px;
        text-align: center;
        line-height: 80px;
        color: #fff;
      }
      .detail{
        margin-left: 15px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .num{
          font-size: 30px;
          margin-bottom: 10px;
        }
        .txt{
          font-size: 15px;
          text-align: center;
          color: #999;
        }
      }
    }
    .graph{
      margin-top: 21px;
      display: flex;
      justify-content: space-between;
      .el-card{
        width: 49%;
        height: 260px;
      }
    }
  }
</style>