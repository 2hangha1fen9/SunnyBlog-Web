import request from '@/utils/request'

//获取文章点赞收藏浏览数据
export function getArticleMeta(aid: number) {
    return request({
        url: '/comment-service/meta/getArticleMeta',
        params: {
            aid: aid
        }
    })
}

//获取一批文章的点赞收藏浏览数据
export function getArticleMetaList(aids: Array<number>) {
    return request({
        url: '/comment-service/meta/getArticleMetaList',
        method: 'post',
        data: aids
    })
}

//获取用户的点赞收藏浏览数据
export function getUserMeta(uid: number) {
    return request({
        url: '/comment-service/meta/getUserMeta',
        params: {
            uid: uid
        }
    })
}