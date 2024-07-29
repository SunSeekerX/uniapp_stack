import { defineConfig } from 'vite'
import path from 'path'
import uni from '@dcloudio/vite-plugin-uni'
import AutoImport from 'unplugin-auto-import/vite'
import setupExtend from 'unplugin-vue-setup-extend-plus/vite'
import { UnifiedViteWeappTailwindcssPlugin as uvtw } from 'weapp-tailwindcss/vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

import { plugins as postcssPlugins } from './postcss.config.cjs'

const isH5 = process.env.UNI_PLATFORM === 'h5'
const isApp = process.env.UNI_PLATFORM === 'app'
const WeappTailwindcssDisabled = isH5 || isApp

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [
    uni(),
    uvtw({
      disabled: WeappTailwindcssDisabled,
    }),
    AutoImport({
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      imports: ['vue', 'uni-app', 'pinia'],
      defaultExportByFilename: false,
      dirs: [],
      dts: './src/auto-imports.d.ts',
      vueTemplate: false,
      eslintrc: {
        enabled: true,
        filepath: './.eslintrc-auto-import.json',
        globalsPropValue: true,
      },
    }),
    setupExtend({}),
    createSvgIconsPlugin({
      iconDirs: [path.resolve(process.cwd(), 'src/components/svg_icon/svg_transparent')],
      symbolId: 'icon-[dir]-[name]',
      customDomId: '__svg__icons__dom__',
      svgoOptions: {
        full: true,
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              // (fill|stroke)
              attrs: ['fill'],
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  server: {
    port: 8991,
    https: false,
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  css: {
    postcss: {
      plugins: postcssPlugins,
    },
  },
})
