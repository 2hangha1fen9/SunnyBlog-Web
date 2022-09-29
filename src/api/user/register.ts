import request from '@/utils/request'
import { RegisterPayload } from '@/interface/user/register'
//登录
export function register(data: RegisterPayload) {
    return request({
        url: '/user-service/user/register',
        method: 'post',
        data: data
    })
}