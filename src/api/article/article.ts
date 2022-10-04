import request from '@/utils/request'
import { Article, ArticleId } from '@/interface/article/article'
import { SearchCondidtion } from '@/interface/common/search-condition'

//列出公开文章
export function listArticle(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/article-service/article/list',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}

//列出我的文章列表
export function listMyArticle(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/article-service/article/my',
        method: 'get',
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}

//获取文章详情
export function getArticleDetail(aid: number) {
    return request({
        url: '/article-service/article/detail',
        method: 'get',
        params: {
            id: aid
        }
    })
}

//获取文章内容
export function getArticle(aid: number) {
    return request({
        url: '/article-service/article/detailIgnoreStatus',
        method: 'get',
        params: {
            id: aid
        }
    })
}

//发布文章
export function publishArticle(article: Article) {
    return request({
        url: '/article-service/article/publish',
        method: 'post',
        data: article
    })
}

//修改文章
export function updateArticle(article: Article) {
    return request({
        url: '/article-service/article/editor',
        method: 'put',
        data: article
    })
}

//删除文章
export function deleteArticle(ids: Array<ArticleId>) {
    return request({
        url: '/article-service/article/remove',
        method: 'delete',
        data: ids
    })
}