import request from '@/utils/request'
import { SearchCondidtion } from '@/interface/common/search-condition'

//关注某用户
export function watchUser(id: number) {
    return request({
        url: "/user-service/follow/sb",
        method: "post",
        params: {
            id: id
        }
    })
}

//获取关注状态
export function watchStatus(id: number) {
    return request({
        url: "/user-service/follow/status",
        method: "get",
        params: {
            id: id
        }
    })
}

//获取关注列表
export function watchList(id: number, fans = false, condition?: Array<SearchCondidtion>) {
    return request({
        url: "/user-service/follow/list",
        method: "get",
        params: {
            id: id,
            fans: fans,
            condition: JSON.stringify(condition)
        }
    })
}

//获取关注消息
export function watchMessage() {
    return request({
        url: "/user-service/follow/message",
        method: "get"
    })
}

//删除关注信息
export function watchMessageDelete(fid: number, isAll = false) {
    return request({
        url: "/user-service/follow/deleteMessage",
        method: "delete",
        params: {
            fid: fid,
            isAll: isAll ? "true" : null
        }
    })
}