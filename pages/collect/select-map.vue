<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const scale = ref(18)
const latitude = ref('')
const longitude = ref('')
const markers = ref([])
const key = ref('')

const initMap = () => {
  uni.getLocation({
    type: 'gcj02',
    success: (res) => {
      latitude.value = res.latitude
      longitude.value = res.longitude
      markers.value = [{
        id: 1,
        latitude: res.latitude,
        longitude: res.longitude,
        iconPath: '/static/now-local.png',
        width: 30,
        height: 30
      }]
    },
    fail: (res) => {
      console.log('🚀:>> ', res)
    }
  })
}
const clickLocal = () => {
  initMap()
}

const clickSubmit = () => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      uni.$emit('local', { key: key.value, latitude: markers.value[0].latitude, longitude: markers.value[0].longitude })
    }
  })
}

const regionchange = (e) => {
  const {type, centerLocation} = e.detail
  if(type === 'end') {
    markers.value[0].latitude = centerLocation.latitude
    markers.value[0].longitude = centerLocation.longitude
  }
}

onLoad((param) => {
  key.value = param.key
  initMap()
})
</script>

<template>
  <view class="select-map-page">
    <map :latitude="latitude" :longitude="longitude" :markers="markers" :scale="scale" :show-location="true" @regionchange="regionchange">
      <view class="control-con">
        <view class="local" @click="clickLocal">
          <image class="local-img" src="/static/local.png"></image>
        </view>
      </view>

      <view class="local-box">
        <view class="local-item">
          <view class="local-item-con">
            <view class="local-item-title">纬度坐标</view>
            <view class="local-item-desc">{{markers[0].latitude}}</view>
          </view>
        </view>
        <view class="local-item">
          <view class="local-item-con">
            <view class="local-item-title">经度坐标</view>
            <view class="local-item-desc">{{markers[0].longitude}}</view>
          </view>
        </view>
        <view class="btn-con">
          <wd-button type="primary" block :round="false" @click="clickSubmit">确定</wd-button>
        </view>
      </view>
    </map>
  </view>
</template>

<style lang="scss" scoped>
.select-map-page {
  width: 100%;
  height: 100vh;

  map {
    width: 100%;
    height: 100%;
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

  .local-box {
    position: absolute;
    bottom: env(safe-area-inset-bottom);
    left: 30rpx;
    right: 30rpx;
    background-color: #fff;
    padding: 30rpx;
    border-radius: 8rpx;
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.3);

    .local-item {
      margin-bottom: 20rpx;

      .local-item-con {
        flex-direction: column;
        font-size: 28rpx;
        padding-bottom: 10rpx;

        .local-item-title {
        padding-bottom: 10rpx;
        }

        .local-item-desc {
          font-weight: 500;
          border: 1rpx solid #eee;
          border-radius: 10rpx;
          padding: 15rpx 20rpx;
        }
      }
    }
  }
}
</style>
