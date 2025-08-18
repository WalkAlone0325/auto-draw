<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSectionDetailApi, addProjectApi, updateProjectApi } from '@/api'

const loading = ref(false)
const form = ref(null)
const model = ref({
})
const rules = ref({
})

// 提交
const handleSubmit = async (type) => {
  const data = {
    ...model.value,
    opProjectStationInfoList: siteForms.value,
    publishStatusCode: 'unpublished' // 未发布
  }

  loading.value = true
  form.value.validate().then(async ({ valid, errors }) => {
    if (valid) {
      if (siteForms.value.length) {
        const site = siteForms.value.find(i => !i.provinceCode || !i.cityCode || !i.countyCode || !i.projectStationCode || !i.projectStationName)
        if (site) {
          uni.showToast({
            title: '请填写和选择站点编码、站点名称、归属省份、地市、区县',
            icon: 'none'
          })
          loading.value = false
          return
        }
      }
      if (model.value.projectId) {
        if (type === 'published') {
          data.publishStatusCode = 'published' // 已发布
        }
        const res = await updateProjectApi(data)
        if (res.code === 200) {
          uni.showToast({
            title: type === 'published' ? '发布成功' : '更新成功',
            icon: 'success'
          })
          setTimeout(() => {
            loading.value = false
            uni.navigateBack()
          }, 1000)
        }
      } else {
        const res = await addProjectApi(data)
        if (res.code === 200) {
          uni.showToast({
            title: '新增成功',
            icon: 'success'
          })
          setTimeout(() => {
            loading.value = false
            uni.navigateBack()
          }, 1000)
        }
      }
    }
  })
}


// 详情
const getDetail = async (id) => {
  const res = await getSectionDetailApi(id)
  if (res.code === 200) {
    model.value = res.data
  }
}

onLoad(async (options) => {
  if (options.id) {
    await getDetail(options.id)
    model.value.projectName = uni.getStorageSync('projectName')
  }
})


</script>

<template>
  <view class="form-page">
    <wd-toast />
    <view class="form-con">
      <wd-form ref="form" :model="model" :rules="rules" errorType="toast">
        <wd-cell-group use-slot border>
          <template #title>
            <view>
              <view class="title">项目名称：{{ model.projectName }}</view>
              <view class="title">站点名称：{{ model.sectionNameName }}</view>
            </view>
          </template>

          <wd-input prop="startStationLineNodeCode" v-model="model.startStationLineNodeCode" label="开始节点" placeholder="请输入开始节点" type="text" suffix-icon="location" label-width="80px" />
          <wd-input prop="endStationLineNodeCode" v-model="model.endStationLineNodeCode" label="结束节点" placeholder="请输入结束节点" type="text" suffix-icon="location" label-width="80px" />
          <wd-input prop="sectionDistance" v-model="model.sectionDistance" label="段落距离" placeholder="请输入段落距离" type="number" label-width="80px" />

          <wd-picker :columns="companyColumns" label-key="text" label-width="80px" label="段落类别" placeholder="请选择段落类别"
            v-model="model.sectionClassesId" prop="sectionClassesId" />
          <wd-picker :columns="provinceColumns" label-key="name" value-key="code" label-width="80px" label="段落类型"
            placeholder="请选择段落类型" v-model="model.sectionTypeId" prop="sectionTypeId" />
          <wd-input prop="sectionNameId" v-model="model.sectionNameId" label="段落名称" placeholder="请输入段落名称" type="text" label-width="80px" />
          <!-- <wd-input prop="projectName" v-model="model.projectName" label="段落编号" placeholder="请输入段落编号" type="text" label-width="80px" /> -->
          <wd-input prop="sectionAttributeId" v-model="model.sectionAttributeId" label="段落属性" placeholder="请输入段落属性" type="text" label-width="80px" />
          <wd-input prop="sectionMaterialsCount" v-model="model.sectionMaterialsCount" label="段落数量" placeholder="请输入段落数量" type="number" label-width="80px" />
        </wd-cell-group>
      </wd-form>
    </view>

    <view class="footer">
      <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
        @click="handleSubmit">保存</wd-button>
      <wd-button v-if="model.projectId" custom-class="custom-btn" type="success" :loading="loading" block :round="false"
        @click="handleSubmit('published')">发布</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.form-page {
  .form-con {
    padding: 30rpx;
    padding-bottom: 160rpx;

    .title {
      color: #333;
      font-weight: 500;
      font-size: 32rpx;
    }

    .site-item {
      margin: 20rpx 0 30rpx 0;
      background: #fff;

      .title-con {
        padding: 20rpx 30rpx;
        border-bottom: 1rpx solid #f5f5f5;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
  }

  .footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 20rpx 0;
    padding-bottom: 0;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background: #fff;
    z-index: 999;
  }

  :deep(.custom-btn) {
    width: 100%;
    margin: 0 10rpx;
    border-radius: 0 !important;
    opacity: 1;
  }

  :deep(.group) {
    margin-top: 30rpx;

    .wd-cell-group__title {
      display: flex;
      align-items: center;
    }
  }
}
</style>
