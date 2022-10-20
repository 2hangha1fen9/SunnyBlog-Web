<template>
    <div v-show="user.cover">
        <ImgCover :user="user" :meta="meta" />
    </div>
    <div class="user-container">
        <div v-show="!user.cover">
            <NormalCover :user="user" :meta="meta" />
        </div>
        <div class="user-tab reactive-main">
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
                <el-menu-item v-if="uid == userId" :index="`/user/${uid}/comment`" style="background: none">
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
        <div :class="{ 'user-aside': true, 'reactive-aside': true, 'show-aside': show }">
            <Board :user="user" />
            <Tags :uid="uid" />
            <ArticleCount v-if="uid == userId" />
            <ArticleTrend :uid="uid" />
        </div>
    </div>
    <svg-icon class="float-menu" icon-class="detail" @click="showAside" />
    <el-backtop :right="50" :bottom="50" />
</template>

<script setup lang="ts">
import { User } from "@/interface/user/user"
import { Summary } from "@/interface/comment/summary"
import { Response } from "@/interface/common/response"
import { getCurrentInstance, nextTick, reactive, ref, watch } from "vue"
import { useStore } from "vuex"
import { useRouter, useRoute } from "vue-router"
import { getUser } from "@/api/user/user"
import { getUserMeta } from "@/api/comment/meta"
import { ElMessage } from "element-plus"
import NormalCover from "./Cover/NormalCover.vue"
import ImgCover from "./Cover/ImgCover.vue"
import Tags from "./AsideTabs/Tags.vue"
import Board from "./AsideTabs/Board.vue"
import ArticleCount from "./AsideTabs/ArticleCount.vue"
import ArticleTrend from "./AsideTabs/ArticleTrend.vue"

const instance = getCurrentInstance()
const store = useStore()
const router = useRouter()
const route = useRoute()
const props = defineProps<{
    uid: string
}>()
const userId = store.getters["identity/userId"]
const user = ref<User>({})
const meta = ref<Summary>({})
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
    getUserMeta(props.uid).then((data: Response<Summary>) => {
        if (data.status === 200) {
            meta.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })

    //默认跳转
    let tabName = route.path.replace(`/user/${props.uid}`, "")
    if (tabName) {
        if ("/comment" === tabName && props.uid != userId) {
            router.push(`/user/${props.uid}/article`)
        } else {
            router.push(`/user/${props.uid}${tabName}`)
        }
    } else {
        router.push(`/user/${props.uid}/article`)
    }
}

//浮动按钮
const show = ref(false)
function showAside() {
    show.value = !show.value
    nextTick(() => {
        //如果侧边栏为收起状态则需要手动设置图标自适应
        instance?.proxy?.$bus.emit("resize")
    })
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
.user-img-info {
    height: 100%;
    width: 1140px;
    max-width: 100%;
    margin: 0 auto;
    display: flex;
    align-items: flex-end;
    padding: 10px;
    box-sizing: border-box;
}
.user-img-avatar {
    flex-direction: row;
}
.user-img-avatar .el-avatar {
    height: 70px;
    width: 70px;
}
.user-img-nick {
    font-size: 1.3em;
    color: white;
    font-weight: bolder;
    margin-left: 10px;
    width: 100%;
}
.user-img-nick p {
    text-shadow: 3px 0px 7px rgb(0 0 0 / 12%) !important;
}
.user-img-remark {
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    max-width: 400px;
}
.user-img-meta {
    width: 100%;
    display: flex;
    justify-content: flex-end;
}
.meta-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: var(--el-box-shadow);
}

.user-sex .svg-icon {
    width: 20px;
    height: 20px;
}

/* 普通封面 */
.user-normal-cover {
    display: flex;
    max-width: 100%;
    width: 820px;
    height: 200px;
    top: 0;
    padding: 20px;
    margin: 20px 0px 20px;
    box-sizing: border-box;
    box-shadow: var(--el-box-shadow);
}
.user-normal-info {
    position: relative;
    width: 100%;
}
.user-normal-avatar {
    margin-right: 25px;
}
.user-normal-avatar .el-avatar {
    box-shadow: var(--el-box-shadow);
    height: 100px;
    width: 100px;
}
.user-normal-info p {
    text-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
    font-weight: bolder;
    display: flex;
    justify-content: space-between;
    color: #ffff;
}
.user-normal-meta {
    position: absolute;
    bottom: 0;
    right: 0;
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
    border-bottom: 1px solid var(--el-border-color);
    background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
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
    box-shadow: var(--el-box-shadow);
    width: 820px;
    min-height: 600px;
}

/* 右侧容器 */
.user-aside {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
}

/* 文章排序过滤 */
.order-bar {
    margin: 10px;
    display: flex;
    justify-content: space-between;
}

.article-search {
    width: 400px;
}

/* 用户关注/粉丝 */
.follow-search {
    width: 400px;
    margin-top: 10px;
}

/* 评论页 */
.comment-list {
    margin-top: 10px;
    padding-inline-start: 0px;
}
.comment-item {
    border-bottom: 0.5px solid var(--el-border-color);
    padding-bottom: 5px;
    padding-left: 5px;
    box-sizing: border-box;
}

.comment-search {
    width: 400px;
    height: 24px;
}
.el-select .el-input {
    height: 24px;
}

.search-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}
.order-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

/* 关注/粉丝页 */
.follow-list .user-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 0.5px solid var(--el-border-color);
    padding: 10px 10px;
}

/* 关注/粉丝用户头像 */
.follow-search {
    margin-left: 10px;
}
.follow-list .user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
}

.follow-list .user-avatar .el-avatar {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}

/* 小黑板 */
#board .vditor-toolbar {
    display: none;
}
#board .vditor-content .vditor-reset {
    background: var(--el-bg-color);
    padding: 10px !important;
}
#board ::-webkit-scrollbar {
    display: none;
}
.board-card {
    box-shadow: var(--el-box-shadow);
    margin-top: 20px;
    min-height: 200px;
    max-height: 400px;
    padding: 0px;
}
.board-preview {
    border: var(--el-border-color);
    background: var(--el-bg-color);
    box-shadow: var(--el-box-shadow);
    padding: 10px;
}
.board-card::-webkit-scrollbar {
    display: none;
}

/* 标签卡片 */
.user-aside .tag-card {
    margin-top: 20px;
    box-shadow: var(--el-box-shadow);
}
.user-aside .tag-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: var(--el-box-shadow);
}

/* 文章总览 */
.count-tab {
    margin-top: 20px;
}
.count-view {
    padding-inline-start: 0px;
    display: flex;
    list-style-type: none;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
}
.count-view li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    white-space: nowrap !important;
    padding: 15px;
}
.count-view li p {
    font-size: 20px;
}

/* 文章发布趋势 */
.trend-tab {
    margin-top: 20px;
}
</style>
