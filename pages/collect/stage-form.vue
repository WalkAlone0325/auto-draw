<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getSectionDetailApi, getDistanceApi, addSectionApi, updateSectionApi, getNodeListApi, getSectionCodeApi, getAttrApi, getTypeApi, getSpecApi } from '@/api'

const loading = ref(false)
const form = ref(null)
const model = ref({
  projectStationLineId: '',
  sectionCode: '',
  sectionNameId: '',
  sectionTypeId: '',
  sectionClassesId: '',
  sectionDistance: '',
  sectionSpecificationId: '',
  sectionAttributeId: '',
  startStationLineNodeId: '',
  endStationLineNodeId: '',
})
const rules = ref({
  sectionName: [
    { required: true, message: '请输入名称', trigger: 'blur' }
  ],
  sectionTypeId: [
    { required: true, message: '请选择段落类型', trigger: 'change' }
  ],
  sectionNameId: [
    { required: true, message: '请选择段落名称', trigger: 'change' }
  ],
  sectionClassesId: [
    { required: true, message: '请选择段落类别', trigger: 'change' }
  ],
  startStationLineNodeId: [
    { required: true, message: '请选择开始节点', trigger: 'change' }
  ],
  endStationLineNodeId: [
    { required: true, message: '请选择结束节点', trigger: 'change' }
  ],
  sectionDistance: [
    { required: true, message: '请输入距离', trigger: 'blur' }
  ],
  sectionMaterialsCount: [
    { required: true, message: '请输入段落数量', trigger: 'blur' }
  ],
})

// 提交
const handleSubmit = async () => {
  loading.value = true
  form.value.validate().then(async ({ valid, errors }) => {
    if (valid) {
      if (model.value.projectStationLineSectionId) {
        const res = await updateSectionApi({
          projectStationLineSectionId: model.value.projectStationLineSectionId,
          sectionCode: model.value.sectionCode,
          startStationLineNodeId: model.value.startStationLineNodeId,
          endStationLineNodeId: model.value.endStationLineNodeId,
          sectionDistance: model.value.sectionDistance,
          sectionClassesId: model.value.sectionClassesId,
          sectionTypeId: model.value.sectionTypeId,
          sectionNameId: model.value.sectionNameId,
          sectionAttributeId: model.value.sectionAttributeId,
          sectionMaterialsCount: model.value.sectionMaterialsCount
        })
        if (res.code === 200) {
          uni.showToast({
            title: '更新成功',
            icon: 'success'
          })
          setTimeout(() => {
            loading.value = false
            uni.navigateBack({
              delta: 1,
              success: () => {
                uni.$emit('refresh')
              }
            })
          }, 1000)
        }
      } else {
        const res = await addSectionApi(model.value)
        if (res.code === 200) {
          uni.showToast({
            title: '新增成功',
            icon: 'success'
          })
          setTimeout(() => {
            loading.value = false
            uni.navigateBack({
              delta: 1,
              success: () => {
                uni.$emit('refresh')
              }
            })
          }, 1000)
        }
      }
    }
    loading.value = false
  })
}


// 详情
const getDetail = async (id) => {
  const res = await getSectionDetailApi(id)
  if (res.code === 200) {
    model.value = {
      ...res.data,
      projectStationLineSectionId: isCopy.value ? '' : res.data.projectStationLineSectionId
    }
  }
}

const list = ref([])
// 获取节点
const getNodeList = async (projectStationLineId) => {
  const res = await getNodeListApi({ projectStationLineId })
  if (res.code === 200) {
    list.value = res.rows
  }
}


const dist = ref({
  sectionCateColumns: [],
  sectionTypeColumns: [],
  sectionNameColumns: [],
})
const sectionSpecColumns = ref([])
const sectionAttrColumns = ref([])
const getType = async (type, key) => {
  const res = await getTypeApi(type)
  if (res.code === 200) {
    dist.value[key] = res.data
  }
}
const getSpec = async (code, key, type) => {
  const res = await getSpecApi(code)
  if (res.code === 200) {
    if (type === 'section') {
      sectionSpecColumns.value = res.data
    }
  }
}
const getAttr = async (code, key, type) => {
  const res = await getAttrApi(code)
  if (res.code === 200) {
    if (type === 'section') {
      sectionAttrColumns.value = res.data
    }
  }
}

// 段落编号
const getSectionCode = async (code) => {
  const res = await getSectionCodeApi(code)
  if (res.code === 200) {
    model.value.sectionCode = code + 'section' + res.data
  }
}

// 计算距离
const distanceLoading = ref(false)
const getDistance = async () => {
  if (!model.value.startStationLineNodeId || !model.value.endStationLineNodeId) {
    uni.showToast({
      title: '请选择节点',
      icon: 'none'
    })
    return
  }
  distanceLoading.value = true
  const res = await getDistanceApi(model.value.startStationLineNodeId, model.value.endStationLineNodeId)
  if (res.code === 200) {
    model.value.sectionDistance = res.data
  }
  distanceLoading.value = false
}

const info = ref({})
const isCopy = ref(false)
onLoad(async (options) => {
  console.log('🚀:>> ', options)
  model.value.projectStationLineId = options.projectStationLineId
  // 复制
  isCopy.value = options.copy === 'copy'

  info.value = uni.getStorageSync('info')
  getNodeList(options.projectStationLineId)
  getType('2', 'sectionCateColumns')
  getType('129', 'sectionTypeColumns')
  getType('133', 'sectionNameColumns')
  getSpec('141', 'sectionSpecColumns', 'section')
  getAttr('141', 'sectionAttrColumns', 'section')
  if (options.id) {
    await getDetail(options.id)
    isCopy.value && getSectionCode(options.projectStationLineId)
  } else {
    getSectionCode(options.projectStationLineId)
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
              <view class="title">项目名称：{{ info.projectName }}</view>
              <view class="title">站点名称：{{ info.projectStationName }}</view>
            </view>
          </template>

          <wd-picker :columns="list" label-key="nodeCode" value-key="projectStationLineNodeId" label-width="80px"
            label="开始节点" placeholder="请选择开始节点" v-model="model.startStationLineNodeId"
            prop="startStationLineNodeId" />
          <wd-picker :columns="list" label-key="nodeCode" value-key="projectStationLineNodeId" label-width="80px"
            label="结束节点" placeholder="请选择结束节点" v-model="model.endStationLineNodeId" prop="endStationLineNodeId" />
          <wd-input prop="sectionDistance" v-model="model.sectionDistance" label="段落距离" placeholder="请输入段落距离"
            type="number" label-width="80px" center>
            <template #suffix>
              <view style="display: flex; align-items: center;">
                <wd-button icon="keyboard-collapse" :loading="distanceLoading" @click="getDistance"
                  size="small">计算</wd-button>
              </view>
            </template>
          </wd-input>
          <wd-picker :columns="dist.sectionCateColumns" label-key="text" label-width="80px" label="段落类别"
            placeholder="请选择段落类别" v-model="model.sectionClassesId" prop="sectionClassesId" />
          <wd-picker :columns="dist.sectionTypeColumns" label-key="text" label-width="80px" label="段落类型"
            placeholder="请选择段落类型" v-model="model.sectionTypeId" prop="sectionTypeId" />
          <wd-picker :columns="dist.sectionNameColumns" label-key="text" label-width="80px" label="段落名称"
            placeholder="请选择段落名称" v-model="model.sectionNameId" prop="sectionNameId" />
          <wd-input readonly label-width="80px" required label="段落编号" placeholder="请选择段落编号" v-model="model.sectionCode"
            prop="sectionCode" />
          <wd-picker :columns="sectionSpecColumns" label-key="text" label-width="80px" label="段落规格"
            placeholder="请选择段落规格" v-model="model.sectionSpecificationId" prop="sectionSpecificationId" />
          <wd-picker :columns="sectionAttrColumns" label-key="text" label-width="80px" label="段落属性"
            placeholder="请选择段落属性" v-model="model.sectionAttributeId" prop="sectionAttributeId" />
          <wd-input prop="sectionMaterialsCount" v-model="model.sectionMaterialsCount" label="段落数量"
            placeholder="请输入段落数量" type="number" label-width="80px" />
        </wd-cell-group>
      </wd-form>
    </view>

    <view class="footer">
      <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
        @click="handleSubmit">保存</wd-button>
      <!-- <wd-button v-if="model.projectId" custom-class="custom-btn" type="success" :loading="loading" block :round="false"
        @click="handleSubmit('published')">发布</wd-button> -->
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
    // z-index: 999;
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
