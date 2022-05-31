// 打包路径
export const OUTPUT_DIR = 'dist'

// chunk 警告大小
export const chunkSizeWarningLimit = 2000

// 禁用 brotli 压缩大小报告
export const brotliSize = false

// 分包
export const rollupOptions = {
  output: {
    chunkFileNames: 'static/js/[name]-[hash].js',
    entryFileNames: 'static/js/[name]-[hash].js',
    assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
  }
}

// 去除开发代码
export const terserOptions = {
  compress: {
    keep_infinity: true,
    drop_console: true,
    drop_debugger: true
  }
}