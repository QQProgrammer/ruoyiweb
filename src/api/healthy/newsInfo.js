import request from '@/utils/request'

// 查询文章列表
export function getArticleList(query) {
  return request({
    url: '/system/newsInfo/list',
    method: 'get',
    params: query
  })
}
// 查询文章详情
export function getArticleDetail(id) {
  return request({
    url: '/system/newsInfo/'+id,
    method: 'get'

  })
}

//新增文章
export function addArticle(data) {
  return request({
    url: '/system/newsInfo/saveArticle',
    method: 'post',
    data: JSON.stringify(data)
  })
}
//修改文章
export function updateArticle(data) {
  return request({
    url: '/system/newsInfo/updateNewsInfo',
    method: 'post',
    data: JSON.stringify(data)
  })
}
// 设置有效/无效
export function setEffect(id,status) {
  return request({
    url: '/system/newsInfo/'+status+'/'+id,
    method: 'get'
  })
}






