import fs from 'fs'
import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import setupExtend from 'unplugin-vue-setup-extend-plus/vite'
import compression from 'vite-plugin-compression'
import VueDevTools from 'vite-plugin-vue-devtools'

import { dayjs } from './src/kiwi/libs'

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd())
  const isBuild = command.includes('build')
  const { VITE_BUILD_COMPRESS } = env

  const plugins = [
    VueDevTools(),
    vue(),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ['vue', 'vue-router', 'pinia'],
      defaultExportByFilename: false,
      dirs: [],
      dts: './src/auto-imports.d.ts',
      vueTemplate: false,
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
      // resolvers: [ElementPlusResolver()],
    }),
    // Components({
    //   resolvers: [ElementPlusResolver(), NaiveUiResolver()],
    // }),
    setupExtend({}),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/static/images/svg')],
      symbolId: 'icon-[dir]-[name]',
      customDomId: '__svg__icons__dom__',
    }),
    {
      name: 'log-build-info-dev',
      apply: 'serve',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/build-info.txt') {
            const buildTime = dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
            const buildHash = process.env.VITE_BUILD_HASH || 'N/A'
            res.setHeader('Content-Type', 'text/plain')
            res.end(`Build Time: ${buildTime}\nBuild Hash: ${buildHash}`)
          } else {
            next()
          }
        })
      },
    },
    {
      name: 'log-build-info',
      apply: 'build',
      closeBundle() {
        const buildTime = dayjs().utcOffset(8).format('YYYY-MM-DD HH:mm:ss')
        const buildHash = process.env.VITE_BUILD_HASH || 'N/A'
        const fileName = 'build-info.txt'
        const fileContent = `Build Time: ${buildTime}\nBuild Hash: ${buildHash}`
        const filePath = path.resolve(__dirname, 'dist', fileName)
        setTimeout(() => {
          fs.writeFileSync(filePath, fileContent, 'utf-8')
          console.log(`File ${fileName} created at ${filePath}`)
          console.log(`Build completed at: ${buildTime} and hash ${buildHash}`)
        }, 1000)
      },
    },
  ]

  if (isBuild && VITE_BUILD_COMPRESS) {
    const compressList = VITE_BUILD_COMPRESS.split(',')
    if (compressList.includes('gzip')) {
      plugins.push(
        compression({
          ext: '.gz',
          deleteOriginFile: false,
        }),
      )
    }
    if (compressList.includes('brotli')) {
      plugins.push(
        compression({
          ext: '.br',
          algorithm: 'brotliCompress',
          deleteOriginFile: false,
        }),
      )
    }
  }

  return {
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 1500,
    },
    optimizeDeps: {
      esbuildOptions: {
        target: 'es2020',
      },
    },
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        'vue-i18n': 'vue-i18n/dist/vue-i18n.cjs.js',
        process: 'process/browser',
        util: 'util',
      },
    },
    esbuild: {
      drop: ['console', 'debugger'],
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler', // or 'modern'
          // But if you want to just silence deprecation warnings, use silenceDeprecations option:
          // silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
  }
})
