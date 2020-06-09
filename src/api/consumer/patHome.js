import request from '@/utils/request'

// 查询患者列表
export function getUserPatList(query) {
  return request({
    url: '/user/patHome/list',
    method: 'get',
    params: query
  })
}
// 查询患者详情
export function getUserPatDetail(id) {
  return request({
    url: '/user/patHome/'+id,
    method: 'get'

  })
}
//删除患者
export function deleteUserPat(id) {
  return request({
    url: '/user/patHome/deletePatHome/'+id,
    method: 'get'
  })
}
//新增患者
export function addUserPat(data) {
  return request({
    url: '/user/patHome/savePat',
    method: 'post',
    data: JSON.stringify(data)
  })
}
//修改患者
export function updateUserPat(data) {
  return request({
    url: '/user/patHome/updatePat',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 查询患者所属用户
export function getRelationUser(query) {
  return request({
    url: '/user/patHome/getRelationUser',
    method: 'get'
  })
}





