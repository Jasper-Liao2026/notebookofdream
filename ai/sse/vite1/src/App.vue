<script setup>
import { ref } from 'vue'

const message = ref('')

fetch('/api/stream?prompt=hello')
  .then(res => res.json())           // 注意：json() 要加括号调用
  .then(data => {
    console.log(data)    // 把后端返回的 message 显示到页面
  })
</script>

<template>
  <div>
    <h1>BFF 返回的数据：</h1>
    <p>{{ message }}</p>
  </div>
</template>
