<template>
    <el-button style="margin-bottom: 15px" @click="clear" v-if="comments.length > 0" size="small">清空所有</el-button>
    <el-empty v-if="comments.length <= 0" />
    <ul class="comment-tab" v-else>
        <CommentItem v-for="item in comments" :key="`${item.id}`" :comment="item" @deleteMessage="deleteMessage" @replyMessage="replyMessage" />
    </ul>
    <el-dialog align-center v-model="dialogVisible" v-if="dialogVisible" title="回复">
        <CommentReplyEditor :comment="currentComment" @closeDialog="dialogVisible = false" @deleteMessage="deleteMessage" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import CommentItem from "./CommentItem.vue"
import { Comment } from "@/interface/comment/comment"
import { Response } from "@/interface/common/response"
import { getUnreadCommentList, readComment } from "@/api/comment/comment"
import { ElMessage } from "element-plus"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import CommentReplyEditor from "./CommentReplyEditor.vue"

const comments = ref<Array<Comment>>([])
//选中的评论
const currentComment = ref<Comment>()
const dialogVisible = ref(false)

//获取评论消息
function getComment() {
    getUnreadCommentList().then((data: Response<Array<Comment>>) => {
        if (data.status === 200) {
            comments.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })
}

//删除评论消息
function deleteMessage(cid: number) {
    comments.value = comments.value.filter((item: Comment) => item.id !== cid)
}

//全部已读
function clear() {
    readComment(-1, true).then((data: Response<string>) => {
        if (data.status === 200) {
            comments.value = []
        }
    })
}

//回复评论
function replyMessage(comment: Comment) {
    currentComment.value = comment
    dialogVisible.value = true
}

getComment()
</script>

<style scoped>
.comment-tab {
    list-style-type: none;
    padding-inline-start: 0px;
}
</style>
