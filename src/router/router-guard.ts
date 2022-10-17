import router from './index'
import { ElMessage } from 'element-plus'
import store from '@/store/index'

//路由白名单
const whiteList = [/identity/i, /index/i, /article/i, /404/i, /user/i, /search/i]

router.beforeEach(async (to, from, next) => {
    if (store.getters['identity/isValid']) {
        //如果已经登录了则跳转
        next()
    }
    else {
        //匹配路径白名单
        let access = false
        whiteList.forEach(r => {
            if (r.test(decodeURIComponent(to.path))) {
                access = true
            }
        })
        if (access) {
            next()
        } else {
            //清除所有信息跳转到登录页
            await store.dispatch('identity/logout')
            ElMessage.warning('用户信息已过期,请重新登录')
            next(`/identity/login?redirect=${to.path}`)
        }
    }
})