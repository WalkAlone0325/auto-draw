import http from '@/utils/request'

// 登录
export const loginApi = (params) => http.post(`/login`, params)

// 获取用户信息
export const getInfoApi = () => http.get(`/getInfo`)
