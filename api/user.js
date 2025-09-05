import http from '@/utils/request'

// 登录
export const loginApi = (params) => http.post(`/login`, params)

// 获取用户信息
export const getInfoApi = () => http.get(`/getInfo`)

// 一键登录
export const oneLoginApi = (params) => http.post('/xcxLogin?xcxCode=' + params)

// 退出登录
export const logoutApi = () => http.post('/unbind/logout')
