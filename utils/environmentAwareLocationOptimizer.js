// utils/environmentAwareLocationOptimizer.js

import AndroidLocationOptimizer from './androidLocationOptimizer.js';

/**
 * 环境感知的定位优化
 */
class EnvironmentAwareLocationOptimizer extends AndroidLocationOptimizer {
  constructor() {
    super();
    this.environment = this.detectEnvironment();
  }

  async detectEnvironment() {
    const systemInfo = uni.getSystemInfoSync();

    return {
      networkType: await this.getNetworkType(),
      isHighEndDevice: this.isHighEndDevice(systemInfo),
      platform: systemInfo.platform,
      system: systemInfo.system
    };
  }

  async getEnvironmentOptimizedLocation() {
    const env = await this.detectEnvironment();

    let strategy = 'hybrid';
    let timeout = 15000;
    let maxAttempts = 4;

    if (env.networkType === 'wifi') {
      strategy = 'hybrid';
      timeout = 10000;
    } else if (env.networkType === '4g') {
      strategy = 'gps_only';
    } else {
      strategy = 'gps_only';
      timeout = 20000;
      maxAttempts = 3;
    }

    return await this.getOptimizedAndroidLocation({
      strategy,
      timeout,
      maxAttempts,
      minAccuracy: 25
    });
  }

  getNetworkType() {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => resolve(res.networkType),
        fail: () => resolve('unknown')
      });
    });
  }

  isHighEndDevice(systemInfo) {
    const highEndKeywords = ['pixel', 'galaxy s', 'mate', 'p40', 'mi 10', 'mix'];
    return highEndKeywords.some(keyword =>
      systemInfo.model.toLowerCase().includes(keyword)
    );
  }
}

export default EnvironmentAwareLocationOptimizer;
