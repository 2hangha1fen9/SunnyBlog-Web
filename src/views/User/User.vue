<template>
    <Cover :user="user" :meta="meta" />
    <div class="user-container">
        <div class="user-tab">
            <el-menu class="menu" mode="horizontal" router :ellipsis="true" :default-active="defaultActive">
                <el-menu-item :index="`/user/${uid}/article`" style="background: none">
                    <template #title>
                        <el-icon>
                            <svg-icon icon-class="article" />
                        </el-icon>
                        <span>文章</span>
                    </template>
                </el-menu-item>
                <el-menu-item :index="`/user/${uid}/like`" style="background: none">
                    <template #title>
                        <el-icon>
                            <svg-icon icon-class="likes" />
                        </el-icon>
                        <span>点赞</span>
                    </template>
                </el-menu-item>
                <el-menu-item :index="`/user/${uid}/collection`" style="background: none">
                    <template #title>
                        <el-icon>
                            <svg-icon icon-class="star" />
                        </el-icon>
                        <span>收藏</span>
                    </template>
                </el-menu-item>
                <el-menu-item :index="`/user/${uid}/comment`" style="background: none">
                    <template #title>
                        <el-icon>
                            <svg-icon icon-class="comment" />
                        </el-icon>
                        <span>评论</span>
                    </template>
                </el-menu-item>
                <el-menu-item :index="`/user/${uid}/follow`" style="background: none">
                    <template #title>
                        <el-icon>
                            <svg-icon icon-class="follow" />
                        </el-icon>
                        <span>关注</span>
                    </template>
                </el-menu-item>
                <el-menu-item :index="`/user/${uid}/fans`" style="background: none">
                    <template #title>
                        <el-icon>
                            <svg-icon icon-class="fans" />
                        </el-icon>
                        <span>粉丝</span>
                    </template>
                </el-menu-item>
            </el-menu>
            <router-view></router-view>
        </div>
        <div class="user-aside">
            <el-card> asdfasdf </el-card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { User } from "@/interface/user/user"
import { UserMeta } from "@/interface/comment/summary"
import { Response } from "@/interface/common/response"
import { ref, watch } from "vue"
import { useRouter, useRoute } from "vue-router"
import { getUser } from "@/api/user/user"
import { getUserMeta } from "@/api/comment/meta"
import Cover from "./components/Cover.vue"
import { ElMessage } from "element-plus"

const router = useRouter()
const route = useRoute()
const props = defineProps<{
    uid: string
}>()
const user = ref<User>({})
const meta = ref<UserMeta>({})
const defaultActive = ref<string>()
watch(
    route,
    (newVal) => {
        defaultActive.value = decodeURI(newVal.path)
    },
    {
        immediate: true,
    }
)

if (props.uid) {
    getUser(props.uid).then((data: Response<User>) => {
        if (data.status === 200) {
            user.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })
    getUserMeta(props.uid).then((data: Response<UserMeta>) => {
        if (data.status === 200) {
            meta.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })

    router.push(`/user/${props.uid}/article`)
}
</script>

<style>
/* 具有封面的Header */
.user-img-cover {
    max-width: 100%;
    height: 300px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.5s;
    animation: header-effect 1s;
}

/* 用户信息展示 */
.user-info {
    height: 100%;
    width: 1140px;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    padding: 10px;
    box-sizing: border-box;
}

/* 用户头像 */
.user-avatar {
    flex-direction: row;
}
.user-avatar .el-avatar {
    height: 70px;
    width: 70px;
}

/* 性别图标 */
.user-sex .svg-icon {
    width: 20px;
    height: 20px;
}
/* 昵称 */
.user-nick {
    font-size: 1.3em;
    color: white;
    font-weight: bolder;
    margin-left: 10px;
}
/* 备注 */
.user-remark {
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    max-width: 400px;
}
/* 用户数据标签 */
.user-meta {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}

.meta-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
}

/* 菜单 */
.menu {
    position: sticky;
    border-bottom: none;
    background: none;
    max-width: 100%;
    justify-content: flex-start;
    height: 40px;
    top: 0;
    border-bottom: 1px solid rgba(211, 211, 211, 0.626);
    background-image: radial-gradient(transparent 1px, #ffff 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
    z-index: 10;
}

/* 左侧容器 */
.user-container {
    width: 1140px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
}

.user-tab {
    width: 820px;
}

/* 右侧容器 */
.user-aside {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
}
</style>
