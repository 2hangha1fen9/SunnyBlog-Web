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

//获取未读评论
export function getUnreadCommentList() {
    return request({
        url: "/comment-service/comment/myunread",
        method: "get"
    })
}

//删除已读评论
export function readComment(cid: number, isAll = false) {
    return request({
        url: "/comment-service/comment/read",
        method: 'delete',
        params: {
            cid: cid,
            isAll: isAll ? "true" : null
        }
    })
}
//作者删除评论
export function authorDeleteComment(cid: number) {
    return request({
        url: "/comment-service/comment/authorDelete",
        method: "delete",
        params: {
            cid: cid
        }
    })
}
//作者审核评论
export function allowComment(cid: number) {
    return request({
        url: "/comment-service/comment/authroAllow",
        method: "put",
        params: {
            cid: cid
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

