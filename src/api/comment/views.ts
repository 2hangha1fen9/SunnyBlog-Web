import request from '@/utils/request'
import { SearchCondidtion } from '@/interface/common/search-condition'


//增加文章访问量
export function addViewCount(aid: number) {
    return request({
        url: "/comment-service/view/add",
        method: "get",
        params: {
            aid: aid
        }
    })
}

//获取用户访问记录
export function getViewHistory(pageIndex?: number | 1, pageSize?: number | 10, condition?: Array<SearchCondidtion>) {
    return request({
        url: "/comment-service/view/userHistory",
        method: "get",
        params: {
            pageIndex: pageIndex,
            pageSize: pageSize,
            condition: JSON.stringify(condition)
        }
    })
}