<template>
    <li class="comment-item">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="comment-content">
            <div class="comment-meta">
                <div style="white-space: nowarp">
                    <el-link :href="`/article/${comment.articleId}`" target="_blank">{{ comment.articleTitle }}</el-link>
                </div>
                <div style="white-space: nowrap">{{ format(comment?.createTime, "zh_CN") }}</div>
            </div>
            <div class="comment-words" ref="commentRef"></div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import Avatar from "@/components/Avatar.vue"
import { Response } from "@/interface/common/response"
import { Comment } from "@/interface/comment/comment"
import { getImgUrl } from "@/utils/converter"


const props = defineProps<{
    comment: Comment
    uid:number
}>()

const photo = computed(() => {
    if (props?.comment.photo) {
        return getImgUrl("user-service",props?.comment.photo)
    }
    return null
})

const commentRef = ref()
nextTick(() => {
    Vditor.preview(commentRef.value, props?.comment.content, {
        markdown: {
            mark: true,
        },
    })
})
</script>

<style scoped>
.comment-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 20px;
    margin-top: 20px;
    border-bottom: 0.5px solid lightgray;
}
.comment-content {
    width: 100%;
    padding-inline-start: 20px;
}
.comment-meta {
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.comment-words {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
