<template>
    <li class="comment-item">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="comment-content">
            <div class="comment-meta">
                <div style="white-space: nowarp">
                    <el-link v-if="showUsername" :href="`/user/${comment.userId}`" target="_blank">{{ comment.nick || comment.username }}</el-link>
                    <span v-if="showUsername && showTitle"> : </span>
                    <el-link v-if="showTitle" :href="`/article/${comment.articleId}`" target="_blank">{{ comment.articleTitle }}</el-link>
                </div>
                <div style="white-space: nowrap">
                    <el-tag v-if="showStatus && comment.status === 2" type="info">待审核</el-tag>
                    {{ format(comment?.createTime, "zh_CN") }}
                </div>
            </div>
            <div class="comment-words" ref="commentRef"></div>
            <div class="comment-btns">
                <div>
                    <svg-icon class="action-btn reply" icon-class="comment" v-if="btnVisible.onReply" @click="emits('reply', comment)">回复</svg-icon>
                    <svg-icon class="action-btn allow" icon-class="views" v-if="btnVisible.onAllow && comment.status === 2" @click="emits('allow', comment.id)">允许显示</svg-icon>
                    <svg-icon class="action-btn delete" icon-class="delete" v-if="btnVisible.onDelete" @click="emits('delete', comment.id)">删除</svg-icon>
                </div>
                <el-button size="small" v-if="btnVisible.onRead" @click="emits('read', comment.id)">已读</el-button>
            </div>
        </div>
    </li>
</template>

<script setup lang="ts">
import { computed, nextTick, ref, getCurrentInstance, reactive } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import Avatar from "@/components/Avatar.vue"
import { Response } from "@/interface/common/response"
import { Comment } from "@/interface/comment/comment"
import { readComment, authorDeleteComment, allowComment } from "@/api/comment/comment"
import { getImgUrl } from "@/utils/converter"

const instance = getCurrentInstance()
const props = defineProps<{
    comment: Comment
    showStatus: boolean
    showUsername: boolean
    showTitle: boolean
}>()
const emits = defineEmits<{
    (event: "delete", cid: number): void
    (event: "read", cid: number): void
    (event: "allow", cid: number): void
    (event: "reply", comment: Comment): void
}>()
//按钮显示状态
const btnVisible = reactive({
    onAllow: false,
    onDelete: false,
    onRead: false,
    onReply: false,
})
// 根据绑定的自定义事件显示对应的按钮
for (let eventName in instance?.vnode.props) {
    if (/onAllow|onDelete|onRead|onReply/i.test(eventName)) {
        btnVisible[eventName] = true
    }
}

const photo = computed(() => {
    if (props?.comment.photo) {
        return  getImgUrl("user-service",props?.comment.photo)
    }
    return null
})

// 渲染评论
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
    margin-bottom: 15px;
    width: 100%;
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
