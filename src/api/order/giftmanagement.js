import request from '@/utils/request'

// 列表
export function getproductList(query) {
  return request({
    url: '/system/product/list',
    method: 'get',
    params: query
  })
}
// 删除
export function deldeleteHospInfoById(query) {
    return request({
      url: 'bussiness/hospInfo/deleteHospInfoById',
      method: 'delete',
      params: query
    })
  }
  // 新增医院
  export function addProduct(data) {
    return request({
      url: '/system/product/addProduct',
      method: 'post',
      data: data
    })
  }
// 编辑医院
export function updateStoreProduct(data) {
    return request({
      url: '/system/product/updateStoreProduct',
      method: 'put',
      data: data
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
//   // 编辑备注
//   export function updateHospInfoRemark(data) {
//     return request({
//       url: '/bussiness/hospInfo/updateHospInfoRemark',
//       method: 'put',
//       data: data
//     })
//   }
// //   设为管理员
// export function updatesetLinkUser(query) {
//     return request({
//       url: '/bussiness/hospInfo/setLinkUser',
//       method: 'get',
//       params: query
//     })
//   }
//   // 取消管理员
// export function cancleManager(query) {
//   return request({
//     url: '/bussiness/hospInfo/cancleManager',
//     method: 'get',
//     params: query
//   })
// }
  
  
// // 医院列表下拉
// export function selectAllHospInfo(query) {
//   return request({
//     url: '/bussiness/hospInfo/selectAllHospInfo',
//     method: 'get',
//     params: query
//   })
// }
// // 科室列表下拉
// export function selectAllHospDept(query) {
//     return request({
//       url: '/bussiness/hospInfo/selectAllHospDept',
//       method: 'get',
//       params: query
//     })
//   }
// // 管理员列表

// export function appUserList(query) {
//   return request({
//     url: '/bussiness/hospInfo/doctorAppList',
//     method: 'get',
//     params: query
//   })
// }
// // 医院类型

// export function getHosType(query) {
//   return request({
//     url: '/bussiness/hospInfo/getHosType',
//     method: 'get',
//     params: query
//   })
// }

// //医院等级/
// export function getHosGreate(query) {
//   return request({
//     url: '/bussiness/hospInfo/getHosGreate',
//     method: 'get',
//     params: query
//   })
// }

// // 查询省
// export function getListProvince(query) {
//   return request({
//     url: '/hosmanager/common/getListProvince',
//     method: 'get',
//     params: query
//   })
// }
// // 查询市
// export function getListCity(query) {
//   return request({
//     url: 'hosmanager/common/getListCity',
//     method: 'get',
//     params: query
//   })
// }