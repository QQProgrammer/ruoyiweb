import request from '@/utils/request'

// 获取数据
export function getOrderDetailInfo() {
  return request({
    url: '/sss/order/service/getOrderDetailInfo',
    method: 'get'
  })
}