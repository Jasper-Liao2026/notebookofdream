import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  //发送了一个请求vite会介入
  server: {
    //代理
    proxy:{
      //前端想去后端请求 
      '/api':{
        target:'http://localhost:3000',
        secure:false,
        // /api/stream
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    port: 5174,
  },
  //利用vite来解决跨域
})


//跨域是浏览器环境下，同源策略的安全性问题