import { createI18n } from 'vue-i18n'
import axios from 'axios'
import { isNil, isPlainObject } from 'lodash'
import dayjs from 'dayjs'

// import { storageAppLocale } from '@/constant'
import zh_CN from './locales/zh-cn'
import en_US from './locales/en'
import zh_TW from './locales/zh-tw'

export { dayjs }

// Constant
export const constant = {
  storageAppLocale: 'APP_LOCALE',
}

// Env
export const env = {
  viteAppEnv: import.meta.env.VITE_APP_ENV,
  viteBaseUrl: import.meta.env.VITE_BASE_URL,
  viteSiteName: import.meta.env.VITE_SITE_NAME,
  viteBuildCompress: import.meta.env.VITE_BUILD_COMPRESS,
  viteIsProd: import.meta.env.PROD === 'production',
}

// I18n
const onGetEnvLocale = () => {
  let localeKey = null
  let localeName = null
  const query = location.href
  let vars = query.split('lang=')
  if (vars && vars.length > 0 && vars[1] == 'zh_CN') {
    localeKey = 'zh-CN'
    localeName = '简体中文'
  } else if (vars && vars.length > 0 && vars[1] == 'en') {
    localeKey = 'en'
    localeName = 'English'
  } else if (vars && vars.length > 0 && vars[1] == 'zh_TW') {
    localeKey = 'zh-TW'
    localeName = '繁体中文'
  }
  // if (!localeKey) {
  //   const appLocale = storage.getStorageSync(storageAppLocale, true)
  //   if (appLocale) {
  //     localeKey = appLocale.localeKey
  //     localeName = appLocale.localeName
  //   }
  // }

  if (!localeKey) {
    let lang = navigator.language || navigator.userLanguage
    lang = lang.substr(0, 2)
    if (lang === 'zh') {
      localeKey = 'zh-CN'
      localeName = '简体中文'
    } else if (lang === 'en') {
      localeKey = 'en'
      localeName = 'English'
    } else if (lang === 'zh-TW') {
      localeKey = 'zh-TW'
      localeName = '繁体中文'
    }
  }

  if (!localeKey) {
    localeKey = import.meta.env.VITE_DEFAULT_LOCALE_KEY
    localeName = import.meta.env.VITE_DEFAULT_LOCALE_NAME
  }

  return {
    localeKey,
    localeName,
  }
}

export const { localeKey, localeName } = onGetEnvLocale()

export const i18n = createI18n({
  locale: localeKey,
  globalInjection: true,
  fallbackLocale: 'en',
  silentTranslationWarn: env.viteIsProd,
  messages: {
    en: en_US,
    'zh-CN': zh_CN,
    'zh-TW': zh_TW,
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

// Tools
export const tools = {
  /**
   * 去除对象中有key为undefined或者null的情况
   * @param { Object } obj
   * @returns { Object } 处理完成之后的对象
   */
  removeEmptyKey: (obj = {}, remove = true) => {
    for (const [key, value] of Object.entries(obj)) {
      if (isNil(value) || value === '') {
        remove ? delete obj[key] : (obj[key] = undefined)
      }
      if (isPlainObject(value)) {
        removeEmptyKey(value)
      }
    }
    return obj
  },

  isValidUrl: (urlString) => {
    const urlPattern = new RegExp(
      '^(https?:\\/\\/)?' + // validate protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
        '(\\#[-a-z\\d_]*)?$',
      'i',
    ) // validate fragment locator
    return !!urlPattern.test(urlString)
  },
}

// Apis
const createRequest = (axiosOptions, createOptions) => {
  createOptions = Object.assign(
    {
      packErr: true,
    },
    createOptions,
  )
  const { packErr = true } = createOptions

  const instance = axios.create(
    Object.assign(
      {
        withCredentials: false,
        timeout: 15000,
      },
      axiosOptions,
    ),
  )

  instance.interceptors.request.use(
    (config) => {
      if (config.method.toUpperCase() === 'GET') {
        tools.removeEmptyKey(config.params, false)
      } else {
        removeEmptyKey(config.data, false)
      }
      return config
    },
    (error) => Promise.reject(error),
  )

  instance.interceptors.response.use(
    (response) => response.data,
    (error) => {
      console.error(error)
      const result = {
        success: false,
        error: (error?.toJSON && error?.toJSON()) || error,
      }
      if (error.response) {
        const { data } = error.response
        result['code'] = data.code || 500
        result['msg'] = data.msg || data.message || 'Server response error'
        result['response'] = error.response
      } else if (error.request) {
        result['code'] = 400
        result['msg'] = error.message || 'Network error'
      } else {
        result['code'] = 400
        result['msg'] = error.message || 'App error'
      }
      if (packErr) {
        return Promise.resolve(result)
      } else {
        return Promise.reject(result)
      }
    },
  )

  return instance
}
const req = createRequest({
  baseURL: import.meta.env.VITE_BASE_URL,
})
export const api = {
  getApi: (data) => req({ url: '/get', method: 'GET', data }),
}

// Store
export const store = {
  useCounterStore: defineStore('counter', () => {
    const count = ref(0)
    const doubleCount = computed(() => count.value * 2)
    function increment() {
      count.value++
    }

    return { count, doubleCount, increment }
  }),
}
