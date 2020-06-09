import request from '@/utils/request'


// 列表
export function getExtractList (query) {
  return request({
    url: '/user/extract/list',
    method: 'get',
    params: query
  })
}
// 查询详情
export function getExtractDetail (id, uid) {
  return request({
    url: '/user/extract/' + id + "/" + uid,
    method: 'get'
  })
}

//查询备注
export function getExtractRemark (id) {
  return request({
    url: '/user/extract/getRemark/' + id,
    method: 'get'
  })
}

//审核
export function checkExtract (query) {
  return request({
    url: '/user/extract/checkStatus',
    method: 'get',
    params: query
  })
}
//保存备注
export function saveExtractMark (query) {
  return request({
    url: '/user/extract/updateRemark',
    method: 'post',
    params: query
  })
}
//编辑
export function updateExtract (query) {
  return request({
    url: '/user/extract/updateExtract',
    method: 'post',
    params: query
  })
}

// 统计接口
export function getExtractInfo (query) {
  return request({
    url: '/user/extract/getExtractInfo',
    method: 'get',
    params: query
  })
}
