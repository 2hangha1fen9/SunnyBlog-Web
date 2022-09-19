import request from '@/utils/request'
//列出分区
export function listRegion() {
    return request({
        url: '/article-service/region/list',
        method: 'get'
    })
}