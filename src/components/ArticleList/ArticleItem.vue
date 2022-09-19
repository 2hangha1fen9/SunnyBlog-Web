<template>
    <li class="article-block">
        <div class="article-main">
            <div class="article-meta">
                <el-link href="#">{{ data.nick || data.username }}</el-link>

                <el-divider direction="vertical" v-if="data.createTime" />
                <span>{{ format(data.createTime, "zh_CN") }}</span>

                <el-divider direction="vertical" v-if="data.regionName" />
                <el-link @click="router.push(`/?region=${data.regionName}`)">{{ data.regionName }}</el-link>

                <el-divider direction="vertical" v-if="data.tags?.length > 0" />
                <el-link v-for="tag in data.tags" :key="tag.name" class="tag" @click="router.push(`/?tag=${tag.name}`)">{{ tag.name }}</el-link>
            </div>
            <div class="article-intro">
                <h3 class="article-title">{{ data.title }}</h3>
                <p class="article-summay">{{ data.summary }}</p>
            </div>
            <div class="article-count">
                <svg-icon class="article-count-item count-views" icon-class="views">{{ data.meta.viewCount }}</svg-icon>
                <svg-icon class="article-count-item count-likes" :class="{ 'count-likes-active': data.meta.isUserLike === 1 }" icon-class="likes">{{ data.meta.isUserLike }}</svg-icon>
                <svg-icon class="article-count-item count-star" :class="{ 'count-star-active': data.meta.isUserCollection === 1 }" icon-class="star">{{ data.meta.isUserCollection }}</svg-icon>
                <svg-icon class="article-count-item count-comment" icon-class="comment">{{ data.meta.commentCount }}</svg-icon>
            </div>
        </div>
        <img class="article-photo" v-if="data.photo" :src="getArticlePhoto(data.photo)" alt="" />
    </li>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { Article } from "@/interface/article/article"
import { format } from "timeago.js"

const router = useRouter()
defineProps<{
    data: Article
}>()

function getArticlePhoto(path) {
    return `${process.env.VUE_APP_BASE_API}/article-service${path}`
}
</script>
