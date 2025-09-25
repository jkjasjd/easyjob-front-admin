<script setup>
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { reactive } from 'vue'
import { RouterView } from 'vue-router'
const locale = zhCn
const config = reactive({
  max: 1
})
</script>

<template>
  <el-config-provider :locale="locale" :message="config">
    <RouterView />
  </el-config-provider>

</template>

<style scoped></style>
