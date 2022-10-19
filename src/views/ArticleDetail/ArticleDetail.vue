<template>
    <div>
        <!-- 有封面显示在最顶端 -->
        <Cover :article="state" v-if="state?.photo" />
        <div class="detail-container">
            <div class="main-container reactive-main">
                <Cover :article="state" v-if="!state?.photo" />
                <Content />
                <Comment v-if="aid && state" :aid="aid" />
            </div>
            <div :class="{ 'aside-container': true, 'reactive-aside': true, 'show-aside': show }">
                <UserInfo :user="user" />
                <TagCard :tags="state?.tags" title="标签" @jumpTag="jumpTag" v-if="state?.tags?.length" />
                <Catalogue />
            </div>
        </div>
        <AsideBtns v-if="state?.meta" :data="state">
            <svg-icon class="float-menu btn-item" style="position: relative; top: 0; left: 0" icon-class="detail" @click="showAside" />
        </AsideBtns>
        <el-backtop :right="50" :bottom="80" />
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from "vue"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import Cover from "./components/Cover.vue"
import Content from "./components/Content.vue"
import UserInfo from "./components/UserInfo.vue"
import TagCard from "@/components/TagCard.vue"
import Catalogue from "./components/Catalogue.vue"
import AsideBtns from "./components/AsideBtns.vue"
import Comment from "./components/Comment/Comment.vue"
import { User } from "@/interface/user/user"
import { Article, Meta } from "@/interface/article/article"
import { Response } from "@/interface/common/response"
import { getArticleDetail } from "@/api/article/article"
import { getArticleMeta } from "@/api/comment/meta"
import { addViewCount } from "@/api/comment/views"
import { getUser } from "@/api/user/user"

const router = useRouter()
const instance = getCurrentInstance()

const props = defineProps<{
    aid?: string
    article?: Article
}>()

const state = ref<Article>(props.aritcle)
const user = ref<User>()

//如果有文章则直接渲染,否则就查询id
if (state.value) {
    //触发详情组件的渲染事件
    instance?.proxy?.$bus.emit("renderArticle", state.value)

    //获取用户信息
    getUserInfo(state.value.userId)
} else if (props.aid) {
    getArticleDetail(props.aid)
        .then((data: Response<Article>) => {
            if (data.status !== 200) {
                ElMessage.warning(data.message)
                router.push("/404")
            } else {
                state.value = data.result
                instance?.proxy?.$bus.emit("renderArticle", state.value)
                document.title = data.result.title
            }
        })
        .then(() => {
            //填充文章元数据
            getArticleMeta(state.value.id).then((data: Response<Meta>) => {
                state.value.meta = data.result
            })
            //获取用户信息
            getUserInfo(state.value.userId)
            //增加文章访问量
            addViewCount(state.value.id)
        })
}

function getUserInfo(uid: number) {
    getUser(uid).then((data: Response<User>) => {
        if (data.status === 200) {
            user.value = data.result
        }
    })
}

//跳转标签
function jumpTag(tagName: string) {
    let url = router.resolve({
        path: "/article",
        query: {
            tag: tagName,
        },
    })
    window.open(url.href, "_blank")
}

//响应式菜单显示
const show = ref(false)
function showAside() {
    show.value = !show.value
    console.log(show.value)
}
</script>

<style>
.detail-container {
    width: 1140px;
    max-width: 100%;

    margin: 0 auto;
    position: relative;
    margin-bottom: 50px;
}

/* 内容 */
.main-container {
    overflow: visible;
}
#content {
    width: 820px;
    max-width: 100%;
    min-height: 600px;
    padding: 20px;
    background-color: white;
    box-sizing: border-box;
    box-shadow: 0px -90px 20px rgba(0, 0, 0, 0.03), 0px 5px 20px rgba(0, 0, 0, 11%);
}

.pure-cover,
.img-cover {
    max-width: 100%;
    z-index: 99;
}

/* 具有封面的Header */
.img-cover {
    max-width: 100%;
    height: 300px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
    transition: all 0.5s;
    animation: header-effect 1s;
    margin-bottom: 20px;
}
.cover-img-meta {
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.3);
}

/* 没有封面的Header */
.pure-cover {
    box-sizing: border-box;
    margin-top: 20px;
    padding: 20px 0px 0px 20px;
    width: 820px;
    max-width: 100%;
    background: white;
    transform: translate3d(0px, 0px, 1px);
}

/* 标题 */
.cover-title {
    font-size: 2em;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}
/* 文章元数据 */
.cover-meta span {
    margin: 5px;
}

/* 侧边栏 */
.aside-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
}

/* 右侧用户卡片 */
.user-info {
    cursor: pointer;
    box-sizing: border-box;
    padding: 20px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.14);
}

.user-info .user-avatar {
    text-align: center;
}
.user-info .user-avatar .el-avatar {
    height: 70px;
    width: 70px;
}

.user-info .user-avatar p {
    margin: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

.watch-btn {
    justify-content: center;
    align-items: center;
    width: 100%;
}
.watch-btn span {
    justify-content: center;
    align-items: center;
}

/* 目录卡片 */
#catalogue {
    margin-top: 20px;
    box-sizing: border-box;
    width: 100%;
    padding: 10px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.14);
}
#catalogue li > span.vditor-outline__item--current {
    border-left: 1px solid #4285f4;
    color: #4285f4;
    background-color: #f6f8fa;
}
#catalogue li > span:hover {
    color: #4285f4;
    background-color: #f6f8fa;
}
.sticky-catalogue {
    top: 0px;
    position: fixed;
    width: 300px !important;
    max-height: 95vh;
    overflow: scroll;
}

/* 标签视图 */
.tag-card {
    margin-top: 20px;
    width: 100%;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.14);
}
.tag-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
}

/* 评论编辑 */
.comment-editor {
    width: 820px;
    max-width: 100%;
    margin-top: 20px;
    border-radius: 4px;
    box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 7%);
}
.comment-bar {
    display: flex;
    justify-content: space-between;
}
.comment-bar button {
    margin: 10px;
}
.comment-toreply {
    margin: 10px;
    display: flex;
}
.comment-toreply-content {
    margin-left: 10px;
}
.toreply-content {
    margin-top: 15px;
}

/* 评论视图 */
.comment-card {
    width: 820px;
    max-width: 100%;
    margin-top: 20px;
}

.comment-item {
    margin-bottom: 30px;
    display: flex;
}
.comment-container {
    padding: 5px;
    width: 100%;
}
.comment-meta {
    width: 100%;
    display: flex;
    justify-content: space-between;
}
.comment-username {
    font-size: 17px;
    font-weight: bold;
}
.comment-content {
    margin-top: 10px;
    margin-bottom: 10px;
}
.sub-comment-item {
    margin-top: 15px;
    border-radius: 4px;
    background: rgba(175, 175, 175, 0.196);
    padding: 5px;
}

.comment-reply {
    cursor: pointer;
}
.comment-reply:hover {
    color: skyblue;
}

/* 左侧按钮组 */
.article-btns {
    position: fixed;
    left: 20px;
    bottom: 20px;
    z-index: 2;
    display: flex;
    flex-direction: column;
}
.btn-item {
    color: #8a919f;
    cursor: pointer;
    height: 10px;
    width: 10px;
    margin: 10px;
    padding: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    background-color: #ffffff;
    box-shadow: 0 2px 4px 0 rgb(0 0 0 / 10%);
    font-size: 25px;
}
.count-likes-active {
    color: pink;
}
.count-star-active {
    color: orange;
}
.count-likes:hover {
    color: pink;
}
.count-star:hover {
    color: orange;
}
.count-comment:hover {
    color: skyblue;
}
</style>
