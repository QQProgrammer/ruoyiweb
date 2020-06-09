import request from '@/utils/request'

// 列表
export function getuserAuthList(query) {
  return request({
    url: '/bussiness/userAuth/list',
    method: 'get',
    params: query
  })
}
// 删除
export function deleteUserAuthStatus(query) {
    return request({
      url: '/bussiness/userAuth/deleteUserAuthStatus',
      method: 'put',
      params: query
    })
  }
  // 新增
  export function createInsertUserAuth(data) {
    return request({
      url: '/bussiness/userAuth/insertUserAuth',
      method: 'post',
      data: data
    })
  }
// 编辑
export function updateModifyUserAuth(data) {
    return request({
      url: '/bussiness/userAuth/modifyUserAuth',
      method: 'post',
      data: data
    })
  }
  // 医护认证
export function updateUserAuthStatus(data) {
    return request({
      url: '/bussiness/userAuth/updateUserAuthStatus',
      method: 'put',
      data: data
    })
  }
  // 
  
  





