import request from '@/utils/request'
import { Tag, TagId } from '@/interface/article/tag'

//获取公共标签
export function listPublicTag() {
    return request({
        url: '/article-service/tag/public',
        method: 'get'
    })
}
//获取用户个人标签
export function listMyTag() {
    return request({
        url: '/article-service/tag/my',
        method: 'get',
    })
}
//获取用户的标签
export function listUserTag(uid: number) {
    return request({
        url: '/article-service/tag/userTag',
        method: 'get',
        params: {
            uid: uid
        }
    })
}
//更新标签
export function updateTag(tag: Tag) {
    return request({
        url: '/article-service/tag/update',
        method: 'put',
        data: tag
    })
}
//添加标签
export function addTag(tag: Tag) {
    return request({
        url: '/article-service/tag/create',
        method: 'post',
        data: tag
    })
}
//删除标签
export function delTag(ids: Array<TagId>) {
    return request({
        url: '/article-service/tag/delete',
        method: 'delete',
        data: ids
    })
}