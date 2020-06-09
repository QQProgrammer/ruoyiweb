import request from '@/utils/request'

// 服务订单列表
export function getpaymentList(query) {
  return request({
    url:'/sss/order/payment/list',
    method: 'get',
    params: query
  })
}
// 列表详情
export function getArticleOrderDetail(query) {
  return request({
    url:'/sss/order/payment/getArticleOrderDetail',
    method: 'get',
    params: query
  })
}
// 保存订单备注
export function updateArticleRemark(data) {
  return request({
    url:'/sss/order/payment/updateArticleRemark',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delpaymentOrderId(orderId) {
  return request({
    url:'/sss/order/payment/' + orderId,
    method: 'delete'
  })
}
// 查询支付方式
export function getPayType(query) {
  return request({
    url: '/sss/order/service/getPayTypeNoVip',
    method: 'get',
    params: query
  })
}