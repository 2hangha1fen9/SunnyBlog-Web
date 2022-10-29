<template>
    <div class="article-btns">
        <el-badge class="btn-item" :value="data.meta?.likeCount || 0">
            <svg-icon class="count-likes" @click="like(1)" :class="{ 'count-likes-active': data.meta?.isUserLike === 1 }" icon-class="likes"></svg-icon>
        </el-badge>
        <el-badge class="btn-item" :value="data.meta?.collectionCount || 0">
            <svg-icon class="count-star" @click="like(2)" :class="{ 'count-star-active': data.meta?.isUserCollection === 1 }" icon-class="star"></svg-icon>
        </el-badge>
        <el-badge class="btn-item" :value="data.meta?.commentCount || 0">
            <svg-icon class="count-comment" @click="toComment" icon-class="comment">{{}}</svg-icon>
        </el-badge>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { Article } from "@/interface/article/article"
import { Response } from "@/interface/common/response"
import { ElMessage } from "element-plus"
import { likeArticle } from "@/api/comment/like"

const props = defineProps<{
    data: Article
}>()

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

function toComment() {
    window.scrollTo({
        top: document.getElementById("comment")?.offsetTop,
        behavior: "smooth",
    })
}
</script>
