<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'

const scale = ref(20)
const latitude = ref(0)
const longitude = ref(0)
const markers = ref([
  {
    id: 1,
    latitude: latitude.value,
    longitude: longitude.value,
    iconPath: '/static/now-local.png',
    width: 30,
    height: 30
  }
])
const key = ref('')

const envOptimizer = ref(null)
const isLoading = ref(false)

const clickSubmit = () => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      uni.$emit('local', { key: key.value, latitude: markers.value[0].latitude, longitude: markers.value[0].longitude })
    }
  })
}

const normalizeAndroidCoordinates = (latitude, longitude, accuracy) => {
    let decimalPlaces;
    
    if (accuracy <= 10) {
      decimalPlaces = 7;
    } else if (accuracy <= 50) {
      decimalPlaces = 6;
    } else {
      decimalPlaces = 5;
    }
    
    return {
      latitude: Number(parseFloat(latitude).toFixed(decimalPlaces)),
      longitude: Number(parseFloat(longitude).toFixed(decimalPlaces)),
      originalLatitude: latitude,
      originalLongitude: longitude
    };
  }

const clickGetEnvLocation = async () => {
  try {
    uni.showLoading({ title: '获取定位中...' })
    await getLocation()
  } catch (error) {
    console.error('获取环境优化定位失败:', error)
    uni.showToast({
      title: '定位失败，请检查权限和网络',
      icon: 'none'
    })
  } finally {
    uni.hideLoading()
  }
}

// 设置标记位置
const setMarkersLocation = (res) => {
  latitude.value = res.latitude
  longitude.value = res.longitude
  markers.value[0].latitude = res.latitude
  markers.value[0].longitude = res.longitude
}

const getLocation = async () => {
  isLoading.value = true

  try {
    uni.getLocation({
      type: 'gcj02',
      isHighAccuracy: true,
      altitude: false,
      highAccuracyExpireTime: 20000,
      success: (res) => {
        const handlerRes = normalizeAndroidCoordinates(res.latitude, res.longitude, res.accuracy)
        console.log('优化定位结果:', res, handlerRes)
        setMarkersLocation(handlerRes)
      },
      fail: (err) => {
        console.log(err)
      }
    })
  } catch (error) {
    console.error('优化定位失败:', error)
    uni.showToast({
      title: '定位失败，请检查权限和网络',
      icon: 'none'
    })
  } finally {
    isLoading.value = false
  }
}

onLoad((param) => {
  key.value = param.key
  clickGetEnvLocation()
})
onUnload(() => {
  uni.offLocationChange()
})
</script>

<template>
  <view class="select-map-page">
    <map :latitude="latitude" :longitude="longitude" :markers="markers" :scale="scale" :show-location="true">
      <view class="control-con">
        <view class="local" @click="clickGetEnvLocation">
          <image class="local-img" src="/static/local.png"></image>
        </view>
      </view>

      <view class="local-box">
        <view class="local-item">
          <view class="local-item-con">
            <view class="local-item-title">纬度坐标</view>
            <view class="local-item-desc">{{ latitude }}</view>
          </view>
        </view>
        <view class="local-item">
          <view class="local-item-con">
            <view class="local-item-title">经度坐标</view>
            <view class="local-item-desc">{{ longitude }}</view>
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
      right: 60rpx;
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
