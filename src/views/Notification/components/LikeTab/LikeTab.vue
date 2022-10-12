<template>
    <el-button style="margin-bottom: 15px" @click="clear" v-if="likes.length > 0" size="small">清空所有</el-button>
    <el-empty v-if="likes.length <= 0" />
    <ul class="like-tab" v-else>
        <LikeItem v-for="item in likes" :key="`${item.id}`" :like="item" @deleteMessage="deleteMessage" />
    </ul>
</template>

<script setup lang="ts">
import { ref } from "vue"
import LikeItem from "./LikeItem.vue"
import { Like } from "@/interface/comment/like"
import { Response } from "@/interface/common/response"
import { getLikeMessage, deleteLikeMessage } from "@/api/comment/like"
import { ElMessage } from "element-plus"

const likes = ref<Array<Like>>([])

//获取点赞消息
function getMessage() {
    getLikeMessage().then((data: Response<Array<Like>>) => {
        if (data.status === 200) {
            likes.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })
}

//删除点赞消息
function deleteMessage(cid: number) {
    likes.value = likes.value.filter((item: Like) => item.id !== cid)
}

//全部已读
function clear() {
    deleteLikeMessage(-1, true).then((data: Response<string>) => {
        if (data.status === 200) {
            likes.value = []
        }
    })
}

getMessage()
</script>

<style scoped>
.like-tab {
    list-style-type: none;
    padding-inline-start: 0px;
}
</style>
