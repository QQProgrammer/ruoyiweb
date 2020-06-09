import request from '@/utils/request'


// 服务订单列表
export function getRechargeList (query) {
  return request({
    url: '/user/recharge/list',
    method: 'get',
    params: query
  })
}
// 列表详情
export function getRechargeDetail (id) {
  return request({
    url: '/user/recharge/' + id,
    method: 'get'
  })
}
// 统计接口
export function getRechargeTotalInfo (query) {
  return request({
    url: '/user/recharge/getRechargeTotalInfo',
    method: 'get',
    params: query
  })
}
// 获取类型
export function getRechargeType (query) {
  return request({
    url: '/user/recharge/getRechargeType',
    method: 'get',
    params: query
  })
}

