import request from '@/utils/request'

//获取文章统计数据
export function getArticleCount() {
    return request({
        url: "/article-service/statistics/userCount",
        method: 'get'
    })
}
//获取文章趋势
export function getArticleTrend(uid: number) {
    return request({
        url: "/article-service/statistics/userTrend",
        method: 'get',
        params: {
            uid: uid
        }
    })
}