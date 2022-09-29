import request from '@/utils/request'
import { Comment } from "@/interface/comment/comment"
import { SearchCondidtion } from '@/interface/common/search-condition'

//获取文章的评论列表
export function getArticleComment(aid: number, pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: '/comment-service/comment/list',
        method: 'get',
        params: {
            aid: aid,
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}

//发表评论
export function publishComment(comment: Comment) {
    return request({
        url: '/comment-service/comment/publish',
        method: 'post',
        data: comment
    })
}