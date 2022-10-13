<template>
    <li class="like-item">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="like-content">
            <el-link :href="`/user/${comment.userId}`" target="_blank">{{ like.nick || like.username }}</el-link>
            在
            <el-link :href="`/article/${like.articleId}`" target="_blank">{{ like.articleTitle }}</el-link>
            给你点赞
        </div>
        <el-button size="small" @click="remove">删除</el-button>
    </li>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { format } from "timeago.js"
import { Response } from "@/interface/common/response"
import { Like } from "@/interface/comment/like"
import { deleteLikeMessage } from "@/api/comment/like"

const props = defineProps<{
    like: Like
}>()
const emits = defineEmits<{
    (event: "deleteMessage", cid: number): void
}>()
const photo = computed(() => {
    if (props?.like.photo) {
        return `${process.env.VUE_APP_BASE_API}/user-service${props?.like.photo}`
    }
    return null
})

function remove() {
    deleteLikeMessage(props?.like.id).then((data: Response<string>) => {
        if (data.status === 200) {
            emits("deleteMessage", props?.like.id)
        }
    })
}
</script>

<style scoped>
.like-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    align-items: center;
}
.like-content {
    width: 100%;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
}
</style>
