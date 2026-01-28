import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // 代码分割配置
    rollupOptions: {
      output: {
        manualChunks: {
          // React 核心库单独打包
          'react-vendor': ['react', 'react-dom'],
          // 模型数据单独打包（较大的静态数据）
          'model-data': ['./src/data/models.json'],
        },
      },
    },
    // 启用 CSS 代码分割
    cssCodeSplit: true,
    // 设置 chunk 大小警告阈值 (500kb)
    chunkSizeWarningLimit: 500,
    // 压缩选项
    minify: 'esbuild',
    // 生成 sourcemap 便于调试生产问题
    sourcemap: false,
  },
  // 优化依赖预构建
  optimizeDeps: {
    include: ['react', 'react-dom'],
  },
})
