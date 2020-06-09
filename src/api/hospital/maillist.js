import request from '@/utils/request'

// 列表
export function getaddressList(query) {
  return request({
    url: '/bussiness/userAuth/addressList',
    method: 'get',
    params: query
  })
}



