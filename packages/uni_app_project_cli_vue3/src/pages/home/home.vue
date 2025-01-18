<script setup>
import * as god from '@/god'

// #ifdef H5
import axios from 'axios'
// #endif

const mState = reactive({
  title: 'Hello',
  res: {},
  images: [],
})

const headers = {
  'content-type': 'multipart/form-data',
  // 'User-Agent': 'com.yiqun.gem/2.3.8-official Dalvik/2.1.0 (Linux; U; Android 13; XiaoMi 14 Build/TQ2A.230505.002)',
  'X-Custom-User-Agent': 'My-Custom-UA/1.0',
}

// 上传图片
const uploadImages = async () => {
  if (mState.images.length === 0) {
    god.uniapp.toast('请先选择图片')
    return
  }

  try {
    god.uniapp.showLoading('上传中...')

    // #ifdef H5
    const uploadTasks = mState.images.map(async (filePath) => {
      const formData = new FormData()
      // 将 base64 转换为文件对象
      const response = await fetch(filePath)
      const blob = await response.blob()
      const file = new File([blob], 'image.png', { type: 'image/png' })
      formData.append('file', file)

      const res = await axios.post(`${god.config.viteBaseUrl}/upload`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      })
      return res.data
    })
    // #endif

    // #ifdef APP-PLUS

    console.log('`${god.config.viteBaseUrl}/upload`>>>', `${god.config.viteBaseUrl}/upload`)
    const uploadTasks = mState.images.map((filePath) => {
      return new Promise((resolve, reject) => {
        uni.uploadFile({
          url: `${god.config.viteBaseUrl}/upload`,
          filePath,
          name: 'file',
          header: headers,
          success: (res) => {
            console.log('res.data>>>', res.data)
            try {
              const data = JSON.parse(res.data)
              console.log('data', data)
              resolve(data)
            } catch (e) {
              reject(e)
            }
          },
          fail: reject,
        })
      })
    })
    // #endif

    const results = await Promise.all(uploadTasks)
    mState.res = results
    god.uniapp.toast('上传成功')
  } catch (e) {
    god.uniapp.toast('上传失败')
    console.error('上传错误：', e)
  } finally {
    god.uniapp.hideLoading()
  }
}

// 选择图片
const chooseImages = async () => {
  try {
    // #ifdef H5
    const input = document.createElement('input')
    input.type = 'file'
    input.multiple = true
    input.accept = 'image/*'
    input.onchange = (e) => {
      const files = e.target.files
      if (files) {
        const fileUrls = Array.from(files).map((file) => URL.createObjectURL(file))
        mState.images = fileUrls.slice(0, 2) // 最多2张
      }
    }
    input.click()
    // #endif

    // #ifdef APP-PLUS
    const res = await uni.chooseImage({
      count: 2,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
    })
    mState.images = res.tempFilePaths
    // #endif
  } catch (e) {
    god.uniapp.toast('选择图片失败')
  }
}

// 测试请求
const onTestRequest = async () => {
  try {
    // #ifdef H5
    const res = await axios.get(`${god.config.viteBaseUrl}/test`, {
      headers,
    })
    if (res.data.success) {
      mState.res = res.data
    } else {
      god.uniapp.toast(res.data.msg)
    }
    // #endif

    // #ifdef APP-PLUS
    const res = await god.api.getApi({
      header: headers,
    })
    if (res.success) {
      mState.res = res
    } else {
      god.uniapp.toast(res.msg)
    }
    // #endif
  } catch (e) {
    god.uniapp.toast('请求失败')
    console.error('请求错误：', e)
  }
}

// 清除图片
const clearImages = () => {
  // #ifdef H5
  mState.images.forEach((url) => URL.revokeObjectURL(url))
  // #endif

  mState.images = []
  mState.res = {}
}

// 组件卸载时清理
onUnmounted(() => {
  // #ifdef H5
  mState.images.forEach((url) => URL.revokeObjectURL(url))
  // #endif
})
</script>

<template>
  <view class="flex flex-col justify-center items-center p-[20px]">
    <image class="w-[200rpx] h-[200rpx] mt-24" src="/static/images/logo.png" />
    <view class="mt-[20px]">
      <text class="text-[36rpx] text-[#8f8f94]">{{ mState.title }}</text>
    </view>

    <u-button type="primary" @click="onTestRequest" class="mb-[20px]"> 测试请求 </u-button>

    <view class="w-full">
      <u-button type="success" @click="chooseImages" class="mb-[20px]"> 选择图片(最多2张) </u-button>

      <view v-if="mState.images.length > 0" class="flex flex-wrap justify-center gap-[20rpx] mb-[20px]">
        <view v-for="(img, index) in mState.images" :key="index" class="relative">
          <image :src="img" class="w-[200rpx] h-[200rpx] rounded-lg" mode="aspectFill" />
        </view>
      </view>

      <view class="flex gap-[20rpx]" v-if="mState.images.length > 0">
        <u-button type="primary" @click="uploadImages"> 上传图片 </u-button>
        <u-button type="error" @click="clearImages"> 清除图片 </u-button>
      </view>
    </view>

    <view class="mt-[20px] w-full">
      <text class="text-[28rpx] text-[#8f8f94]">响应结果：</text>
      <view class="mt-[10px] bg-gray-100 p-[20rpx] rounded">
        <text class="text-[24rpx] break-all">{{ JSON.stringify(mState.res, null, 2) }}</text>
      </view>
    </view>
  </view>
</template>
