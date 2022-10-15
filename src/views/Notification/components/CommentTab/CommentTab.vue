<template>
    <el-button style="margin-bottom: 15px" @click="clear" v-if="comments.length > 0" size="small">清空所有</el-button>
    <el-empty v-if="comments.length <= 0" />
    <ul class="comment-tab" v-else>
        <CommentListItem v-for="item in comments" :key="`${item.id}`" :comment="item" @delete="deleteComment" @reply="replyComment" @allow="allowCommentStatus" @read="readCommentStatus" :showStatus="true" :showUsername="true" :showTitle="true" />
    </ul>
    <el-dialog align-center v-model="dialogVisible" v-if="dialogVisible" title="回复">
        <CommentReplyEditor :comment="currentComment" @closeDialog="dialogVisible = false" @deleteMessage="deleteMessage" />
    </el-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue"
import CommentListItem from "@/components/CommentListItem.vue"
import { Comment } from "@/interface/comment/comment"
import { Response } from "@/interface/common/response"
import { getUnreadCommentList, readComment, authorDeleteComment, allowComment } from "@/api/comment/comment"
import { ElMessage } from "element-plus"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import CommentReplyEditor from "@/components/CommentReplyEditor.vue"

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
//删除评论
function deleteComment(cid: number) {
    authorDeleteComment(cid).then((data: Response<string>) => {
        if (data.status === 200) {
            deleteMessage(cid)
        }
    })
}
//审核评论
function allowCommentStatus(cid: number) {
    allowComment(cid).then((data: Response<string>) => {
        if (data.status === 200) {
            deleteMessage(cid)
        }
    })
}
//已读评论
function readCommentStatus(cid: number) {
    readComment(cid).then((data: Response<string>) => {
        if (data.status === 200) {
            deleteMessage(cid)
        }
    })
}
//回复评论
function replyComment(comment: Comment) {
    currentComment.value = comment
    dialogVisible.value = true
}

//全部已读
function clear() {
    readComment(-1, true).then((data: Response<string>) => {
        if (data.status === 200) {
            comments.value = []
        }
    })
}

getComment()
</script>

<style scoped>
.comment-tab {
    list-style-type: none;
    padding-inline-start: 0px;
}
</style>
