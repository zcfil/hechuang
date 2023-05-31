import request from '@/utils/request'

export function customerAdd(query) {
    return request({
      url: '/api/v1/customerAdd',
      method: 'post',
      params: query
    })
}
export function customerList(query) {
  return request({
    url: '/api/v1/customerList',
    method: 'get',
    params: query
  })
}
export function customerEdit(query) {
  return request({
    url: '/api/v1/customerEdit',
    method: 'post',
    params: query
  })
}

export function auditLogList(query) {
  return request({
    url: '/api/v1/auditLogList',
    method: 'get',
    params: query
  })
}
export function auditList(query) {
  return request({
    url: '/api/v1/auditList',
    method: 'get',
    params: query
  })
}
export function audit(query) {
  return request({
    url: '/api/v1/audit',
    method: 'post',
    params: query
  })
}
export function audits(query) {
  return request({
    url: '/api/v1/audits',
    method: 'post',
    params: query
  })
}
export function individualPerformance(query) {
  return request({
    url: '/api/v1/individualPerformance',
    method: 'get',
    params: query
  })
}
export function customerProfitEdit(query) {
  return request({
    url: '/api/v1/customerProfitEdit',
    method: 'post',
    params: query
  })
}
export function getConfigKey(query) {
  return request({
    url: '/api/v1/getConfigKey',
    method: 'get',
    params: query
  })
}
export function updateConfig(query) {
  return request({
    url: '/api/v1/updateConfig',
    method: 'post',
    params: query
  })
}