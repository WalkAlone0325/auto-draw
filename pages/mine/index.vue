<script setup>
import { ref } from 'vue'

const cells = ref([
  { title: '权限查看', icon: '/static/mine/icon1.png' },
  { title: '权限管理', icon: '/static/mine/icon2.png' },
  { title: '用户协议', icon: '/static/mine/icon3.png' },
  { title: '隐私协议', icon: '/static/mine/icon4.png' },
  { title: '设置中心', icon: '/static/mine/icon5.png' }
])

const clickInfo = () => {
  uni.navigateTo({
    url: '/pages/mine/info'
  })
}

const clickCell = (i) => {
  uni.showToast({
    title: i.title,
    icon: 'none'
  })
}
</script>


<template>
  <view class="mine-page">
    <view class="mine-header" @click="clickInfo">
      <view class="header-left">
        <image class="avatar" src="/static/logo.png" mode="widthFix"></image>
        <view class="info">
          <view class="name">用户名</view>
          <view class="sex">性别：男</view>
        </view>
      </view>
      <view class="header-right">
        <wd-icon name="arrow-right" size="20px" color="#666"></wd-icon>
      </view>
    </view>

    <view class="mine-main">
      <view style="margin: 20rpx 0;">
        <wd-cell size="large" clickable>
          <template>
            <wd-icon name="arrow-right" size="18px" color="#999"></wd-icon>
          </template>
          <template #icon>
            <view class="cell-con">
              <image class="icon" src="/static/mine/notice.png" mode="widthFix"></image>
              <!-- <wd-icon custom-style="margin-right: 12rpx" :name="i.icon" size="24px" color="#666"></wd-icon> -->
              <view class="title">通知消息</view>
            </view>
          </template>
        </wd-cell>
      </view>
      <wd-cell-group border center>
        <wd-cell center size="large" clickable v-for="i in cells" :key="i.title" @click="clickCell(i)">
          <!-- <template #default>
            <wd-icon name="arrow-right" size="18px" color="#999"></wd-icon>
          </template> -->
          <template #icon>
            <view class="cell-con">
              <image class="icon" :src="i.icon" mode="widthFix"></image>
              <view class="title">{{ i.title }}</view>
            </view>
          </template>
        </wd-cell>
      </wd-cell-group>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.mine-page {
  // background-color: #f5f5f5;

  .mine-header {
    background-color: #F8F8F8;
    padding: 40rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .header-left {
      display: flex;
      align-items: center;
      margin-left: 20rpx;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        border: 6rpx solid #fff;
      }

      .info {
        margin-left: 40rpx;
        padding-top: 20rpx;

        .sex {
          color: #666;
          font-size: 24rpx;
          margin-top: 10rpx;
        }
      }
    }
  }

  .cell-con {
    display: flex;
    align-items: center;
  }

  .icon {
    width: 42rpx;
    height: 42rpx;
    margin-top: -2rpx;
    overflow: hidden;
    margin-right: 20rpx;
  }
}
</style>
