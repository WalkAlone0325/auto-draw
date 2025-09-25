<script setup>
import { ref } from 'vue'
import { getTypeApi, getSpecApi, getAttrApi, getCodeApi, addNodeApi, getAttrNodeApi, getNodeDetailApi, addSectionApi, getNodeListApi, getSectionCodeApi, getDistanceApi, createNodeDefaultApi, createSectionDefaultApi, getJwDistanceApi } from '@/api'
import { onLoad, onShow } from '@dcloudio/uni-app'

const model = ref({
  nodeCode: '',
  nodeTypeId: '',
  nodeNameId: '',
  nodeSpecificationId: '',
  nodeAttributeId: '',
  polePathTypeId: '',
  projectStationLineId: '',
  nodePlace: '',
  nodePlaceLongitude: '',
  nodePlaceLatitude: ''
})
const rules = ref({
  nodePlace: [
    { required: true, message: '请选择节点坐标', trigger: 'blur' }
  ],
  nodeCode: [
    { required: true, message: '请输入节点编号', trigger: 'blur' }
  ],
  nodeTypeId: [
    { required: true, message: '请选择节点类型', trigger: 'blur' }
  ],
  nodeNameId: [
    { required: true, message: '请选择节点名称', trigger: 'blur' }
  ],
  nodeSpecificationId: [
    { required: true, message: '请选择节点规格', trigger: 'blur' }
  ],
  nodeAttributeId: [
    { required: true, message: '请选择节点属性', trigger: 'blur' }
  ],
  polePathTypeId: [
    { required: true, message: '请选择杆路类型', trigger: 'blur' }
  ],
  endStationLineNodeName: [
    { required: true, message: '请选择段落名称', trigger: 'blur' }
  ],
  sectionDistance: [
    { required: true, message: '请输入段落距离', trigger: 'blur' }
  ],
  sectionTypeId: [
    { required: true, message: '请选择段落类型', trigger: 'blur' }
  ],
  sectionNameId: [
    { required: true, message: '请选择段落名称', trigger: 'blur' }
  ],
  sectionMaterialsCount: [
    { required: true, message: '请输入段落数量', trigger: 'blur' }
  ],
  sectionClassesId: [
    { required: true, message: '请选择段落类别', trigger: 'blur' }
  ],
  sectionCode: [
    { required: true, message: '请输入段落编号', trigger: 'blur' }
  ]
})
const param = ref({
  projectStationLineId: '',
  projectStationId: '',
  projectId: '',
  projectName: '',
})

const dist = ref({
  poleColumns: [],
  nodeColumns: [],
  nameColumns: [],
  sectionCateColumns: [],
  sectionTypeColumns: [],
  sectionNameColumns: [],
})
const speaColumns = ref([])
const attrColumns = ref([])
const sectionSpecColumns = ref([])
const sectionAttrColumns = ref([])
const getType = async (type, key) => {
  const res = await getTypeApi(type)
  if (res.code === 200) {
    dist.value[key] = res.data
  }
}
const attrNodeColumns = ref([])
const getAttrNode = async (code, key, type) => {
  const res = await getAttrNodeApi(code)
  if (res.code === 200) {
    attrNodeColumns.value = res.data
  }
}
const getSpec = async (code, key, type) => {
  const res = await getSpecApi(code)
  if (res.code === 200) {
    if (type === 'section') {
      sectionSpecColumns.value = res.data
    } else {
      speaColumns.value = res.data
    }
  }
}
const getAttr = async (code, key, type) => {
  const res = await getAttrApi(code)
  if (res.code === 200) {
    if (type === 'section') {
      sectionAttrColumns.value = res.data
    } else {
      attrColumns.value = res.data
    }
  }
}
// 节点编号
const getCode = async (code) => {
  const res = await getCodeApi(code)
  if (res.code === 200) {
    model.value.nodeCode = code + 'node' + res.data
  }
}

// 段落编号
const getSectionCode = async (code) => {
  const res = await getSectionCodeApi(code)
  if (res.code === 200) {
    model.value.sectionCode = code + 'section' + res.data
  }
}

// 选择坐标
const clickNode = (key) => {
  uni.navigateTo({
    url: '/pages/collect/select-map?key=' + key
  })
}

const selectNode = (key) => {
  uni.navigateTo({
    url: '/pages/collect/select-node?key=' + key + '&id=' + curId.value
  })
}

const loading = ref(false)
const form = ref()
const curId = ref('')
const distanceLoading = ref(false)

const handleSubmit = async () => {
  loading.value = true
  const { valid } = await form.value.validate()
  if (valid) {
    const res = await addNodeApi({
      ...model.value,
      projectStationLineId: curId.value
    })
    if (res.code === 200) {
      if (isShow.value) {
        // const code = nodeList.value[nodeList.value.length - 1].projectStationLineNodeId
        let code
        const cRes = await getNodeListApi({ projectStationLineId: curId.value })
        if(cRes.code === 200) {
          code = cRes.rows[cRes.rows.length - 1].projectStationLineNodeId
        }
        const res = await addSectionApi({
          endStationLineNodeId: code,
          sectionCode: model.value.sectionCode,
          sectionClassesId: model.value.sectionClassesId,
          sectionNameId: model.value.sectionNameId,
          sectionTypeId: model.value.sectionTypeId,
          startStationLineNodeId: model.value.endStationLineNodeId,
          sectionAttributeId: model.value.sectionAttributeId,
          sectionDistance: model.value.sectionDistance,
          sectionMaterialsCount: model.value.sectionMaterialsCount,
          projectStationLineId: curId.value
        })
        if (res.code === 200) {
          uni.showToast({ title: '新增成功' })
          loading.value = false
          uni.navigateBack({
            delta: 1,
            success: () => {
              uni.$emit('refresh')
            }
          })
        } else {
          loading.value = false
        }
      } else {
        uni.showToast({ title: '新增成功' })
        loading.value = false
        uni.navigateBack({
          delta: 1,
          success: () => {
            uni.$emit('refresh')
          }
        })
      }

    } else {
      loading.value = false
    }
  }
  loading.value = false
}

// 计算距离
const getDistance = async () => {
  if (!model.value.nodePlaceLongitude || !model.value.nodePlaceLatitude || !selectObj.value.endStationLineNodeLongitude || !selectObj.value.endStationLineNodeLatitude) {
    uni.showToast({
      title: '请选择坐标',
      icon: 'none'
    })
    return
  }
  distanceLoading.value = true
  const res = await getJwDistanceApi(model.value.nodePlaceLongitude, model.value.nodePlaceLatitude, selectObj.value.endStationLineNodeLongitude, selectObj.value.endStationLineNodeLatitude)
  if (res.code === 200) {
    model.value.sectionDistance = res.data
  }
  distanceLoading.value = false
}

// 获取详情
const getDetail = async (id) => {
  const res = await getNodeDetailApi(id)
  if (res.code === 200) {
    model.value = {
      ...model.value,
      ...res.data,
      nodePlace: res.data.nodePlaceLatitude + ',' + res.data.nodePlaceLongitude
    }
  }
}

// 创建节点默认值
const getCreateNodeDefault = async (id) => {
  const res = await createNodeDefaultApi(id)
  if (res.code === 200) {
    model.value = {
      ...model.value,
      ...res.data,
      nodePlace: res.data.nodePlaceLatitude ? res.data.nodePlaceLatitude + ',' + res.data.nodePlaceLongitude : '',
    }
  }
}

// 创建段落默认值
const getCreateSectionDefault = async (id) => {
  const res = await createSectionDefaultApi(id)
  if (res.code === 200) {
    model.value = {
      ...model.value,
      ...res.data,
      nodePlace: res.data.nodePlaceLatitude ? res.data.nodePlaceLatitude + ',' + res.data.nodePlaceLongitude : '',
    }
  }
}

const selectObj = ref({})

onShow(() => {
  uni.$on('local', (data) => {
    if (data.key === 'nodePlace') {
      model.value.nodePlace = data.latitude + ',' + data.longitude
      model.value.nodePlaceLongitude = data.longitude
      model.value.nodePlaceLatitude = data.latitude
    } else if (data.key === 'nodeReferenceSubstance') {
      model.value.nodeReferenceSubstance = data.latitude + ',' + data.longitude
      model.value.nodeReferenceSubstanceLatitude = data.latitude
      model.value.nodeReferenceSubstanceLongitude = data.longitude
    }
  })
  uni.$on('selectNode', (data) => {
    model.value.endStationLineNodeId = data.projectStationLineNodeId
    model.value.endStationLineNodeName = data.nodeCode
    selectObj.value.endStationLineNodeLongitude = data.nodePlaceLongitude
    selectObj.value.endStationLineNodeLatitude = data.nodePlaceLatitude
  })
})

const info = ref({})
const isShow = ref(false)
onLoad((param) => {
  param.value = param
  isShow.value = param.show != '0'
  info.value = uni.getStorageSync('info')
  getType('1', 'poleColumns')
  getType('3', 'nodeColumns')
  getType('12', 'nameColumns')
  getSpec('15', 'specColumns')
  getAttr('15', 'attrColumns')
  getAttrNode('reference_substance_type', 'attrNodeColumns')
  curId.value = param.projectStationLineId

  if (isShow.value) {
    getType('2', 'sectionCateColumns')
    getType('129', 'sectionTypeColumns')
    getType('133', 'sectionNameColumns')
    getSpec('141', 'sectionSpecColumns', 'section')
    getAttr('141', 'sectionAttrColumns', 'section')
    // getSectionCode(param.projectStationLineId)
    getCreateSectionDefault(param.projectStationLineId)
  }

  if (param.projectStationLineNodeId) {
    getDetail(param.projectStationLineNodeId)
  } else {
    // getCode(param.projectStationLineId)
    getCreateNodeDefault(param.projectStationLineId)
  }
})

// 获取节点
const lastNode = ref({})
const nodeList = ref([])
const getNodeList = async () => {
  const res = await getNodeListApi({
    projectStationLineId: curId.value,
  })
  if (res.code === 200 && res.rows.length > 0) {
    nodeList.value = res.rows
    lastNode.value = res.rows[res.rows.length - 1]
    model.value.endStationLineNodeId = lastNode.value.projectStationLineNodeId
    model.value.endStationLineNodeName = lastNode.value.nodeCode
    selectObj.value.endStationLineNodeLongitude = lastNode.value.nodePlaceLongitude
    selectObj.value.endStationLineNodeLatitude = lastNode.value.nodePlaceLatitude
  }
}
onLoad(() => {
  getNodeList()
})
</script>

<template>
  <view class="collect-form-page">
    <wd-toast />
    <view class="form-con">
      <view class="info-con">
        <view>项目名称：{{ info.projectName }}</view>
        <view>站点名称：{{ info.projectStationName }}</view>
      </view>

      <wd-form ref="form" :model="model" :rules="rules" errorType="toast">
        <wd-cell-group title="节点创建" border>
          <view @click="clickNode('nodePlace')">
            <wd-input prop="nodePlace" v-model="model.nodePlace" label="节点坐标" placeholder="请选择节点坐标" type="text"
              label-width="80px" readonly />
          </view>
          <wd-picker :columns="dist.poleColumns" label-key="text" label-width="80px" label="杆路类型" placeholder="请选择杆路类型"
            v-model="model.polePathTypeId" prop="polePathTypeId" />
          <wd-picker :columns="dist.nodeColumns" label-key="text" label-width="80px" label="节点类型" placeholder="请选择节点类型"
            v-model="model.nodeTypeId" prop="nodeTypeId" />
          <wd-picker :columns="dist.nameColumns" label-key="text" label-width="80px" label="节点名称" placeholder="请选择节点名称"
            v-model="model.nodeNameId" prop="nodeNameId" />
          <wd-input prop="remark" v-model="model.remark" label="节点备注" placeholder="请输入节点备注" type="text"
            label-width="80px" />
          <wd-input readonly label-width="80px" label="节点编号" placeholder="请选择节点编号" v-model="model.nodeCode"
            prop="nodeCode" />
          <wd-picker :columns="speaColumns" label-key="text" label-width="80px" label="节点规格" placeholder="请选择节点规格"
            v-model="model.nodeSpecificationId" prop="nodeSpecificationId" />
          <wd-picker :columns="attrColumns" label-key="text" label-width="80px" label="节点属性" placeholder="请选择节点属性"
            v-model="model.nodeAttributeId" prop="nodeAttributeId" />
          <view @click="clickNode('nodeReferenceSubstance')">
            <wd-input prop="nodeReferenceSubstance" v-model="model.nodeReferenceSubstance" label="节点参照物坐标"
              placeholder="请选择参照物节点坐标" type="text" label-width="120px" readonly clearable />
          </view>
          <wd-picker :columns="attrNodeColumns" label-key="dictLabel" value-key="dictValue" label-width="120px" label="节点参照物类型"
            placeholder="请选择节点参照物类型" v-model="model.nodeReferenceSubstanceTypeCode"
            prop="nodeReferenceSubstanceTypeCode" />
          <wd-input prop="nodeReferenceSubstanceName" v-model="model.nodeReferenceSubstanceName" label="节点参照物名称"
            placeholder="请输入节点参照物名称" type="text" label-width="120px" />
        </wd-cell-group>

        <view style="height: 30rpx;"></view>
        <wd-cell-group title="段落创建" border v-if="isShow">
          <view @click="selectNode('endStationLineNodeName')">
            <wd-input prop="endStationLineNodeName" v-model="model.endStationLineNodeName" label="开始节点"
              placeholder="请选择开始节点" type="text" label-width="80px" readonly />
          </view>
          <wd-picker :columns="dist.sectionCateColumns" label-key="text" label-width="80px" label="段落类别"
            placeholder="请选择段落类别" v-model="model.sectionClassesId" prop="sectionClassesId" />
          <wd-picker :columns="dist.sectionTypeColumns" label-key="text" label-width="80px" label="段落类型"
            placeholder="请选择段落类型" v-model="model.sectionTypeId" prop="sectionTypeId" />
          <wd-picker :columns="dist.sectionNameColumns" label-key="text" label-width="80px" label="段落名称"
            placeholder="请选择段落名称" v-model="model.sectionNameId" prop="sectionNameId" />
          <wd-input readonly label-width="80px" label="段落编号" placeholder="请选择段落编号" v-model="model.sectionCode"
            prop="sectionCode" />
          <wd-picker :columns="sectionSpecColumns" label-key="text" label-width="80px" label="段落规格"
            placeholder="请选择段落规格" v-model="model.sectionSpecificationId" prop="sectionSpecificationId" />
          <wd-picker :columns="sectionAttrColumns" label-key="text" label-width="80px" label="段落属性"
            placeholder="请选择段落属性" v-model="model.sectionAttributeId" prop="sectionAttributeId" />
          <wd-input prop="sectionMaterialsCount" v-model="model.sectionMaterialsCount" label="段落数量"
            placeholder="请输入段落数量" type="number" label-width="80px" />
          <wd-input prop="sectionDistance" v-model="model.sectionDistance" label="段落距离" placeholder="请输入段落距离"
            type="number" label-width="80px" center>
            <template #suffix>
              <view style="display: flex; align-items: center;">
                <wd-button icon="keyboard-collapse" :loading="distanceLoading" @click="getDistance" size="small">计算</wd-button>
              </view>
            </template>
          </wd-input>
        </wd-cell-group>
      </wd-form>
    </view>
    <view class="footer">
      <wd-button custom-class="custom-btn" type="primary" :loading="loading" block :round="false"
        @click="handleSubmit">保存</wd-button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.collect-form-page {
  width: 100%;
  height: 100vh;

  .form-con {
    padding: 30rpx;
    padding-bottom: calc(env(safe-area-inset-bottom) + 120rpx);

    .info-con {
      margin-bottom: 20rpx;
      background-color: #fff;
      padding: 20rpx;
    }
  }

  .footer {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 30rpx 20rpx 0;
    padding-bottom: calc(env(safe-area-inset-bottom) + 30rpx);
    background: #fff;
    z-index: 2;
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
