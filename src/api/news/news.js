import request from '@/utils/request'
export function addNews(query) {
    return request({
      url: '/api/v1/addNews',
      method: 'post',
      params: query
    })
}
export function deleteNews(query) {
    return request({
      url: '/api/v1/deleteNews',
      method: 'post',
      params: query
    })
}
export function updateNews(query) {
  return request({
    url: '/api/v1/updateNews',
    method: 'post',
    params: query
  })
}
export function getAllNews(query) {
  return request({
    url: '/api/v1/getAllNews',
    method: 'get',
    params: query
  })
}
export function updateNewsStatus(query) {
  return request({
    url: '/api/v1/updateNewsStatus',
    method: 'post',
    params: query
  })
}
export function getOrders(query) {
  return request({
    url: '/api/v1/getOrders',
    method: 'get',
    params: query
  })
}