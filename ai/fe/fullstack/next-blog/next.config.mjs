/** @type {import('next').NextConfig} */
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ESM 里没有 __dirname，需要用 import.meta.url 推导出当前文件所在目录
const __dirname = dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  // 固定 Turbopack 的工作区根目录为本项目目录，
  // 避免被上层目录（学习）里的 package-lock.json 干扰模块解析
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;