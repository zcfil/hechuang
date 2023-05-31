import request from '@/utils/request'

export function rechargeList(query) {
  return request({
    url: '/api/v1/rechargeList',
    method: 'get',
    params: query
  })
}
export function settlementList(query) {
    return request({
      url: '/api/v1/settlementList',
      method: 'get',
      params: query
    })
  }