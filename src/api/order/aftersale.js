import request from '@/utils/request'

// 服务订单列表
export function getaftersaleList(query) {
  return request({
    url:'/sss/order/aftersale/list',
    method: 'get',
    params: query
  })
}
// 查看
// /sss/order/aftersale/getSaleInfoDetail?id=1&dictValue=0
export function getSaleInfoDetail(query) {
  return request({
    url:'/sss/order/aftersale/getSaleInfoDetail',
    method: 'get',
    params: query
  })
}

// 保存回复
export function updateAftersaleRemark(data) {
  return request({
    url:'/sss/order/aftersale/replyOrderInfo',
    method: 'post',
    data: data
  })
}

// 删除用户
export function delaftersaleOrderId(id) {
  return request({
    url:'/sss/order/aftersale/' + id,
    method: 'delete'
  })
}
// 查询服务类型
export function getListType(query) {
  return request({
    url:'/sss/order/aftersale/getListType',
    method: 'get',
    params: query
  })
}
// 删除 回复内容
export function deleteReply(query) {
  return request({
    url:'/sss/order/aftersale/deleteReply',
    method: 'get',
    params: query
  })
}