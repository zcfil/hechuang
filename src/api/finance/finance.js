import request from '@/utils/request'

export function statementSummary(query) {
    return request({
      url: '/api/v1/statementSummary',
      method: 'get',
      params: query
    })
}
export function financeConfigList(query) {
  return request({
    url: '/api/v1/financeConfigList',
    method: 'get',
    params: query
  })
}
export function updateConfigById(query) {
    return request({
      url: '/api/v1/updateConfigById',
      method: 'post',
      params: query
    })
  }
  export function statementOrderProfit(query) {
    return request({
      url: '/api/v1/statementOrderProfit',
      method: 'get',
      params: query
    })
  }