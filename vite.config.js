import { defineConfig } from 'vite'

/**
 * GitHub Pages 友好配置：
 * - base: './' 让资源路径在子路径/本地文件预览时更稳定
 * - 默认输出到 dist/，并使用哈希文件名（Vite 默认开启）
 */
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})

