/**
 * 导入依赖库
 */
import Vue from 'vue'
import utools from '@/uni_modules/limm-utools'
import uView from '@/uni_modules/uview-ui'

/**
 * 导入文件
 */
import App from './App'
import store from './store/index' // Vuex
import * as util from './utils/index' // 工具包
import * as constant from './constant' // 常量
import * as api from './apis' // Api
import * as handleError from './utils/handle-error' // 错误处理
import getEnv from './config/index' // 环境变量获取

/**
 * 依赖库设置
 */
Vue.config.productionTip = false

/**
 * 挂载全局组件和安装插件
 */
Vue.use(uView)

/**
 * 挂载原型属性
 */
Vue.prototype.$util = util
Vue.prototype.$utools = utools
Vue.prototype.$store = store
Vue.prototype.$constant = constant
Vue.prototype.$api = api
Vue.prototype.$handleError = handleError
Vue.prototype.$getEnv = getEnv

App.mpType = 'app'

const app = new Vue({
  ...App,
})
app.$mount()
