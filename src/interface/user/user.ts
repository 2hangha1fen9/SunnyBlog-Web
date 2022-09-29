//用户信息
export interface User {
    id: number
    username?: string
    nick?: string
    remark?: string
    photo?: string
    sex?: number
    fans?: number
}

//用户详情
export interface UserDetail extends User {
    email?: string
    birthday?: string
    registerTime?: string
    score?: string
    status?: number
}

//修改密码
export interface ForgetPassword {
    username: string
    newPassword: string
    verificationCode: string
}