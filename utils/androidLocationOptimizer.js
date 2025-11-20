// utils/androidLocationOptimizer.js

/**
 * UniApp Android专用定位优化服务
 */
class AndroidLocationOptimizer {
  constructor() {
    this.locationHistory = [];
    this.maxHistorySize = 10;
    this.lastBestLocation = null;
    this.optimizationEnabled = true;
  }

  /**
   * 获取优化后的Android定位数据
   */
  async getOptimizedAndroidLocation(options = {}) {
    const {
      strategy = 'hybrid',
      timeout = 20000,
      maxAttempts = 5,
      minAccuracy = 30,
      enableHistoryOptimization = true,
      useLastKnownLocation = true
    } = options;

    // 1. 首先尝试使用最后已知位置
    if (useLastKnownLocation && this.lastBestLocation) {
      const cachedAge = Date.now() - this.lastBestLocation.timestamp;
      if (cachedAge < 30000 && this.lastBestLocation.accuracy <= minAccuracy * 2) {
        console.log('使用缓存的优化位置');
        return this.lastBestLocation;
      }
    }

    // 2. 根据策略获取位置
    let locations = [];
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const location = await this.getLocationWithStrategy(strategy, timeout);
        
        if (this.isValidLocation(location, minAccuracy)) {
          locations.push(location);
          
          if (location.accuracy <= minAccuracy) {
            break;
          }
        }

        // 等待一段时间再尝试
        if (attempt < maxAttempts - 1) {
          const delay = this.calculateRetryDelay(attempt, location?.accuracy);
          await this.delay(delay);
        }
      } catch (error) {
        console.warn(`定位尝试 ${attempt + 1} 失败:`, error);
      }
    }

    if (locations.length === 0) {
      throw new Error('无法获取有效的定位数据');
    }

    // 3. 优化位置数据
    const optimizedLocation = this.optimizeLocationData(locations, strategy);
    
    // 4. 更新缓存
    this.updateLocationHistory(optimizedLocation);
    this.lastBestLocation = optimizedLocation;

    return optimizedLocation;
  }

  /**
   * 根据策略获取位置
   */
  async getLocationWithStrategy(strategy, timeout) {
    const baseConfig = {
      type: 'gcj02',
      geocode: true
    };

    switch (strategy) {
      case 'gps_only':
        return this.getHighAccuracyLocation(baseConfig);

      case 'network_only':
        return this.getNetworkLocation(baseConfig);

      case 'hybrid':
      default:
        try {
          return await this.getHighAccuracyLocation(baseConfig);
        } catch (error) {
          console.log('高精度定位失败，尝试网络定位');
          return await this.getNetworkLocation(baseConfig);
        }
    }
  }

  /**
   * 获取高精度GPS定位
   */
  getHighAccuracyLocation(config) {
    return new Promise((resolve, reject) => {
      // UniApp 中使用 uni.getLocation
      uni.getLocation({
        ...config,
        isHighAccuracy: true, // 启用高精度
        success: (res) => {
          const enhancedLocation = this.enhanceAndroidLocation(res);
          resolve(enhancedLocation);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * 获取网络定位
   */
  getNetworkLocation(config) {
    return new Promise((resolve, reject) => {
      uni.getLocation({
        ...config,
        isHighAccuracy: false, // 关闭高精度，使用网络定位
        success: (res) => {
          const networkLocation = this.processNetworkLocation(res);
          resolve(networkLocation);
        },
        fail: (error) => {
          reject(error);
        }
      });
    });
  }

  /**
   * 增强Android定位数据
   */
  enhanceAndroidLocation(location) {
    const enhanced = { ...location };
    
    // 添加设备信息
    enhanced.deviceModel = this.getDeviceModel();
    enhanced.platform = this.getPlatform();
    
    // 根据设备型号调整精度评估
    enhanced.adjustedAccuracy = this.adjustAccuracyByDevice(
      location.accuracy, 
      enhanced.deviceModel
    );
    
    // 标准化坐标精度
    const normalizedCoords = this.normalizeAndroidCoordinates(
      location.latitude, 
      location.longitude, 
      enhanced.adjustedAccuracy
    );
    
    return {
      ...enhanced,
      ...normalizedCoords,
      locationType: 'gps',
      quality: this.assessLocationQuality(enhanced.adjustedAccuracy)
    };
  }

  /**
   * 处理网络定位数据
   */
  processNetworkLocation(location) {
    const processed = { ...location };
    
    // 网络定位的精度通常较差，进行保守估计
    processed.adjustedAccuracy = Math.max(location.accuracy || 50, 50);
    processed.locationType = 'network';
    processed.quality = 'medium';
    
    const normalizedCoords = this.normalizeAndroidCoordinates(
      location.latitude, 
      location.longitude, 
      processed.adjustedAccuracy
    );
    
    return {
      ...processed,
      ...normalizedCoords
    };
  }

  /**
   * 标准化Android坐标精度
   */
  normalizeAndroidCoordinates(latitude, longitude, accuracy) {
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

  /**
   * 根据设备型号调整精度评估
   */
  adjustAccuracyByDevice(accuracy, deviceModel) {
    const highPrecisionDevices = [
      'pixel', 'samsung galaxy', 'huawei p', 'xiaomi mi', 'mate', 'p40'
    ];
    
    const isHighPrecisionDevice = highPrecisionDevices.some(device => 
      deviceModel.toLowerCase().includes(device)
    );
    
    if (isHighPrecisionDevice) {
      return accuracy * 0.8;
    } else {
      return accuracy * 1.2;
    }
  }

  /**
   * 优化位置数据（核心算法）
   */
  optimizeLocationData(locations, strategy) {
    if (locations.length === 1) {
      return locations[0];
    }

    const filteredLocations = this.filterOutliers(locations);
    
    let optimizedLocation;
    
    switch (strategy) {
      case 'gps_only':
        optimizedLocation = this.selectBestByAccuracy(filteredLocations);
        break;
      case 'network_only':
        optimizedLocation = this.selectMostStable(filteredLocations);
        break;
      case 'hybrid':
      default:
        optimizedLocation = this.calculateWeightedAverage(filteredLocations);
        break;
    }

    // 应用历史数据优化
    if (this.optimizationEnabled && this.locationHistory.length > 0) {
      optimizedLocation = this.applyHistoricalOptimization(optimizedLocation);
    }

    return optimizedLocation;
  }

  /**
   * 过滤异常值
   */
  filterOutliers(locations) {
    if (locations.length <= 2) return locations;
    
    const centerLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
    const centerLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
    
    const distances = locations.map(loc => 
      this.calculateDistance(centerLat, centerLng, loc.latitude, loc.longitude)
    );
    
    const meanDistance = distances.reduce((sum, dist) => sum + dist, 0) / distances.length;
    const variance = distances.reduce((sum, dist) => sum + Math.pow(dist - meanDistance, 2), 0) / distances.length;
    const stdDev = Math.sqrt(variance);
    
    return locations.filter((loc, index) => 
      distances[index] <= meanDistance + 2 * stdDev
    );
  }

  /**
   * 选择精度最好的位置
   */
  selectBestByAccuracy(locations) {
    return locations.reduce((best, current) => 
      (current.accuracy || 1000) < (best.accuracy || 1000) ? current : best
    );
  }

  /**
   * 选择最稳定的位置
   */
  selectMostStable(locations) {
    if (locations.length === 1) return locations[0];
    
    const stabilityScores = locations.map((loc, index) => {
      let totalDistance = 0;
      locations.forEach((otherLoc, otherIndex) => {
        if (index !== otherIndex) {
          totalDistance += this.calculateDistance(
            loc.latitude, loc.longitude,
            otherLoc.latitude, otherLoc.longitude
          );
        }
      });
      return {
        location: loc,
        avgDistance: totalDistance / (locations.length - 1)
      };
    });
    
    return stabilityScores.reduce((best, current) => 
      current.avgDistance < best.avgDistance ? current : best
    ).location;
  }

  /**
   * 计算加权平均值
   */
  calculateWeightedAverage(locations) {
    const weights = locations.map(loc => 1 / Math.max(loc.accuracy || 50, 1));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    
    let avgLat = 0;
    let avgLng = 0;
    let avgAccuracy = 0;
    
    locations.forEach((loc, index) => {
      const weight = weights[index] / totalWeight;
      avgLat += loc.latitude * weight;
      avgLng += loc.longitude * weight;
      avgAccuracy += (loc.accuracy || 50) * weight;
    });
    
    const baseLocation = locations[0];
    return {
      ...baseLocation,
      latitude: avgLat,
      longitude: avgLng,
      accuracy: avgAccuracy,
      optimizationMethod: 'weighted_average',
      sourceLocationsCount: locations.length
    };
  }

  /**
   * 应用历史数据优化
   */
  applyHistoricalOptimization(currentLocation) {
    if (this.locationHistory.length === 0) return currentLocation;
    
    const recentHistory = this.locationHistory.slice(-3);
    const allLocations = [...recentHistory, currentLocation];
    
    return this.simpleKalmanFilter(allLocations);
  }

  /**
   * 简化的卡尔曼滤波
   */
  simpleKalmanFilter(locations) {
    const latest = locations[locations.length - 1];
    
    if (locations.length === 1) {
      return latest;
    }
    
    const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;
    const avgAccuracy = locations.reduce((sum, loc) => sum + (loc.accuracy || 50), 0) / locations.length;
    
    const kalmanGain = 0.7;
    const smoothedLat = latest.latitude * kalmanGain + avgLat * (1 - kalmanGain);
    const smoothedLng = latest.longitude * kalmanGain + avgLng * (1 - kalmanGain);
    
    return {
      ...latest,
      latitude: smoothedLat,
      longitude: smoothedLng,
      accuracy: Math.min(latest.accuracy || 50, avgAccuracy),
      optimizationMethod: 'kalman_smoothed'
    };
  }

  /**
   * 工具方法
   */
  calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  isValidLocation(location, minAccuracy) {
    return location && 
           location.latitude >= -90 && location.latitude <= 90 &&
           location.longitude >= -180 && location.longitude <= 180 &&
           (!location.accuracy || location.accuracy > 0) && 
           (!location.accuracy || location.accuracy < 1000);
  }

  calculateRetryDelay(attempt, accuracy) {
    const baseDelay = 1000;
    const accuracyFactor = accuracy > 100 ? 2 : 1;
    return baseDelay * (attempt + 1) * accuracyFactor;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateLocationHistory(location) {
    this.locationHistory.push({
      ...location,
      timestamp: Date.now()
    });
    
    if (this.locationHistory.length > this.maxHistorySize) {
      this.locationHistory = this.locationHistory.slice(-this.maxHistorySize);
    }
  }

  assessLocationQuality(accuracy) {
    if (accuracy <= 10) return 'excellent';
    if (accuracy <= 25) return 'good';
    if (accuracy <= 50) return 'fair';
    return 'poor';
  }

  getDeviceModel() {
    try {
      const systemInfo = uni.getSystemInfoSync();
      return systemInfo.model || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  getPlatform() {
    try {
      const systemInfo = uni.getSystemInfoSync();
      return systemInfo.platform || 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }
}

export default AndroidLocationOptimizer;