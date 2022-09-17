import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Identity from '@/views/Identity/Identity.vue'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'home',
        component: HomeView
    },
    {
        path: '/identity',
        component: Identity,
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
