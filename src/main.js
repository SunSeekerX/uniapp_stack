// 导入依赖库
import Vue from 'vue'
import { mapState, mapGetters } from 'vuex'
import uView from '@/uni_modules/uview-ui'

// 导入文件
import App from '@/App'
import store from '@/store'

// 依赖库设置
Vue.config.productionTip = false

// 挂载全局组件和安装插件
Vue.use(uView)
Vue.mixin({
  computed: {
    // App system info
    ...mapState('appSystemInfo', ['appSystemInfo', 'appWindowInfo']),
    ...mapGetters('appSystemInfo', ['statusBarHeightGetter', 'navBarHeightGetter', 'pageHeightGetter', 'isIosGetter']),
    // App auth
    ...mapState('appAuth', ['appTokens', 'appUserInfo', 'appMpUserInfo']),
    ...mapGetters('appAuth', ['isAppAuthLogin']),
  },
})

// 挂载原型属性
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
  ...App,
  store,
})
app.$mount()
