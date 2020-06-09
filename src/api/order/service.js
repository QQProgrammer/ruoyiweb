import request from '@/utils/request'
// 查询订单类型
export function getServiceType(query) {
  return request({
    url:  '/sss/order/service/getServiceType',
    method: 'get',
    params: query
    // baseURL: process.env.VUE_APP_BASE_API1
  })
}
// 查询支付方式
export function getPayType(query) {
  return request({
    url: '/sss/order/service/getPayType',
    method: 'get',
    params: query
  })
}
// 服务订单列表
export function getServiceListOrder(query) {
  return request({
    url:  '/sss/order/service/list',
    method: 'get',
    params: query
  })
}
// 列表详情
export function getServiceOrderDetail(query) {
  return request({
    url: '/sss/order/service/getServiceOrderDetail',
    method: 'get',
    params: query
  })
}
// 保存订单备注
export function updateOrderRemark(data) {
  return request({
    url: '/sss/order/service/updateOrderRemark',
    method: 'post',
    data: data
  })
}
// 退单
export function returnOrder(query) {
  return request({
    url: '/sss/order/service/returnOrder',
    method: 'get',
    params: query
  })
}
// 查询中间统计部分接口
export function getServiceOrderTotalInfo(query) {
  return request({
    url:'/sss/order/service/getServiceOrderTotalInfo',
    method: 'get',
    params: query
  })
}

// 删除
export function deleteOrder(orderId) {
  return request({
    url: '/sss/order/service/' + orderId,
    method: 'delete'
  })
}


// 导出参数
export function exportConfig(query) {
  return request({
    url: '/sss/order/service/export',
    method: 'get',
    params: query
  })
}
