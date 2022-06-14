<template>
  <view class="content">
    <image class="logo" src="/static/images/logo.png"></image>
    <view>
      <text class="title">{{ title }}</text>
    </view>
    <u-button @tap="onTestRequest" type="primary" text="测试请求"></u-button>
  </view>
</template>

<script>
export default {
  name: 'PageHome',
  data() {
    return {
      title: 'Hello',
    }
  },
  onLoad() {},
  methods: {
    async onTestRequest() {
      const res = await this.$api.Express.get()
      if (res.success) {
        console.log(res)
      } else {
        this.$utools.toast(res.msg)
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
