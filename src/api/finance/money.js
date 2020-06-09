import request from '@/utils/request'


// 服务订单列表
export function getMoneyList(query) {
  return request({
    url: '/system/money/list',
    method: 'get',
    params: query
  })
}
