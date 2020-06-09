import request from '@/utils/request'

// 列表
export function getcloudStorageList(query) {
  return request({
    url: '/bussiness/hospDept/cloudStorage',
    method: 'get',
    params: query
  })
}
// 云盘升级记录
export function DeptCloudStorageList(query) {
    return request({
      url: '/bussiness/hospDept/selectDeptCloudStorageRechargeHis',
      method: 'get',
      params: query
    })
  }
  // 查看
  
  export function listFolder(query) {
    return request({
      url: '/bussiness/hospDept/listFolder',
      method: 'get',
      params: query
    })
  }
  // 查看中的查看
  export function listFolderFile(query) {
    return request({
      url: '/bussiness/hospDept/listFolderFile',
      method: 'get',
      params: query
    })
  }
  



