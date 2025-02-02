import request from './request'

export const getVersion = () => request<null, string>('/public/version/get')