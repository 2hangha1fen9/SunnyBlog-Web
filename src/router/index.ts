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
                meta: {
                    keepAlive: true
                },
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
