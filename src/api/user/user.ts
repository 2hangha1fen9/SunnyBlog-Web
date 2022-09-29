import request from '@/utils/request'
import { User,ForgetPassword } from '@/interface/user/user'

//根据Id获取用户
export function getUser(uid: number) {
    return request({
        url: '/user-service/user/getuser',
        method: 'get',
        params: {
            uid: uid
        }
    })
}

//获取当前登录者的详细信息
export function getLoginInfo() {
    return request({
        url: '/user-service/user/logininfo',
        method: 'get'
    })
}

//获取当前登陆者的信息
export function updateUserInfo(user:User){
    return request({
        url: '/user-service/user/updateInfo',
        method: 'put',
        data: user
    })
}

//修改密码
export function forgetPassword(forget: ForgetPassword){
    return request({
        url: '/user-service/user/forgetPassword',
        method: 'post',
        data: forget
    })
}