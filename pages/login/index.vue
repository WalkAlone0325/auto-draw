
<script setup>
import { reactive, ref } from 'vue'
import { encrypt } from '@/utils/jsencrypt'
import { loginApi, getInfoApi } from '@/api'

const model = reactive({
  username: '',
  password: '',
  xcxCode: ''
})

const form = ref()
const loading = ref(false)
function handleSubmit() {
  form.value.validate().then(async ({
    valid,
    errors
  }) => {
    if (valid) {
      loading.value = true
      // model.xcxCode = await getWxCode()
      const data = {
        username: model.username,
        password: encrypt(model.password),
        xcxCode: model.xcxCode
      }
      console.log('🚀:>> data: ', data)
      const res = await loginApi(data)
      if (res.code === 200) {
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
</script>

<template>
  <view class="login-page">
    <view class="login-con">
      <view class="login-form">
        <wd-form ref="form" :model="model" errorType="toast">
          <view class="title">用户登录</view>
          <wd-cell-group border>
            <wd-input label="账号" label-width="70px" prop="username" clearable v-model="model.username"
              placeholder="请输入账号" :rules="[{ required: true, message: '请填写账号' }]" />
            <wd-input label="密码" label-width="70px" prop="password" show-password v-model="model.password"
              placeholder="请输入密码" :rules="[{ required: true, message: '请填写密码' }]" />
          </wd-cell-group>
          <view class="footer">
            <wd-button type="primary" :loading="loading" @click="handleSubmit" block>立即登录</wd-button>
          </view>
        </wd-form>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
