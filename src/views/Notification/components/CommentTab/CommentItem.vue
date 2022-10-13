<template>
    <li class="comment-item">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="comment-content">
            <div class="comment-meta">
                <div style="white-space: nowarp">
                    <el-link :href="`/user/${comment.userId}`" target="_blank">{{ comment.nick || comment.username }}</el-link>
                    在
                    <el-link :href="`/article/${comment.articleId}`" target="_blank">{{ comment.articleTitle }}</el-link>
                    发表了评论
                </div>
                <div style="white-space: nowrap">{{ format(comment?.createTime, "zh_CN") }}</div>
            </div>
            <div class="comment-words" ref="commentRef"></div>
            <div class="comment-btns">
                <div>
                    <svg-icon class="action-btn reply" icon-class="comment" @click="reply">回复</svg-icon>
                    <svg-icon class="action-btn allow" icon-class="views" v-if="comment.status === 2" @click="allow">允许显示</svg-icon>
                    <svg-icon class="action-btn delete" icon-class="delete" @click="remove">删除</svg-icon>
                </div>
                <el-button size="small" @click="read">已读</el-button>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, getCurrentInstance } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import Avatar from "@/components/Avatar.vue"
import { Response } from "@/interface/common/response"
import { Comment } from "@/interface/comment/comment"
import { readComment, authorDeleteComment, allowComment } from "@/api/comment/comment"

const props = defineProps<{
    comment: Comment
}>()
const emits = defineEmits<{
    (event: "deleteMessage", cid: number): void
    (event: "replyMessage", comment: Comment): void
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

function read() {
    readComment(props?.comment.id).then((data: Response<string>) => {
        if (data.status === 200) {
            emits("deleteMessage", props?.comment.id)
        }
    })
}
function remove() {
    authorDeleteComment(props?.comment.id).then((data: Response<string>) => {
        if (data.status === 200) {
            emits("deleteMessage", props?.comment.id)
        }
    })
}
function allow() {
    allowComment(props?.comment.id).then((data: Response<string>) => {
        if (data.status === 200) {
            emits("deleteMessage", props?.comment.id)
        }
    })
}
function reply() {
    emits("replyMessage", props.comment)
}

</script>

<style scoped>
.comment-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
}
.comment-content {
    width: 100%;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
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
.action-btn {
    cursor: pointer;
    margin-right: 5px;
}
.reply:hover {
    color: skyblue;
}
.allow:hover {
    color: green;
}
.delete:hover {
    color: red;
}
.comment-btns {
    display: flex;
    justify-content: space-between;
}
</style>
