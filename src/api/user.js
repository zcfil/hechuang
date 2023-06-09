import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function refreshtoken(data) {
  return request({
    url: '/refreshtoken',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/api/v1/getinfo',
    method: 'get'
  })
}

export function logout(data) {
  return request({
    url: '/api/v1/logout',
    method: 'post',
    data
  })
}

export function getUserPerformance() {
  return request({
    url: '/api/v1/getUserPerformance',
    method: 'get'
  })
}
export function getUserReferrals() {
  return request({
    url: '/api/v1/getUserReferrals',
    method: 'get'
  })
}