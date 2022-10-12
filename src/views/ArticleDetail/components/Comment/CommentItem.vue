<template>
    <div class="comment-item">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="comment-container">
            <div class="comment-meta">
                <p class="comment-username">{{ comment.nick || comment.username }}</p>
                <p class="comment-publish-time">{{ format(comment?.createTime, "zh_CN") }}</p>
            </div>
            <div class="comment-content" ref="commentRef"></div>
            <svg-icon class="comment-reply" icon-class="comment" @click="reply(comment)">回复</svg-icon>
            <div class="sub-comment-item" v-if="comment?.inverseParent.length > 0">
                <CommentList :comments="comment?.inverseParent" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, getCurrentInstance } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import CommentList from "./CommentList.vue"
import Avatar from "@/components/Avatar.vue"
import { Comment } from "@/interface/comment/comment"

const instance = getCurrentInstance()
const props = defineProps<{
    comment: Comment
}>()
const photo = computed(() => {
    if (props?.comment.photo) {
        return `${process.env.VUE_APP_BASE_API}/user-service${props?.comment.photo}`
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

function reply(comment: Comment) {
    instance?.proxy?.$bus.emit("replyComment", comment)
    window.scrollTo({ top: document.getElementById("vditor")?.offsetTop, behavior: "smooth" }) //滚动到页面顶部
}
</script>
