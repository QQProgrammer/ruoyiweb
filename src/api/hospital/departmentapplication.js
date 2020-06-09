import request from '@/utils/request'

// 服务订单列表
export function gethospEnterList(query) {
  return request({
    url: '/bussiness/hospEnter/list',
    method: 'get',
    params: query
  })
}
// 审核申请
export function updatechangeStatus(data) {
  return request({
    url: '/bussiness/hospEnter/changeStatus',
    method: 'put',
    data: data
  })
}

