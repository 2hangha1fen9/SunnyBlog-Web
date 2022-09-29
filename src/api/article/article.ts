import request from '@/utils/request'
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

//获取文章详情
export function getArticleDetail(aid:number){
    return request({
        url: '/article-service/article/detail',
        method: 'get',
        params:{
            id: aid
        }
    })
}

