<script setup>
import { nextTick, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getProjectDetailApi, checkProjectCodeApi, getProjectStationApi, getDeptApi, getDeptRegionRelApi, getDictApi, getAreaApi, addProjectApi, updateProjectApi } from '@/api'

const loading = ref(false)
const form = ref(null)
const model = ref({
  projectCode: '',
  projectName: '',
  projectManagerName: '',
  spreadSuperintendentName: '',
  buildCompany: '',
  projectOwnershipCompanyCode: '',
  projectOwnershipCompanyName: '',
  provinceCode: '',
  cityCode: '',
  countyCode: '',
  remark: ''
})
const rules = ref({
  projectCode: [{ required: true, message: '请输入项目编码' }],
  projectName: [{ required: true, message: '请输入项目名称' }],
  projectManagerName: [{ required: true, message: '请输入项目经理姓名' }],
  spreadSuperintendentName: [{ required: true, message: '请输入施工队长姓名' }],
  buildCompany: [{ required: true, message: '请输入建设单位' }],
  projectOwnershipCompanyCode: [{ required: true, message: '请选择所属公司' }],
  provinceCode: [{ required: true, message: '请选择归属省份' }],
  cityCode: [{ required: true, message: '请选择归属地市' }],
  countyCode: [{ required: true, message: '请选择归属区县' }],

  // projectStationCode: [{ required: true, message: '请输入站点编码' }],
  // projectStationName: [{ required: true, message: '请输入站点名称' }],
})

// 公司/部门
const companyColumns = ref([])
const getCompany = async () => {
  const res = await getDeptApi({})
  if (res.code === 200) {
    companyColumns.value = res.data
  }
}

// 发布状态
const statusColumns = ref([])
const getStatus = async () => {
  const res = await getDictApi('publish_status')
  if (res.code === 200) {
    statusColumns.value = res.data
  }
}

// 省份
const provinceColumns = ref([])
const cityColumns = ref([])
const countyColumns = ref([])
const getArea = async (parentId, key, index, isInit) => {
  const res = await getAreaApi(parentId)
  if (res.code === 200) {
    const site = siteForms.value[index]
    switch (key) {
      case 'provinceColumns':
        provinceColumns.value = res.data
        if (site) {
          site.provinceCode = ''
          site.cityCode = ''
          site.countyCode = ''
        } else if (!isInit) {
          model.value.provinceCode = ''
          model.value.cityCode = ''
          model.value.countyCode = ''
        }
        break
      case 'cityColumns':
        cityColumns.value = res.data
        if (site) {
          site.cityCode = ''
          site.countyCode = ''
        } else if (!isInit) {
          model.value.cityCode = ''
          model.value.countyCode = ''
        }
        break
      case 'countyColumns':
        countyColumns.value = res.data
        if (site) {
          site.countyCode = ''
        } else if (!isInit) {
          model.value.countyCode = ''
        }
        break
    }
  }
}

const handleProjectCodeBlur = async ({ value: val }) => {
  if (!val) return
  const res = await checkProjectCodeApi({ projectCode: val, projectId: model.value.projectId })
  if (res.code === 200) {
    model.value.projectCode = val
  } else {
    uni.showToast({
      title: '项目编码已存在, 请重新输入',
      icon: 'none'
    })
    model.value.projectCode = ''
  }
}

const getDeptRegionRel = async (deptId) => {
  const res = await getDeptRegionRelApi({deptId})
  if (res.code === 200) {
    if(res.data.provinceRegionCode) {
      await getArea(res.data.provinceRegionCode, 'cityColumns')
      model.value.provinceCode = res.data.provinceRegionCode
      console.log('🚀:>> ', model.value.provinceCode)
    }
    if(res.data.cityRegionCode) {
      await getArea(res.data.cityRegionCode, 'countyColumns')
      model.value.cityCode = res.data.cityRegionCode
      console.log('🚀:>> ', model.value.cityCode)
    }
    if(res.data.countyRegionCode) {
      model.value.countyCode = res.data.countyRegionCode
      console.log('🚀:>> ', model.value.countyCode)
    }
  }
}

const handleCompanyConfirm = ({ value, selectedItems }) => {
  model.value.projectOwnershipCompanyCode = value
  model.value.projectOwnershipCompanyName = selectedItems.text
  getDeptRegionRel(value)
}

// 添加站点
const siteForms = ref([])
const projectStationId = ref(1)
const handleAddSite = () => {
  siteForms.value.push({
    projectStationId: projectStationId.value++,
    projectStationCode: '',
    projectStationName: '',
    provinceCode: model.value.provinceCode,
    cityCode: model.value.cityCode,
    countyCode: model.value.countyCode,
    remark: ''
  })
  nextTick(() => {
    uni.pageScrollTo({
      selector: `#site-${siteForms.value.length - 1}`,
      duration: 300
    })
  }, 0)
}

// 删除站点
const handleDeleteSite = (item) => {
  siteForms.value = siteForms.value.filter(i => i.projectStationId !== item.projectStationId)
}

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
          handlePublish(data)
        } else {
          // 未发布 更新
          const res = await updateProjectApi(data)
          if (res.code === 200) {
            uni.showToast({
              title: '更新成功',
              icon: 'success'
            })
            setTimeout(() => {
              loading.value = false
              uni.navigateBack()
            }, 1000)
          }
          loading.value = false
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
        loading.value = false
      }
    }
  })
}

const handlePublish = (data) => {
  const options = {
    title: '发布提示',
    editable: true,
    placeholderText: '请输入版本备注信息',
    success: async (resData) => {
      if (resData.confirm) {
        if (!resData.content) {
          uni.showToast({ title: '请输入版本备注', icon: 'none', complete: () => uni.showModal(options) })
          return
        }
        // 发布
        const res = await updateProjectApi({
          ...data,
          publishStatusCode: 'published',
          versionsRemark: resData.content.trim()
        })
        if (res.code === 200) {
          uni.showToast({
            title: '发布成功',
            icon: 'success'
          })
          setTimeout(() => {
            loading.value = false
            uni.navigateBack()
          }, 1000)
        }
        loading.value = false
      }
    }
  }
  uni.showModal(options)
}

// 站点详情
const getSiteDetail = async (projectId) => {
  const res = await getProjectStationApi({ projectId })
  if (res.code === 200) {
    siteForms.value = res.data
  }
}

// 详情
const getDetail = async (id) => {
  const res = await getProjectDetailApi(id)
  if (res.code == 200) {
    if (res.data.cityCode) {
      await getArea(res.data.provinceCode, 'cityColumns', null, 'init')
    }
    if (res.data.cityCode) {
      await getArea(res.data.cityCode, 'countyColumns', null, 'init')
    }
    model.value = res.data
  }
}

onLoad(async (options) => {
  getCompany()
  getStatus()
  getArea(0, 'provinceColumns')
  if (options.id) {
    await getDetail(options.id)
    await getSiteDetail(options.id)
  } else {
    const info = uni.getStorageSync('user')
    model.value.projectOwnershipCompanyCode = info.companyDeptId
    await getDeptRegionRel(model.value.projectOwnershipCompanyCode)
  }
})


</script>

<template>
  <view class="form-page">
    <wd-toast />
    <view class="form-con">
      <wd-form ref="form" :model="model" :rules="rules" errorType="toast">
        <wd-cell-group title="项目信息" border>
          <wd-input prop="projectCode" v-model="model.projectCode" label="项目编码" placeholder="请输入项目编码" type="text"
            label-width="80px" @blur="handleProjectCodeBlur" />
          <wd-input prop="projectName" v-model="model.projectName" label="项目名称" placeholder="请输入项目名称" type="text"
            label-width="80px" />
          <wd-input prop="projectManagerName" v-model="model.projectManagerName" label="项目经理" placeholder="请输入项目经理姓名"
            type="text" label-width="80px" />
          <wd-input prop="spreadSuperintendentName" v-model="model.spreadSuperintendentName" label="施工队长"
            placeholder="请输入施工队长姓名" type="text" label-width="80px" />
          <wd-input prop="buildCompany" v-model="model.buildCompany" label="建设单位" placeholder="请输入建设单位" type="text"
            label-width="80px" />
          <wd-picker :columns="companyColumns" label-key="text" label-width="80px" label="所属公司" placeholder="请选择所属公司"
            v-model="model.projectOwnershipCompanyCode" prop="projectOwnershipCompanyCode"
            @confirm="handleCompanyConfirm" />
          <wd-picker :columns="provinceColumns" label-key="name" value-key="code" label-width="80px" label="归属省份"
            placeholder="请选择归属省份" v-model="model.provinceCode" prop="provinceCode"
            @confirm="getArea(model.provinceCode, 'cityColumns')" />
          <wd-picker :columns="cityColumns" label-key="name" value-key="code" label-width="80px" label="归属地市"
            placeholder="请选择归属地市" v-model="model.cityCode" prop="cityCode"
            @confirm="getArea(model.cityCode, 'countyColumns')" />
          <wd-picker :columns="countyColumns" label-key="name" value-key="code" label-width="80px" label="归属区县"
            placeholder="请选择归属区县" v-model="model.countyCode" prop="countyCode" />
          <wd-input label="备注" label-width="80px" prop="remark" clearable v-model="model.remark" placeholder="请输入备注" />

          <wd-picker label="发布状态" :disabled="true" :columns="statusColumns" label-key="dictLabel" value-key="dictValue"
            label-width="80px" placeholder="请选择发布状态" v-model="model.publishStatusCode" prop="publishStatusCode" />
          <wd-input label="项目版本" :disabled="true" prop="projectVersions" v-model="model.projectVersions"
            placeholder="请输入项目版本" type="text" label-width="80px" />
          <wd-datetime-picker label="版本时间" :disabled="true" label-width="80px" placeholder="请选择版本时间"
            prop="projectVersionsCreateTime" v-model="model.projectVersionsCreateTime" />
        </wd-cell-group>

        <wd-cell-group custom-class="group" title="站点信息" border center>
          <template #value>
            <view style="display: flex; align-items: center;">
              <wd-button type="primary" size="small" @click="handleAddSite">添加站点</wd-button>
            </view>
          </template>
        </wd-cell-group>

        <view class="site-item" v-for="(item, index) in siteForms" :key="item.projectStationId">
          <view class="title-con">
            <view>{{ `站点${index + 1}` }}</view>
            <wd-button type="error" size="small" @click="handleDeleteSite(item)">删除</wd-button>
          </view>
          <wd-input label="站点编码" label-width="80px" prop="projectStationCode" v-model="item.projectStationCode"
            placeholder="请输入站点编码" required />
          <wd-input label="站点名称" label-width="80px" prop="projectStationName" v-model="item.projectStationName"
            placeholder="请输入站点名称" required />
          <wd-picker :columns="provinceColumns" label-key="name" value-key="code" label-width="80px" label="归属省份"
            placeholder="请选择归属省份" v-model="item.provinceCode" prop="provinceCode"
            @confirm="getArea(item.provinceCode, 'cityColumns', index)" />
          <wd-picker :columns="cityColumns" label-key="name" value-key="code" label-width="80px" label="归属地市"
            placeholder="请选择归属地市" v-model="item.cityCode" prop="cityCode"
            @confirm="getArea(item.cityCode, 'countyColumns', index)" />
          <wd-picker :columns="countyColumns" label-key="name" value-key="code" label-width="80px" label="归属区县"
            placeholder="请选择归属区县" v-model="item.countyCode" prop="countyCode" />
          <wd-input label="备注" label-width="80px" prop="remark" clearable v-model="item.remark" placeholder="请输入备注" />
          <view :id="`site-${index}`"></view>
        </view>
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
