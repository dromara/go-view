import path from 'path'
export const OUTPUT_DIR = 'dist'

// monaco-editor 路径
export const prefix = `monaco-editor/esm/vs`

// chunk 警告大小
export const chunkSizeWarningLimit = 2000

// 禁用 brotliSize 压缩大小报告
export const brotliSize = false

// 分包
export const rollupOptions = {
  output: {
    chunkFileNames: 'static/js/[name]-[hash].js',
    entryFileNames: 'static/js/[name]-[hash].js',
    assetFileNames: (chunkInfo) => {
      if(['.png', '.jpg', '.jpeg'].includes(path.extname(chunkInfo.name))) {
        return `static/[ext]/[name].[ext]`
      }
      return `static/[ext]/[name]-[hash].[ext]`
    },
    manualChunks: {
      jsonWorker: [`${prefix}/language/json/json.worker`],
      cssWorker: [`${prefix}/language/css/css.worker`],
      htmlWorker: [`${prefix}/language/html/html.worker`],
      tsWorker: [`${prefix}/language/typescript/ts.worker`],
      editorWorker: [`${prefix}/editor/editor.worker`]
    }
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
