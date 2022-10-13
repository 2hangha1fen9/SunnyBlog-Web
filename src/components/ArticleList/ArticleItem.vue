<template>
    <li class="article-block">
        <div class="article-main">
            <div class="article-meta">
                <el-link @click.stop="jumpUser(data.userId)">{{ data.nick || data.username }}</el-link>

                <el-divider direction="vertical" v-if="data.createTime" />
                <span>{{ format(data.createTime, "zh_CN") }}</span>

                <el-divider direction="vertical" v-if="data.regionName" />
                <el-link @click.stop="jumpRegion(data.regionName)">{{ data.regionName }}</el-link>

                <el-divider direction="vertical" v-if="data.tags?.length > 0" />
                <el-link v-for="tag in data.tags" :key="tag.name" class="tag" @click.stop="jumpTag(tag.name)">{{ tag.name }}</el-link>
            </div>
            <div class="article-intro">
                <h3 class="article-title">{{ data.title }}</h3>
                <p class="article-summay">{{ data.summary }}</p>
            </div>
            <div class="article-count">
                <svg-icon class="article-count-item count-views" icon-class="views">{{ data.meta?.viewCount || 0 }}</svg-icon>
                <svg-icon class="article-count-item count-likes" @click.stop="like(1)" :class="{ 'count-likes-active': data.meta?.isUserLike === 1 }" icon-class="likes">{{ data.meta?.likeCount || 0 }}</svg-icon>
                <svg-icon class="article-count-item count-star" @click.stop="like(2)" :class="{ 'count-star-active': data.meta?.isUserCollection === 1 }" icon-class="star">{{ data.meta?.collectionCount || 0 }}</svg-icon>
                <svg-icon class="article-count-item count-comment" icon-class="comment">{{ data.meta?.commentCount || 0 }}</svg-icon>
            </div>
        </div>
        <img class="article-photo" v-if="data.photo" :src="getArticlePhoto(data.photo)" alt="" />
    </li>
</template>

<script setup lang="ts">
import { getCurrentInstance, ref } from "vue"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { format } from "timeago.js"
import { Article } from "@/interface/article/article"
import { Response } from "@/interface/common/response"
import { likeArticle } from "@/api/comment/like"
import { ElMessage } from "element-plus"

const instance = getCurrentInstance()
const router = useRouter()
const props = defineProps<{
    data: Article
    isIndependent: boolean
}>()

function getArticlePhoto(path) {
    return `${process.env.VUE_APP_BASE_API}/article-service${path}`
}
//调用region组件的跳转方法
function jumpRegion(region) {
    if (props.isIndependent) {
        //跳转到首页分类
        let url = router.resolve({
            path: "/index",
            query: {
                region: region,
            },
        })
        window.open(url.href, "_blank")
    } else {
        instance?.proxy?.$bus.emit("jumpRegion", region)
    }
}
function jumpTag(tag) {
    if (props.isIndependent) {
        //跳转到首页分类
        let url = router.resolve({
            path: "/index",
            query: {
                tag: tag,
            },
        })
        window.open(url.href, "_blank")
    } else {
        router.push({
            path: "/index",
            query: {
                tag: tag,
            },
        })
    }
}

//跳转用户主页
function jumpUser(uid) {
    //跳转到首页分类
    let url = router.resolve({
        path: `/user/${uid}`,
    })
    window.open(url.href, "_blank")
}

//文章点赞
const likeAdd = ref(true)
const collectionAdd = ref(true)
function like(status: number) {
    likeArticle(props.data.id, status).then((data: Response<string>) => {
        if (data.status !== 200) {
            ElMessage.warning(data.message)
        } else {
            if (status === 1) {
                likeAdd.value && props.data.meta.isUserLike !== 1 ? props.data.meta.likeCount++ : props.data.meta.likeCount--
                likeAdd.value = !likeAdd.value
                props.data.meta.isUserLike = props.data.meta.isUserLike == 1 ? 0 : 1
            } else {
                collectionAdd.value && props.data.meta.isUserCollection !== 1 ? props.data.meta.collectionCount++ : props.data.meta.collectionCount--
                collectionAdd.value = !collectionAdd.value
                props.data.meta.isUserCollection = props.data.meta.isUserCollection == 1 ? 0 : 1
            }
        }
    })
}
</script>
