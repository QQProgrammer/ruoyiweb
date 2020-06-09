import request from '@/utils/request'

// 查询列表
export function getUserhealthyList(query) {
  return request({
    url: '/user/healthy/list',
    method: 'get',
    params: query
  })
}