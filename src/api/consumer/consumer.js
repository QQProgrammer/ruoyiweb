import request from '@/utils/request'

// 查询用户列表
export function getUserList (query) {
  return request({
    url: '/app/user/appUserList',
    method: 'get',
    params: query
  })
}
// 查询用户详情
export function getAppUserDetail (id) {
  return request({
    url: '/app/user/' + id,
    method: 'get'

  })
}
//删除用户
export function deleteUser (id) {
  return request({
    url: '/app/user/' + id,
    method: 'delete'
  })
}
//新增用户
export function addAppUser (data) {
  return request({
    url: '/app/user/saveAppUser',
    method: 'post',
    data: JSON.stringify(data)
  })
}
//修改用户
export function updateAppUser (data) {
  return request({
    url: '/app/user/updateAppUser',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 查询提现记录
export function getExtractList (query) {
  return request({
    url: '/app/user/appUserExtractList',
    method: 'get',
    params: query
  })
}
// 查询充值记录
export function getRechargeList (query) {
  return request({
    url: '/app/user/appUserRechargeList',
    method: 'get',
    params: query
  })
}

// 设置有效/无效
export function setEffect (query) {
  return request({
    url: '/app/user/updateUserState/',
    method: 'get',
    params: query
  })
}

// 修改登录密码
export function updateLoginPwd (query) {
  return request({
    url: '/app/user/updateLoginPwd/',
    method: 'get',
    params: query
  })
}

// 修改支付密码
export function updatePayPwd (query) {
  return request({
    url: '/app/user/updatePayPwd/',
    method: 'get',
    params: query
  })
}
