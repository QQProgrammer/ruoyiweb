import request from '@/utils/request'
// 列表
export function getpatVisitList(query) {
    return request({
      url: '/bussiness/patVisit/list',
      method: 'get',
      params: query
    })
  }
  
// 住院统计
export function getpatVisitCount(query) {
  return request({
    url: '/bussiness/patVisit/patVisitCount',
    method: 'get',
    params: query
  })
}



