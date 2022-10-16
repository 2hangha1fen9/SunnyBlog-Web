import request from '@/utils/request'
import { BindAccount, UBindAccount } from '@/interface/user/bind'

//用户账号绑定
export function bind(bind: BindAccount) {
    return request({
        url: '/user-service/user/bindAccount',
        method: 'put',
        data: bind
    })
}

//用户账号解绑
export function ubind(ubind: UBindAccount) {
    return request({
        url: '/user-service/user/ubindAccount',
        method: 'put',
        data: ubind
    })
}