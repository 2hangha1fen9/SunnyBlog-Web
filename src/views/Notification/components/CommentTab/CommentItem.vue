<template>
    <Comment>
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
import Comment from "@/components/CommentListItem.vue"
import { getImgUrl } from "@/utils/converter"


const props = defineProps<{
    comment: Comment
}>()
const emits = defineEmits<{
    (event: "deleteMessage", cid: number): void
    (event: "replyMessage", comment: Comment): void
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
