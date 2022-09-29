//用户账号绑定
export interface BindAccount{
    type:string
    bind:string
    password:string
    verificationCode:string
}

//取消账号绑定
export interface UBindAccount{
    type:string
    password:string
}