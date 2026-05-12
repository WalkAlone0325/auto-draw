<script setup>
import { ref } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import EnvironmentAwareLocationOptimizer from '@/utils/environmentAwareLocationOptimizer.js'

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
const isGettingLocation = ref(false)

// 检查定位权限
const checkLocationPermission = () => {
  return new Promise((resolve) => {
    uni.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          resolve(true);
        } else if (res.authSetting['scope.userLocation'] === false) {
          // 权限被拒绝
          uni.showModal({
            title: '定位权限被拒绝',
            content: '需要在设置中开启定位权限，否则无法使用定位功能',
            confirmText: '去设置',
            success: (modalRes) => {
              if (modalRes.confirm) {
                uni.openSetting();
              }
              resolve(false);
            }
          });
        } else {
          // 首次请求权限
          uni.authorize({
            scope: 'scope.userLocation',
            success: () => resolve(true),
            fail: () => {
              uni.showToast({
                title: '定位权限被拒绝',
                icon: 'none'
              });
              resolve(false);
            }
          });
        }
      },
      fail: () => {
        resolve(false);
      }
    });
  });
};

const clickSubmit = () => {
  uni.navigateBack({
    delta: 1,
    success: () => {
      uni.$emit('local', { key: key.value, latitude: markers.value[0].latitude, longitude: markers.value[0].longitude })
    }
  })
}

const clickGetEnvLocation = async () => {
  // 防止重复调用
  if (isGettingLocation.value || isLoading.value) {
    console.log('定位正在进行中，忽略重复点击');
    return;
  }

  console.log('点击获取环境优化定位');
  if (!envOptimizer.value) {
    envOptimizer.value = new EnvironmentAwareLocationOptimizer();
  }

  try {
    // 检查权限
    const hasPermission = await checkLocationPermission();
    if (!hasPermission) {
      return;
    }

    uni.showLoading({ title: '获取定位中...' });
    isGettingLocation.value = true;
    isLoading.value = true;

    // 获取定位（增加超时保护）
    await getLocation(envOptimizer.value, 'environment', 10000);

  } catch (error) {
    console.error('获取环境优化定位失败:', error);

    // 根据错误类型提供更友好的提示
    let message = '定位失败，请检查权限和网络';
    if (error.code === 1) {
      message = '定位权限被拒绝，请在设置中开启';
    } else if (error.code === 2) {
      message = '定位服务未开启，请在设置中开启定位服务';
    } else if (error.message && error.message.includes('定位正在进行中')) {
      message = '定位正在进行中，请稍候...';
    }

    uni.showToast({
      title: message,
      icon: 'none',
      duration: 2000
    });
  } finally {
    uni.hideLoading();
    isLoading.value = false;
    isGettingLocation.value = false;
  }
}

// 设置标记位置
const setMarkersLocation = (res) => {
  if (!res || typeof res.latitude !== 'number' || typeof res.longitude !== 'number') {
    console.warn('无效定位结果，不更新标记', res);
    return;
  }

  latitude.value = res.latitude;
  longitude.value = res.longitude;
  if (markers.value.length === 0) {
    markers.value.push({
      id: 1,
      latitude: res.latitude,
      longitude: res.longitude,
      iconPath: '/static/now-local.png',
      width: 30,
      height: 30
    });
  } else {
    markers.value[0].latitude = res.latitude;
    markers.value[0].longitude = res.longitude;
  }
}

const getLocation = async (optimizer, type, timeout = 10000) => {
  try {
    let locationResult;

    if (type === 'environment') {
      // 等待环境信息初始化完成
      if (!optimizer.environment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        if (!optimizer.environment) {
          throw new Error('环境信息初始化失败');
        }
      }
      locationResult = await optimizer.getEnvironmentOptimizedLocation();
    } else if (type === 'standard') {
      locationResult = await optimizer.getOptimizedAndroidLocation({
        strategy: 'hybrid',
        timeout,
        maxAttempts: 2, // 减少尝试次数
        minAccuracy: 25,
        enableHistoryOptimization: false // 禁用历史优化以提升速度
      });
    }

    if (!locationResult || typeof locationResult.latitude !== 'number' || typeof locationResult.longitude !== 'number') {
      throw new Error('定位返回结果无效');
    }

    console.log('优化定位结果:', locationResult);
    setMarkersLocation(locationResult);

    return locationResult;
  } catch (error) {
    console.error('优化定位失败:', error);
    throw error;
  }
}

onLoad((param) => {
  key.value = param.key;
  envOptimizer.value = new EnvironmentAwareLocationOptimizer();
  // 延迟调用定位，避免与onShow冲突
  setTimeout(() => {
    clickGetEnvLocation();
  }, 500);
});

// 页面卸载时清理资源
onUnload(() => {
  if (envOptimizer.value) {
    envOptimizer.value.destroy();
    envOptimizer.value = null;
  }
  isGettingLocation.value = false;
  isLoading.value = false;
});
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
