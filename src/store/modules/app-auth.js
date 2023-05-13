import { STORAGE_TOKEN, STORAGE_USER_INFO, STORAGE_MP_USER_INFO } from '@/constant'
// import { getUserInfoApi } from '@/apis'

export default {
  namespaced: true,
  state: {
    // Tokens
    appTokens: uni.getStorageSync(STORAGE_TOKEN) || {},
    // 用户信息
    appUserInfo: uni.getStorageSync(STORAGE_USER_INFO) || {},
    // 小程序用户信息
    appMpUserInfo: uni.getStorageSync(STORAGE_MP_USER_INFO) || {},
  },
  mutations: {
    // 更新 tokens
    onUpdateAppTokensMutation(state, val) {
      state.appTokens = val
      uni.setStorageSync(STORAGE_TOKEN, val)
    },
    // 更新用户信息
    onUpdateAppUserInfoMutation(state, val) {
      state.appUserInfo = val
      uni.setStorageSync(STORAGE_USER_INFO, val)
    },
    // 更新小程序用户信息
    onUpdateAppMpUserInfoMutation(state, val) {
      state.appMpUserInfo = val
      uni.setStorageSync(STORAGE_MP_USER_INFO, val)
    },
    // 退出登录
    onAppAuthLogoutMutation(state) {
      state.appTokens = {}
      state.appUserInfo = {}
      state.appMpUserInfo = {}
      uni.removeStorageSync(STORAGE_TOKEN)
      uni.removeStorageSync(STORAGE_USER_INFO)
      uni.removeStorageSync(STORAGE_MP_USER_INFO)
    },
  },
  getters: {
    // 是否登录
    isAppAuthLogin(state) {
      return ![null, undefined].includes(state.appTokens?.token)
    },
    // 是否为会员
    isVipGetter(state) {
      return state.appUserInfo?.isMe === 1
    },
  },
  actions: {
    // 获取个人信息
    // onGetUserInfoAction({ commit, state }) {
    //   getUserInfoApi({
    //     token: state.token,
    //   })
    //     .then((res) => {
    //       if (res !== false) {
    //         commit('onUpdateAppUserInfoMutation', res.data)
    //       }
    //     })
    //     .catch((error) => {
    //       console.warn(error)
    //     })
    // },
  },
}
