<!-- pages/location/location.vue -->
<template>
  <view class="location-container">
    <view class="optimization-panel">
      <text class="title">Android定位优化</text>
      <button @tap="onGetOptimizedLocation" :loading="isLoading">
        获取优化定位
      </button>
      <button @tap="onGetEnvironmentOptimizedLocation" :loading="isLoading">
        环境感知定位
      </button>
    </view>

    <view v-if="location" class="location-result">
      <view class="result-item">
        <text class="label">坐标:</text>
        <text class="value">{{ location.latitude.toFixed(6) }}, {{ location.longitude.toFixed(6) }}</text>
      </view>

      <view class="result-item">
        <text class="label">精度:</text>
        <text class="value" :class="location.quality">{{ location.accuracy ? location.accuracy.toFixed(1) : '未知' }}米</text>
      </view>

      <view class="result-item">
        <text class="label">质量:</text>
        <text class="value" :class="location.quality">{{ location.quality }}</text>
      </view>

      <view class="result-item" v-if="location.optimizationMethod">
        <text class="label">优化方法:</text>
        <text class="value">{{ location.optimizationMethod }}</text>
      </view>

      <view class="result-item" v-if="location.deviceModel">
        <text class="label">设备:</text>
        <text class="value">{{ location.deviceModel }}</text>
      </view>
    </view>

    <view v-if="optimizationLog.length > 0" class="optimization-log">
      <text class="log-title">优化日志</text>
      <view v-for="(item, index) in optimizationLog" :key="index" class="log-entry">
        <text class="log-time">{{ item.timestamp }}</text>
        <text class="log-detail">精度:{{ item.accuracy }}米 ({{ item.quality }})</text>
        <text class="log-method">{{ item.method }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import AndroidLocationOptimizer from '@/utils/androidLocationOptimizer.js';
import EnvironmentAwareLocationOptimizer from '@/utils/environmentAwareLocationOptimizer.js';

export default {
  data() {
    return {
      location: null,
      isLoading: false,
      isGettingLocation: false,
      optimizationLog: [],
      locationOptimizer: null,
      envOptimizer: null,
      miniOptimizer: null
    };
  },

  onLoad() {
    this.locationOptimizer = new AndroidLocationOptimizer();
    this.envOptimizer = new EnvironmentAwareLocationOptimizer();
  },

  onUnload() {
    if (this.locationOptimizer) {
      this.locationOptimizer.destroy();
      this.locationOptimizer = null;
    }
    if (this.envOptimizer) {
      this.envOptimizer.destroy();
      this.envOptimizer = null;
    }
    this.isGettingLocation = false;
  },

  methods: {
    async onGetOptimizedLocation() {
      // 防止重复调用
      if (this.isGettingLocation || this.isLoading) {
        console.log('定位正在进行中，忽略重复点击');
        return;
      }
      await this.getLocation(this.locationOptimizer, 'standard');
    },

    async onGetEnvironmentOptimizedLocation() {
      // 防止重复调用
      if (this.isGettingLocation || this.isLoading) {
        console.log('定位正在进行中，忽略重复点击');
        return;
      }
      await this.getLocation(this.envOptimizer, 'environment');
    },

    async getLocation(optimizer, type) {
      this.isLoading = true;
      this.isGettingLocation = true;

      try {
        const startTime = Date.now();

        let location;
        if (type === 'environment') {
          location = await optimizer.getEnvironmentOptimizedLocation();
        } else if (type === 'standard') {
          location = await optimizer.getOptimizedAndroidLocation({
            strategy: 'hybrid',
            timeout: 5000, // 减少超时
            maxAttempts: 2, // 减少尝试次数
            minAccuracy: 50,
            enableHistoryOptimization: false // 禁用历史优化
          });
        }

        const endTime = Date.now();

        this.location = location;
        this.logOptimizationResult(location, endTime - startTime, type);
        this.showLocationQuality(location);

      } catch (error) {
        console.error('优化定位失败:', error);

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
        this.isLoading = false;
        this.isGettingLocation = false;
      }
    },

    logOptimizationResult(location, duration, type) {
      const logEntry = {
        timestamp: new Date().toLocaleTimeString(),
        accuracy: location.accuracy ? location.accuracy.toFixed(1) : '未知',
        quality: location.quality,
        duration: duration + 'ms',
        method: location.optimizationMethod || 'single',
        device: location.deviceModel,
        type: type
      };

      this.optimizationLog.unshift(logEntry);
      if (this.optimizationLog.length > 10) {
        this.optimizationLog = this.optimizationLog.slice(0, 10);
      }
    },

    showLocationQuality(location) {
      let title = '定位成功';
      let icon = 'success';

      switch (location.quality) {
        case 'excellent':
          title = `精确定位 (${location.accuracy ? location.accuracy.toFixed(1) : '未知'}米)`;
          break;
        case 'good':
          title = `良好定位 (${location.accuracy ? location.accuracy.toFixed(1) : '未知'}米)`;
          break;
        case 'fair':
          title = `一般定位 (${location.accuracy ? location.accuracy.toFixed(1) : '未知'}米)`;
          icon = 'none';
          break;
        case 'poor':
          title = `粗略定位 (${location.accuracy ? location.accuracy.toFixed(1) : '未知'}米)`;
          icon = 'none';
          break;
        default:
          title = `定位成功 (${location.accuracy ? location.accuracy.toFixed(1) : '未知'}米)`;
      }

      uni.showToast({ title, icon });
    }
  }
};
</script>

<style scoped>
.location-container {
  padding: 20rpx;
}

.optimization-panel {
  margin-bottom: 30rpx;
}

.title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

button {
  margin: 10rpx 0;
}

.location-result {
  background: #f5f5f5;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 30rpx;
}

.result-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
}

.label {
  font-weight: bold;
  color: #333;
}

.value {
  color: #666;
}

.value.excellent {
  color: #07c160;
}

.value.good {
  color: #1989fa;
}

.value.fair {
  color: #ff976a;
}

.value.poor {
  color: #ee0a24;
}

.optimization-log {
  border-top: 1px solid #eee;
  padding-top: 20rpx;
}

.log-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
  margin-bottom: 20rpx;
}

.log-entry {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15rpx;
  font-size: 24rpx;
  color: #666;
}

.log-time {
  width: 120rpx;
}

.log-detail {
  flex: 1;
  text-align: center;
}

.log-method {
  width: 150rpx;
  text-align: right;
}
</style>
