import http from '@/utils/request'

// 项目列表
export const getProjectListApi = (params) => http.get(`/op/projectInfo/list/page`, { params })

// 项目详情
export const getProjectDetailApi = (params) => http.get(`/op/projectInfo/${params}`)

// 新增项目
export const addProjectApi = (params) => http.post(`/op/projectInfo`, params)

// 更新项目
export const updateProjectApi = (params) => http.put(`/op/projectInfo`, params)

// 删除项目
export const deleteProjectApi = (params) => http.delete(`/op/projectInfo/${params}`)

// 项目编码校验
export const checkProjectCodeApi = (params) => http.get(`/op/projectInfo/check/projectCode`, { params })

// 站点列表信息
export const getProjectStationApi = (params) => http.get(`/op/projectStationInfo/list`, { params })

// 部门列表
export const getDeptApi = (params) => http.get(`/system/dept/select/`, { params })

// 字典列表
export const getDictApi = (params) => http.get(`/system/dict/data/type/${params}`)

// 省市区
export const getAreaApi = (params) => http.get(`/system/dict/region/list/parent/${params}`)

// 部门区域关联列表
export const getDeptRegionRelApi = (params) => http.get(`/op/deptRegionRel/deptregion/all/list`, { params })
