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
  }
})
