//用户信息
export interface User {
    id: number
    username?: string
    nick?: string
    remark?: string
    photo?: string
    cover?: string
    sex?: number
    fans?: number
    follows?: number
    message?: string
    registerTime?: string
}

//用户详情
export interface UserDetail extends User {
    email?: string
    birthday?: string
    registerTime?: string
    score?: string
    message?: string
    status?: number
}

//修改密码
export interface ForgetPassword {
    username: string
    newPassword: string
    verificationCode: string
}