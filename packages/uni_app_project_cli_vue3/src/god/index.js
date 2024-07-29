import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import 'dayjs/locale/en'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import { createI18n } from 'vue-i18n'
import { defineStore } from 'pinia'

import zh_CN from './locales/zh'
import en_US from './locales/en_US'
import * as uniapp from './uni-app'

const isNil = (value) => value === null || value === undefined
const isObjectLike = (value) => value && typeof value === 'object' && !Array.isArray(value)

dayjs.extend(localizedFormat)
dayjs.locale('en')

export { dayjs, uniapp }

// Constant
export const constant = {
  STORAGE_TOKEN: 'STORAGE_TOKEN',
  STORAGE_USERNAME: 'STORAGE_USERNAME',
  STORAGE_USER_INFO: 'STORAGE_USER_INFO',
  STORAGE_LOCALE_KEY: 'STORAGE_LOCALE_KEY',
}

// Env
export const defaultConfig = {
  // 默认环境（H5 打包不受这个配置影响）- dev | prod
  defaultEnv: 'prod',
  defaultLocale: 'zh-CN',
  // https://www.techonthenet.com/js/language_tags.php
  locales: {
    EN_US: {
      label: 'English',
      value: 'en-US',
    },
    ZH_CN: {
      label: '简体中文',
      value: 'zh-CN',
    },
  },
  enableLocales: ['EN_US', 'ZH_CN'],
}
export const env = {
  appEnv: process.env.VUE_APP_ENV || defaultConfig.defaultEnv,
}
export const envs = {
  dev: {
    BASE_URL: 'https://express.yoouu.cn',
  },
  prod: {
    BASE_URL: 'https://express.yoouu.cn',
  },
}
export const getEnv = (key) => {
  const val = envs?.[env.appEnv]?.[key]
  if (val == null) {
    console.error(`ENV: Cannot get the ${key} value!`)
  }
  return val
}

// I18n
export const getI18nLocale = (locale) => {
  switch (locale) {
    case defaultConfig.locales.EN_US.value:
      return 'en_US'
    case defaultConfig.locales.ZH_CN.value:
      return 'zh_CN'
    default:
      return 'en_US'
  }
}

const localeLocal = uni.getStorageSync(constant.STORAGE_LOCALE_KEY)
export const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: getI18nLocale(localeLocal) || getI18nLocale(defaultConfig.defaultLocale),
  messages: {
    zh_CN,
    en_US,
  },
})

export const t = i18n.global.t
export const getDayjsLocale = () => {
  const curLocale = i18n.global.locale
  switch (curLocale) {
    case defaultConfig.locales.EN_US.value:
      return 'en'
    case defaultConfig.locales.ZH_CN.value:
      return 'zh-cn'
    default:
      return 'en'
  }
}

export const getUniAppLocale = () => {
  // https://uniapp.dcloud.net.cn/api/ui/locale.html
  const curLocale = i18n.global.locale
  switch (curLocale) {
    case defaultConfig.locales.EN_US.value:
      return 'en'
    case defaultConfig.locales.ZH_CN.value:
      return 'zh-Hans'
    default:
      return 'en'
  }
}

// Tools
export const tools = {
  isNil,
  isObjectLike,
  removeObjNilVal: (obj) => {
    const removeNil = (currentObj) => {
      const result = Array.isArray(currentObj) ? [] : {}
      for (const [key, value] of Object.entries(currentObj)) {
        if (!isNil(value)) {
          if (isObjectLike(value)) {
            result[key] = removeNil(value)
          } else {
            result[key] = value
          }
        }
      }
      return result
    }

    return removeNil(obj)
  },
  executeOnceAtATime: (func) => {
    let isExecuting = false
    return function () {
      if (isExecuting) {
        return function () {}
      }
      isExecuting = true
      const context = this
      const args = arguments
      return func.apply(context, args).finally(() => {
        isExecuting = false
      })
    }
  },
}

// Apis
let loadingCount = 0
const showLoading = () => {
  if (loadingCount === 0) {
    uni.showLoading({ title: '', mask: true })
  }
  loadingCount++
}
const hideLoading = () => {
  loadingCount--
  if (loadingCount === 0) {
    uni.hideLoading()
  }
}
export const createRequest = (baseOptions, customOptions = {}) => {
  const http = new uniapp.HttpRequest(baseOptions, customOptions)

  http.setReqInterceptor(async (reqInfo) => {
    // const appStore = useAppStore()
    if (['get', 'GET'].includes(reqInfo.method)) {
      reqInfo.data = { ...reqInfo.data, _t: new Date().getTime() }
    }
    reqInfo.data = tools.removeObjNilVal(reqInfo.data || {})
    // if (appStore.mState.token) {
    //   reqInfo['header']['token'] = appStore.mState.token
    // }
    // reqInfo['header']['language'] = i18n.global.locale.value
    return reqInfo
  })

  http.setResInterceptor(async (res) => {
    return res.data
  })

  const tokenExpire = () => {
    // const appStore = useAppStore()
    // setTimeout(() => {
    //   appStore.onLoginOut()
    //   uniapp.route({
    //     url: '/',
    //     type: 'reLaunch',
    //   })
    // }, 18)
  }

  http.req = async (reqInfo, reqConfig) => {
    const shouldShowLoading =
      reqConfig?.showLoading !== undefined ? reqConfig.showLoading : http.customConfig.showLoading
    if (shouldShowLoading) {
      showLoading()
    }
    try {
      if (reqInfo.method.toUpperCase() === 'UPLOAD') {
        const res = await http.upload(reqInfo, reqConfig)
        return Promise.resolve(res)
      } else {
        const res = await http.request(reqInfo, reqConfig)
        if (res?.code === -1001) {
          tokenExpire()
        }
        return Promise.resolve(res)
      }
    } catch (res) {
      console.error(res)
      const packRes = {}
      if (res instanceof Error) {
        console.error('Frontend code error detected:', { res, config: reqInfo, reqConfig })
        packRes['success'] = false
        packRes['msg'] = 'Program running error'
      } else {
        console.error('Backend service error detected:', { res, config: reqInfo, reqConfig })
        packRes['success'] = false
        packRes['msg'] = 'Internal server error'
        if (res?.data?.code === 'A401') {
          tokenExpire()
        }
      }
      return customOptions.packErr ? Promise.resolve(packRes) : Promise.reject(packRes)
    } finally {
      if (shouldShowLoading) {
        hideLoading()
      }
    }
  }

  return http
}
const baseHttp = createRequest({
  baseURL: getEnv('BASE_URL'),
  withCredentials: false,
  // header: {
  //   'content-type': 'application/x-www-form-urlencoded',
  // },
})
export const api = {
  getApi: (data) => baseHttp.req({ url: '/get', method: 'GET', data }),
}

// Store
const token = uni.getStorageSync(constant.STORAGE_TOKEN)
const username = uni.getStorageSync(constant.STORAGE_USERNAME)
const userInfo = uni.getStorageSync(constant.STORAGE_USER_INFO)

export const store = {
  useAppAuthStore: defineStore('appAuthStore', {
    state: () => ({
      token,
      username,
      userInfo: userInfo || {},
    }),
    actions: {
      onUpdateToken(val) {
        this.token = val
        uni.setStorageSync(constant.STORAGE_TOKEN, val)
      },
      onUpdateUsername(val) {
        this.username = val
        uni.setStorageSync(constant.STORAGE_USERNAME, val)
      },
      onUpdateUserInfo(val) {
        this.userInfo = val
        uni.setStorageSync(constant.STORAGE_USER_INFO, val)
      },
      async onGetUserInfo() {
        // const res = await userinfoSelectApi()
        // if (res.success) {
        //   console.log('onGetUserInfo>>>', res.data)
        //   this.userInfo = res.data
        //   uni.setStorageSync(constant.STORAGE_USER_INFO, res.data)
        // }
      },
      onLoginOut() {
        this.token = ''
        this.username = ''
        this.userInfo = {}
        uni.removeStorageSync(constant.STORAGE_TOKEN)
        uni.removeStorageSync(constant.STORAGE_USERNAME)
        uni.removeStorageSync(constant.STORAGE_USER_INFO)
      },
    },
    getters: {
      isLogin: (state) => !!state.token,
    },
  }),
  useAppSystemInfoStore: defineStore('appSystemInfoStore', {
    state: () => ({
      // 系统信息
      appSystemInfo: uni.getSystemInfoSync(),
      // 窗口高度，部分小程序无法使用
      appWindowInfo: uni.getWindowInfo(),
    }),
    actions: {
      onUpdateAppSystemInfoMutation() {
        this.appSystemInfo = uni.getSystemInfoSync()
      },
      onUpdateAppWindowInfo() {
        this.appWindowInfo = uni.getWindowInfo()
      },
    },
    getters: {
      // 状态栏高度
      statusBarHeightGetter(state) {
        return state.appSystemInfo?.statusBarHeight || 0
      },
      // 导航栏高度
      navBarHeightGetter(state) {
        const statusBarHeight = state?.appSystemInfo?.statusBarHeight || 0
        let navBarHeight = 44
        // #ifdef MP
        const custom = uni.getMenuButtonBoundingClientRect()
        navBarHeight = custom.height + (custom.top - statusBarHeight) * 2
        // #endif
        return navBarHeight
      },
      // 页面高度，排除状态栏、底部安全区域
      pageHeightGetter: (state) =>
        state.appSystemInfo.screenHeight -
        state.appSystemInfo.statusBarHeight -
        state.appSystemInfo.safeAreaInsets.bottom,
      // 是否为 ios 设备
      isIosGetter(state) {
        return state.appSystemInfo?.osName === 'ios'
      },
    },
  }),
}
