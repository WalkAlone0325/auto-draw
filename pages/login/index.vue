<script setup>
import { reactive, ref } from 'vue'
import { encrypt } from '@/utils/jsencrypt'
import { loginApi, getInfoApi, oneLoginApi } from '@/api'

const model = reactive({
  username: '',
  password: '',
  xcxCode: ''
})

const form = ref()
const loading = ref(false)
const oneLoading = ref(false)
const oneLogin = ref(true)

function handleSubmit() {
  form.value.validate().then(async ({
    valid,
    errors
  }) => {
    if (valid) {
      loading.value = true
      model.xcxCode = await getWxCode()
      const data = {
        username: model.username,
        password: encrypt(model.password),
        xcxCode: model.xcxCode
      }
      console.log('🚀:>> data: ', data)
      const res = await loginApi(data)
      if (res.code === 200) {
        uni.setStorageSync('login', { username: model.username, password: model.password })
        uni.setStorageSync('token', res.data.token)
        const info = await getInfoApi()
        uni.setStorageSync('user', info.data.user)
        uni.switchTab({
          url: '/pages/index/index'
        })
      }
      loading.value = false
    }
  })
    .catch((error) => {
      console.log(error, 'error')
      loading.value = false
    })
}

const getWxCode = () => {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      onlyAuthorize: true,
      success: (res) => {
        if (res.code) {
          console.log('🚀:>> code: ', res.code)
          resolve(res.code)
        } else {
          console.log('登录失败！' + res.errMsg)
          reject(res.errMsg)
        }
      },
      fail: (err) => {
        console.log(err)
        reject(err)
      }
    })
  })
}

const handleOneLogin = async () => {
  oneLoading.value = true
  model.xcxCode = await getWxCode()
  const resD = await oneLoginApi(model.xcxCode)
  if (resD.code === 200) {
    uni.setStorageSync('token', resD.data.token)
    const info = await getInfoApi()
    uni.setStorageSync('user', info.data.user)
    uni.switchTab({
      url: '/pages/index/index'
    })
    oneLoading.value = false
  } else {
    oneLogin.value = false
    uni.showToast({
      title: '微信授权失败',
      icon: 'none'
    })
    const login = uni.getStorageSync('login')
    model.username = login.username
    model.password = login.password
    oneLoading.value = false
  }
}
</script>

<template>
  <view class="login-page">
    <!-- <wd-navbar :bordered="false" fixed placeholder safeAreaInsetTop>
      <template #left>
      </template>
<template #title>
        <view class="lg-title">登录</view>
      </template>
</wd-navbar> -->

    <view class="one-login" v-if="oneLogin">
      <view class="title">
        <view>您好，欢迎登录！</view>
      </view>
      <!-- <view class="title-con">智能油机运维平台</view> -->
      <wd-button :loading="oneLoading" block custom-class="login-btn" @click="handleOneLogin">微信授权一键登录</wd-button>
      <!-- <view class="one-login-btn" @click="handleOneLogin">微信授权一键登录</view> -->
    </view>

    <view class="login-con" v-if="!oneLogin">
      <view class="title">
        <view>您好，欢迎登录！</view>
      </view>

      <view class="login-form">
        <wd-form ref="form" :model="model" errorType="toast">
          <!-- <view class="title">自动绘图数据采集上报系统</view> -->
          <wd-input custom-class="custom-input" size="large" label="账号" label-width="50px" prop="username" clearable
            v-model="model.username" placeholder="请输入账号" :rules="[{ required: true, message: '请填写账号' }]" />
          <wd-input custom-class="custom-input" size="large" label="密码" label-width="50px" prop="password" show-password
            v-model="model.password" placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
          <view class="footer">
            <wd-button custom-class="login-btn" type="primary" :loading="loading" @click="handleSubmit"
              block>登录</wd-button>
          </view>
        </wd-form>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;

  .title {
    padding-top: 500rpx;
    padding-bottom: 120rpx;
    background: url("/static/pageBg.png") no-repeat top center;
    background-size: 100%;

    view {
      padding-left: 64rpx;
      font-size: 44rpx;
      font-weight: 700;
      line-height: 1;
    }
  }

  .one-login {

    :deep(.login-btn) {
      margin: 0 64rpx;
      height: 96rpx;
      line-height: 96rpx;
      border-radius: 48rpx;
      text-align: center;
      font-size: 32rpx;
      color: #000;
      background: linear-gradient(90deg, rgba(255, 222, 102, 1) 0%, rgba(202, 245, 253, 1) 100%);
    }
  }

  .login-con {
    .login-form {
      padding: 0 64rpx;

      :deep(.custom-input) {
        height: 96rpx;
        border-radius: 48rpx;
        border: 1rpx solid rgba(204, 204, 204, 1);
        padding: 0 48rpx;
        display: flex;
        align-items: center;
        margin-bottom: 40rpx;
      }

      .footer {
        margin-top: 80rpx;

        :deep(.login-btn) {
          height: 96rpx;
          line-height: 96rpx;
          border-radius: 48rpx;
          text-align: center;
          font-size: 32rpx;
          color: #000;
          background: linear-gradient(90deg, rgba(255, 222, 102, 1) 0%, rgba(202, 245, 253, 1) 100%);
        }
      }
    }
  }
}
</style>
