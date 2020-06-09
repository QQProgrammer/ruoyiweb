import request from '@/utils/request'

// 查询栏目列表
export function getColumnList (query) {
  return request({
    url: '/system/column/list',
    method: 'get',
    params: query
  })
}
// 查询栏目详情
export function getColumnDetail (id) {
  return request({
    url: '/system/column/' + id,
    method: 'get'

  })
}

//新增栏目
export function addColumn (data) {
  return request({
    url: '/system/column/saveCloumn',
    method: 'post',
    data: JSON.stringify(data)
  })
}
//修改栏目
export function updateColumn (data) {
  return request({
    url: '/system/column/updateCloumn',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 设置栏目有效/无效
export function setEffect (id, status) {
  return request({
    url: '/system/column/setEffect/' + id + '/' + status,
    method: 'get'
  })
}


// 图片上传
export function uploadImg (data) {
  return request({
    url: '/system/user/profile/avatar',
    method: 'post',
    data: data
  })
}


