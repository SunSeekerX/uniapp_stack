import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { ElementPlusResolver, NaiveUiResolver } from 'unplugin-vue-components/resolvers'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import setupExtend from 'unplugin-vue-setup-extend-plus/vite'
import compression from 'vite-plugin-compression'
// import VueDevTools from 'vite-plugin-vue-devtools'
import { createHtmlPlugin } from 'vite-plugin-html'
// Refer https://gist.github.com/FbN/0e651105937c8000f10fefdf9ec9af3d
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// yarn add --dev @esbuild-plugins/node-globals-polyfill
// import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill'
// yarn add --dev @esbuild-plugins/node-modules-polyfill
// import { NodeModulesPolyfillPlugin } from '@esbuild-plugins/node-modules-polyfill'
// You don't need to add this to deps, it's included by @esbuild-plugins/node-modules-polyfill
// import rollupNodePolyFill from 'rollup-plugin-node-polyfills'
// import { polyfillNode } from 'esbuild-plugin-polyfill-node'

dayjs.extend(utc)
dayjs.extend(timezone)

// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isBuild = command.includes('build')
  const isProduction = mode === 'production'
  const { VITE_BUILD_COMPRESS } = env

  const plugins = [
    // VueDevTools(),
    vue(),
    nodePolyfills({
      // 是否添加全局变量 process, global 等
      globals: {
        process: true,
        global: true,
        Buffer: true,
      },
      // 是否启用 node:crypto 等模块前缀
      // protocolImports: true,
    }),
    createHtmlPlugin({
      minify: true,
      /**
       * ��������и����Զ�������
       * @see https://github.com/vbenjs/vite-plugin-html
       */
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ['vue', 'vue-router', 'pinia'],
      defaultExportByFilename: false,
      dirs: [],
      dts: './src/auto-imports.d.ts',
      // vueTemplate: false,
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
    // createSvgIconsPlugin({
    //   iconDirs: [path.resolve(process.cwd(), 'src/components/svg_icon/svgs')],
    //   symbolId: 'icon-[dir]-[name]',
    //   // svgoOptions: command === 'build',
    //   customDomId: '__svg__icons__dom__',
    //   svgoOptions: {
    //     full: true,
    //     plugins: [
    //       {
    //         name: 'removeAttrs',
    //         params: {
    //           // (fill|stroke)
    //           attrs: ['fill'],
    //         },
    //       },
    //     ],
    //   },
    // }),
    // createSvgIconsPlugin({
    //   // iconDirs: [path.resolve(process.cwd(), 'src/components/svg_icon/svgs')],
    //   iconDirs: [
    //     path.resolve(process.cwd(), 'src/components/svg_icon/colored'),
    //     path.resolve(process.cwd(), 'src/components/svg_icon/mono'),
    //   ],
    //   symbolId: 'icon-[dir]-[name]',
    //   customDomId: '__svg__icons__dom__',
    //   // svgoOptions: {
    //   //   plugins: [
    //   //     {
    //   //       name: 'removeAttrs',
    //   //       params: {
    //   //         attrs: {
    //   //           // 基础属性，所有图标都移除
    //   //           '*': ['class', 'data-name'],
    //   //           // mono 文件夹下的图标额外移除颜色属性
    //   //           'src/components/svg_icon/mono/*.svg': ['fill', 'stroke'],
    //   //         },
    //   //       },
    //   //     },
    //   //     {
    //   //       name: 'addAttributesToSVGElement',
    //   //       params: {
    //   //         attribute: {
    //   //           'src/components/svg_icon/mono/*.svg': {
    //   //             fill: 'currentColor',
    //   //           },
    //   //         },
    //   //       },
    //   //     },
    //   //   ],
    //   // },
    // }),
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

  /** @type {import('vite').UserConfig} */
  const config = {
    build: {
      target: 'es2020',
      chunkSizeWarningLimit: 5000,
      sourcemap: !isProduction,
      rollupOptions: {
        onwarn(warning, warn) {
          // 忽略 eval 使用的警告
          // if (warning.code === 'EVAL' && warning.id.includes('bip39-libs.js')) {
          //   return
          // }
          if (warning.code === 'EVAL') {
            return
          }
          // 对于其他警告，使用默认的警告处理
          warn(warning)
        },
        // plugins: [
        //   // Enable rollup polyfills plugin
        //   // used during production bundling
        //   // rollupNodePolyFill(),
        // ],
        // external: ['@solana/web3.js'],
      },
     // commonjsOptions: {
      //   transformMixedEsModules: true,
      // },
    },
    // optimizeDeps: {
    //   esbuildOptions: {
    //     target: 'es2020',
    //     // define: {
    //     //   global: 'globalThis',
    //     // },
    //     // Enable esbuild polyfill plugins
    //     plugins: [
    //       // nodeModulesPolyfillPlugin({
    //       //   globals: {
    //       //     process: true,
    //       //     Buffer: true,
    //       //   },
    //       // }),
    //       // NodeGlobalsPolyfillPlugin({
    //       //   process: true,
    //       //   buffer: true,
    //       // }),
    //       // NodeModulesPolyfillPlugin(),
    //       // polyfillNode({
    //       //   // Options (optional)
    //       // }),
    //     ],
    //   },
    //   // include: ['ethereumjs-wallet', 'buffer', 'crypto-browserify', 'stream-browserify', 'assert', 'events'],
    // },
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // web3: './node_modules/web3/dist/web3.min.js',
        process: 'process/browser',
        // util: 'util',
        // stream: 'stream-browserify',
        // zlib: 'browserify-zlib',
        // assert: 'assert',
        stream: 'stream-browserify',
        crypto: 'crypto-browserify',
        events: 'events',
        _stream_duplex: 'readable-stream/duplex',
        _stream_passthrough: 'readable-stream/passthrough',
        _stream_readable: 'readable-stream/readable',
        _stream_transform: 'readable-stream/transform',
        _stream_writable: 'readable-stream/writable',

        // util: 'rollup-plugin-node-polyfills/polyfills/util',
        // sys: 'util',
        // events: 'rollup-plugin-node-polyfills/polyfills/events',
        // stream: 'rollup-plugin-node-polyfills/polyfills/stream',
        // path: 'rollup-plugin-node-polyfills/polyfills/path',
        // querystring: 'rollup-plugin-node-polyfills/polyfills/qs',
        // // punycode: 'rollup-plugin-node-polyfills/polyfills/punycode',
        // punycode: path.resolve(__dirname, 'node_modules/punycode/punycode.js'),
        // url: 'rollup-plugin-node-polyfills/polyfills/url',
        // // string_decoder: 'rollup-plugin-node-polyfills/polyfills/string-decoder',
        // http: 'rollup-plugin-node-polyfills/polyfills/http',
        // https: 'rollup-plugin-node-polyfills/polyfills/http',
        // os: 'rollup-plugin-node-polyfills/polyfills/os',
        // assert: 'rollup-plugin-node-polyfills/polyfills/assert',
        // constants: 'rollup-plugin-node-polyfills/polyfills/constants',
        // _stream_duplex: 'rollup-plugin-node-polyfills/polyfills/readable-stream/duplex',
        // _stream_passthrough: 'rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough',
        // _stream_readable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/readable',
        // _stream_writable: 'rollup-plugin-node-polyfills/polyfills/readable-stream/writable',
        // _stream_transform: 'rollup-plugin-node-polyfills/polyfills/readable-stream/transform',
        // timers: 'rollup-plugin-node-polyfills/polyfills/timers',
        // console: 'rollup-plugin-node-polyfills/polyfills/console',
        // vm: 'rollup-plugin-node-polyfills/polyfills/vm',
        // zlib: 'rollup-plugin-node-polyfills/polyfills/zlib',
        // tty: 'rollup-plugin-node-polyfills/polyfills/tty',
        // domain: 'rollup-plugin-node-polyfills/polyfills/domain',
      },
      // extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    },
    server: {
      port: 5473,
      // host: false,
      // open: false,
      // proxy: {
      //   '/dev-api': {
      //     target: 'http://localhost:3000/api',
      //     changeOrigin: true,
      //     rewrite: (p) => p.replace(/^\/dev-api/, ''),
      //   },
      // },
    },
    // css: {
    //   preprocessorOptions: {
    //     scss: {
    //       // api: 'modern-compiler', // or 'modern' v6 default modern
    //       // But if you want to just silence deprecation warnings, use silenceDeprecations option:
    //       // silenceDeprecations: ['legacy-js-api'],
    //     },
    //   },
    // },
  }

  if (isProduction) {
    config.esbuild = {
      drop: ['console', 'debugger'],
    }
  }

  return config
})
