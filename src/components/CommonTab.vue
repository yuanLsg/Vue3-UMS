<template>
  <div class="tags">
    <el-tag
      v-for="(tag,index) in tags"
      :key="tag.name"
      :closable="tag.name !== 'home'"
      :effect="route.name ===tag.name ? 'dark' : 'plain'"
    >
    {{ tag.label }}
    </el-tag>
  </div>
</template>

<script setup lang="js" name="CommonTab">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
const tags=ref([
  {
    path: '/home',
    name: 'home',
    label: '首页',
    icon: 'home'
  }
])
const route=useRoute()
</script>

<style scoped lang="less">
.tags{
  margin:20px 0 0 20px;
}
.el-tag{
  margin-right:10px;
}
</style>