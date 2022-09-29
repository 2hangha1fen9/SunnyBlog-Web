<template>
    <li class="article-block">
        <div class="article-main">
            <div class="article-meta">
                <el-link @click.stop="router.push(`/user/${data.userId}`)">{{ data.nick || data.username }}</el-link>

                <el-divider direction="vertical" v-if="data.createTime" />
                <span>{{ format(data.createTime, "zh_CN") }}</span>

                <el-divider direction="vertical" v-if="data.regionName" />
                <el-link @click.stop="jumpRegion(data.regionName)">{{ data.regionName }}</el-link>

                <el-divider direction="vertical" v-if="data.tags?.length > 0" />
                <el-link v-for="tag in data.tags" :key="tag.name" class="tag" @click.stop="router.push({ query: { tag: tag.name } })">{{ tag.name }}</el-link>
            </div>
            <div class="article-intro">
                <h3 class="article-title">{{ data.title }}</h3>
                <p class="article-summay">{{ data.summary }}</p>
            </div>
            <div class="article-count">
                <svg-icon class="article-count-item count-views" icon-class="views">{{ data.meta?.viewCount || 0 }}</svg-icon>
                <svg-icon class="article-count-item count-likes" :class="{ 'count-likes-active': data.meta?.isUserLike === 1 }" icon-class="likes">{{ data.meta?.isUserLike || 0 }}</svg-icon>
                <svg-icon class="article-count-item count-star" :class="{ 'count-star-active': data.meta?.isUserCollection === 1 }" icon-class="star">{{ data.meta?.isUserCollection || 0 }}</svg-icon>
                <svg-icon class="article-count-item count-comment" icon-class="comment">{{ data.meta?.commentCount || 0 }}</svg-icon>
            </div>
        </div>
        <img class="article-photo" v-if="data.photo" :src="getArticlePhoto(data.photo)" alt="" />
    </li>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue"
import { useRouter } from "vue-router"
import { Article } from "@/interface/article/article"
import { format } from "timeago.js"

const instance = getCurrentInstance()
const router = useRouter()
defineProps<{
    data: Article
}>()

function getArticlePhoto(path) {
    return `${process.env.VUE_APP_BASE_API}/article-service${path}`
}
//调用region组件的跳转方法
function jumpRegion(region) {
    instance?.proxy?.$bus.emit("jumpRegion", region)
}
</script>
