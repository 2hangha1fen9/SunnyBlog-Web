import request from '@/utils/request'

//文章点赞/收藏
export function likeArticle(aid: number, status: number) {
    return request({
        url: "/comment-service/mark/article",
        method: "post",
        params: {
            aid: aid,
            status: status
        }
    })
}

//获取点赞消息
export function getLikeMessage() {
    return request({
        url: "/comment-service/mark/message",
        method: "get"
    })
}

//删除点赞消息
export function deleteLikeMessage(lid: number, isAll = false) {
    return request({
        url: "/comment-service/mark/deleteMessage",
        method: 'delete',
        params: {
            lid: lid,
            isAll: isAll ? "true" : null
        }
    })
}

//获取用户点赞记录
export function getUserLike(uid: number, isLike = false) {
    return request({
        url: "/comment-service/mark/list",
        method: 'get',
        params: {
            uid: uid,
            isLike: isLike ? "true" : null
        }
    })
}
