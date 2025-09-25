import http from '@/utils/request'

// 采集列表
export const getCollectListApi = (params) => http.get(`/op/projectStationLineInfo/list/page`, { params })

// 段落列表
export const getParagraphListApi = (params) => http.get(`/op/projectStationLineSectionInfo/list/page`, { params })

// 节点列表
export const getNodeListApi = (params) => http.get(`/op/projectStationLineNodeInfo/list/page`, { params })

// 段落详情
export const getSectionDetailApi = (id) => http.get(`/op/projectStationLineSectionInfo/${id}`)

// 删除段落
export const deleteSectionApi = (id) => http.delete(`/op/project/station/line/collection/line/section/${id}`)

// 删除节点
export const deleteNodeApi = (id) => http.delete(`/op/project/station/line/collection/line/node/${id}`)

// 杆路1，节点类型3 节点名称12
export const getTypeApi = (type) => http.get(`/op/dataCollectionDict/select/${type}`)

// 节点规格
export const getSpecApi = (code) => http.get(`/op/dataAttributeDict/select/specification/${code}`)

// 节点属性
export const getAttrApi = (code) => http.get(`/op/dataAttributeDict/select/attribute/${code}`)

// 节点编号
export const getCodeApi = (code) => http.get(`/op/project/station/line/collection/generate/nodeCodeNumber/${code}`)

// 段落编号
export const getSectionCodeApi = (code) => http.get(`op/project/station/line/collection/generate/sectionCodeNumber/${code}`)

// 新增节点
export const addNodeApi = (data) => http.post(`/op/project/station/line/collection/line/node`, data)

// 更新节点
export const updateNodeApi = (data) => http.put(`/op/project/station/line/collection/line/node`, data)

// 获取节点详情
export const getNodeDetailApi = (id) => http.get(`/op/projectStationLineNodeInfo/${id}`)

// 新增段落
export const addSectionApi = (data) => http.post(`/op/project/station/line/collection/line/section`, data)

// 更新段落
export const updateSectionApi = (data) => http.put(`/op/project/station/line/collection/line/section`, data)

// 计算距离
export const getDistanceApi = (id1, id2) => http.get(`/op/project/station/line/collection/line/section/distance/${id1}/${id2}`)

// 创建节点默认值
export const createNodeDefaultApi = (projectStationLineId) => http.get(`/op/project/station/line/collection/nodeInfo/add/default/${projectStationLineId}`)

// 创建段落默认值
export const createSectionDefaultApi = (projectStationLineId) => http.get(`/op/project/station/line/collection/sectionInfo/add/default/${projectStationLineId}`)

// 复制节点默认值
export const copyNodeDefaultApi = (projectStationLineNodeId) => http.get(`/op/project/station/line/collection/nodeInfo/copy/default/${projectStationLineNodeId}`)

// 复制段落默认值
export const copySectionDefaultApi = (projectStationLineSectionId) => http.get(`/op/project/station/line/collection/sectionInfo/copy/default/${projectStationLineSectionId}`)

// 段落计算 通过经纬度计算距离
export const getJwDistanceApi = (beginLongitude, beginLatitude, endLongitude, endLatitude) => http.get(`/op/project/station/line/collection/line/section/distance/${beginLongitude}/${beginLatitude}/${endLongitude}/${endLatitude}`)

// 批量复制段落
export const copySectionBatchApi = (data) => http.post(`/op/project/station/line/collection/line/section/copy/bat`, data)

// 发布
export const publishBatchApi = (data) => http.put(`/op/project/station/line/collection/publish/status/base`, data)

// 节点参照物类型
export const getAttrNodeApi = (code) => http.get(`/system/dict/data/type/${code}`)
