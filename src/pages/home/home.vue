<template>
  <view class="content">
    <image class="logo" src="/static/images/logo.png" />
    <view>
      <text class="title">{{ title }}</text>
    </view>
    <u-button type="primary" text="测试请求" @tap="onTestRequest" />
    <view>
      <text class="title">{{ res }}</text>
    </view>
  </view>
</template>

<script>
import combined from '@/utils/combined'
export default {
  name: 'PageHome',
  data() {
    return {
      title: 'Hello',
      res: '',
    }
  },
  onLoad() {},
  methods: {
    async onTestRequest() {
      const getRes = await combined.api.getApi()
      console.log('getRes>>>', getRes)
      if (getRes.success) {
        this.res = getRes
      } else {
        combined.utools.toast(getRes.msg)
      }
    },
  },
}
</script>

<style>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 200rpx;
  height: 200rpx;
  margin: 200rpx auto 50rpx;
}

.text-area {
  display: flex;
  justify-content: center;
}

.title {
  color: #8f8f94;
  font-size: 36rpx;
}
</style>
