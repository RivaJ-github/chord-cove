<script lang="ts" setup>
import { onMounted, onUnmounted } from "vue";
import { createDiscreteApi } from "naive-ui";
import userBehavior from "./utils/log/userBehavior";
import visibilitychange from "./utils/visibilitychange"
import Index from './pages/index.vue'

window.$message = createDiscreteApi(['message']).message

let clearListener: Function | undefined

onMounted(() => {
  userBehavior.pageLoad()
  clearListener = visibilitychange(userBehavior.pageHide, userBehavior.pageShow)
})

onUnmounted(() => {
  clearListener?.()
  userBehavior.pageClose()
})
</script>

<template>
  <Index />
</template>
