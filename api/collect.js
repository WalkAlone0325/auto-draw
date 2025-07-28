import http from '@/utils/request'

// 采集列表
export const getCollectListApi = (params) => http.get(`/op/projectStationLineInfo/list/page`, { params })
