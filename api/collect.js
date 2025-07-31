import http from '@/utils/request'

// 采集列表
export const getCollectListApi = (params) => http.get(`/op/projectStationLineInfo/list/page`, { params })

// 段落列表
export const getParagraphListApi = (params) => http.get(`/op/projectStationLineSectionInfo/list/page`, { params })

// 节点列表
export const getNodeListApi = (params) => http.get(`/op/projectStationLineNodeInfo/list/page`, { params })
