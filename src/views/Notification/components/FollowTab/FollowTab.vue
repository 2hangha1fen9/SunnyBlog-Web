<template>
    <el-button style="margin-bottom: 15px" @click="clear" v-if="watchs.length > 0" size="small">清空所有</el-button>
    <el-empty v-if="watchs.length <= 0" />
    <ul class="like-tab" v-else>
        <LikeItem v-for="item in watchs" :key="`${item.id}`" :watch="item" @deleteMessage="deleteMessage" />
    </ul>
</template>

<script setup lang="ts">
import { ref } from "vue"
import LikeItem from "./FollowItem.vue"
import { Watch } from "@/interface/user/watch"
import { Response } from "@/interface/common/response"
import { watchMessage, watchMessageDelete } from "@/api/user/watch"
import { ElMessage } from "element-plus"

const watchs = ref<Array<Watch>>([])

//获取点赞消息
function getMessage() {
    watchMessage().then((data: Response<Array<Watch>>) => {
        if (data.status === 200) {
            watchs.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })
}

//删除点赞消息
function deleteMessage(cid: number) {
    watchs.value = watchs.value.filter((item: Like) => item.id !== cid)
}

//全部已读
function clear() {
    watchMessageDelete(-1, true).then((data: Response<string>) => {
        if (data.status === 200) {
            watchs.value = []
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
