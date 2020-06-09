import request from '@/utils/request'

// 服务订单列表
export function getuserConsultList(query) {
  return request({
    url: '/bussiness/userConsult/list',
    method: 'get',
    params: query
  })
}
// 列表详情
export function getuserConsultDetail(query) {
  return request({
    url: '/bussiness/userConsult/userConsultList',
    method: 'get',
    params: query
  })
}
// 会诊订单详情
export function getstoreConsultDetail(query) {
    return request({
      url: '/bussiness/userConsult/storeConsultList',
      method: 'get',
      params: query
    })
  }

// 保存订单备注
export function updateuserConsultRemark(data) {
  return request({
    url: '/bussiness/userConsult/updateRemark',
    method: 'put',
    data: data
  })
}
// 查看医生详情
export function getDoctorInfo(query) {
  return request({
    url: '/bussiness/userConsult/getDoctorInfo',
    method: 'get',
    params: query
  })
}
