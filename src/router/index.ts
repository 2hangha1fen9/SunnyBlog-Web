import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Layout from '../views/Layout/Layout.vue'
import Identity from '@/views/Identity/Identity.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'index',
        redirect: '/index',
        component: Layout,
        children: [
            {
                path: '/index/:region*',
                component: () => import('@/views/Index/Index.vue'),
                props: true
            }
        ]
    },
    {
        path: '/notification',
        name: 'notification',
        redirect: '/notification',
        component: Layout,
        children: [
            {
                path: '/notification',
                component: () => import('@/views/Notification/Notification.vue')
            }
        ]
    },
    {
        path: '/setting',
        name: 'setting',
        redirect: '/setting',
        component: Layout,
        children: [
            {
                path: '/setting',
                component: () => import('@/views/UserSetting/UserSetting.vue')
            }
        ]
    },
    {
        path: '/article',
        name: 'article',
        redirect: '/index',
        component: Layout,
        children: [
            {
                path: '/article/:aid',
                component: () => import('@/views/ArticleDetail/ArticleDetail.vue'),
                props: true
            }
        ]
    },
    {
        path: '/creation',
        name: 'creation',
        component: () => import("@/views/CreationCenter/CreationCenter.vue"),
    },
    {
        path: '/search',
        name: 'search',
        component: Layout,
        children: [
            {
                path: '/search',
                component: () => import('@/views/Search/Search.vue'),
                props: true,
                name: 'search',
                children: [
                    {
                        path: 'article/:keyword',
                        props: true,
                        component: () => import('@/views/Search/ArticleResult/ArticleResult.vue'),
                    },
                    {
                        path: 'tag/:keyword',
                        props: true,
                        component: () => import('@/views/Search/TagResult/TagResult.vue'),
                    },
                    {
                        path: 'user/:keyword',
                        props: true,
                        component: () => import('@/views/Search/UserResult/UserResult.vue'),
                    }
                ]
            }
        ]
    },
    {
        path: '/user',
        name: 'user',
        component: Layout,
        children: [
            {
                path: '/user/:uid',
                component: () => import('@/views/User/User.vue'),
                props: true,
                children: [
                    {
                        path: 'article',
                        props: true,
                        component: () => import('@/views/User/Tabs/Article/Article.vue'),
                    },
                    {
                        path: 'comment',
                        props: true,
                        component: () => import('@/views/User/Tabs/Comment/Comment.vue'),
                    },
                    {
                        path: 'like',
                        props: true,
                        component: () => import('@/views/User/Tabs/Like/Like.vue'),
                    },
                    {
                        path: 'collection',
                        props: true,
                        component: () => import('@/views/User/Tabs/Collection/Collection.vue'),
                    },
                    {
                        path: 'follow',
                        props: true,
                        component: () => import('@/views/User/Tabs/Follow/Follow.vue'),
                    },
                    {
                        path: 'fans',
                        props: true,
                        component: () => import('@/views/User/Tabs/Fans/Fans.vue'),
                    }
                ]
            }
        ]
    },
    {
        path: '/identity',
        component: Identity,
        name: 'identity',
        redirect: '/identity/login',
        children: [
            {
                path: '/identity/login',
                component: () => import("@/views/Identity/components/Login.vue")
            },
            {
                path: '/identity/register',
                component: () => import("@/views/Identity/components/Register.vue")
            },
            {
                path: '/identity/forget',
                component: () => import("@/views/Identity/components/ForgetPassword.vue")
            }
        ]
    },
    {
        path: "/404",
        name: '404',
        component: () => import("@/views/404.vue"),
        meta: {
            title: '404',
            hidden: true,
        },
    },
    {
        path: "/:catchAll(.*)",
        redirect: "/404",
        meta: {
            hidden: true,
        },
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
