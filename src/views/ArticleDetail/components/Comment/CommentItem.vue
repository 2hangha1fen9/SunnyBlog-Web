<template>
    <div class="comment-item">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="comment-container">
            <div class="comment-meta">
                <el-link class="comment-username" :href="`/user/${comment.userId}`" target="_blank">{{ comment.nick || comment.username }}</el-link>
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
import { computed, nextTick, ref, getCurrentInstance, onUnmounted } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import CommentList from "./CommentList.vue"
import Avatar from "@/components/Avatar.vue"
import { Comment } from "@/interface/comment/comment"
import { getImgUrl } from "@/utils/converter"
import { useDark } from "@vueuse/core"

//判断是否是黑暗模式
const isDark = useDark()
const instance = getCurrentInstance()
const props = defineProps<{
    comment: Comment
}>()
const photo = computed(() => {
    if (props?.comment.photo) {
        return getImgUrl("user-service", props?.comment.photo)
    }
    return null
})

const commentRef = ref()
nextTick(() => {
    Vditor.preview(commentRef.value, props?.comment.content, {
        markdown: {
            mark: true,
        },
        theme: {
            current: isDark.value ? "dark" : "light",
        },
        hljs: {
            lineNumber: true,
            style: isDark.value ? "native" : "github",
        },
    })
})

//切换黑暗模式事件
instance?.proxy?.$bus.on("switchStyle", switchStyle)
function switchStyle(status: boolean) {
    Vditor.setContentTheme(status ? "dark" : "light", "https://unpkg.com/vditor@3.8.17/dist/css/content-theme/")
    Vditor.setCodeTheme(status ? "native" : "github")
}

function reply(comment: Comment) {
    instance?.proxy?.$bus.emit("replyComment", comment)
    window.scrollTo({ top: document.getElementById("vditor")?.offsetTop, behavior: "smooth" }) //滚动到页面顶部
}

onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("replyComment")
    instance?.proxy?.$bus.all.delete("switchStyle")
})
</script>
