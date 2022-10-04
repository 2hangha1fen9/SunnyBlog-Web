import { Category } from '@/interface/article/category'
import request from '@/utils/request'

//列出所有分类
export function listCategory() {
    return request({
        url: '/article-service/category/my',
        method: 'get'
    })
}

//更新分类
export function updateCategory(category: Category) {
    return request({
        url: '/article-service/category/update',
        method: 'put',
        data: category
    })
}

//创建分类
export function createCategory(category: Category) {
    return request({
        url: '/article-service/category/create',
        method: 'post',
        data: category
    })
}

//删除分类
export function deleteCategory(cid: number){
    return request({
        url: '/article-service/category/delete',
        method: 'delete',
        params:{
            cid: cid
        }
    })
}