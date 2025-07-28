<script setup>
import { ref } from 'vue'

const latitude = ref(39.904989)
const longitude = ref(116.405285)
const markers = ref([
  {
    latitude: 39.904989,
    longitude: 116.405285,
    title: '北京'
  }
])

const show = ref(false)

const clickOpenPopup = () => {
  show.value = true
}

const close = () => {
  show.value = false
}
</script>

<template>
  <view class="collect-map-page">
    <map :latitude="latitude" :longitude="longitude" :markers="markers">
      <view class="header-con">
        <view class="con" @click="clickOpenPopup">
          <image class="icon-img" src="/static/list.png"></image>
          <view class="icon-title">列表</view>
        </view>
        <view class="con">
          <image class="icon-img" src="/static/collect.png"></image>
          <view class="icon-title">采集</view>
        </view>
      </view>

      <view class="control-con">
        <view class="local">
          <image class="local-img" src="/static/local.png"></image>
        </view>
      </view>
    </map>

    <wd-popup v-model="show" position="left" custom-style="width: 70%" @close="close">
      <text class="custom-txt">弹弹弹</text>
    </wd-popup>

  </view>
</template>

<style lang="scss" scoped>
.collect-map-page {
  width: 100%;
  height: 100vh;

  map {
    width: 100%;
    height: 100%;
  }

  .header-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20rpx;

    .con {
      display: flex;
      align-items: center;
      flex-direction: column;
      color: #fff;
      background-color: #4D80F0;
      padding: 4rpx 18rpx;
      border-radius: 8rpx;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
      box-sizing: border-box;

      // &:active {
      //   transform: scale(0.9);
      //   box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
      //   transition: all 0.3s;
      //   background-color: #f5f5f5;
      //   padding: 14rpx;
      // }
    }

    .icon-img {
      width: 40rpx;
      height: 40rpx;
    }
    .icon-title {
      font-size: 22rpx;
    }
  }

  .control-con {
    .local-img {
      width: 80rpx;
      height: 80rpx;
      background-color: #fff;
      padding: 12rpx;
      border-radius: 8rpx;
      box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);
      position: absolute;
      bottom: 520rpx;
      left: 60rpx;
      box-sizing: border-box;

      &:active {
        transform: scale(0.9);
        box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        background-color: #f5f5f5;
        padding: 14rpx;
      }
    }
  }
}
</style>
