<template>
    <el-empty v-if="watchs.length <= 0" />
    <ul class="like-tab" v-else>
        <FollowItem v-for="item in watchs" :key="`${item.id}`" :watch="item" />
    </ul>
</template>

<script setup lang="ts">
import { ref } from "vue"
import FollowItem from "./FollowItem.vue"
import { Watch } from "@/interface/user/watch"
import { Response } from "@/interface/common/response"
import { watchList } from "@/api/user/watch"
import { ElMessage } from "element-plus"

const watchs = ref<Array<Watch>>([])
const props = defineProps<{
    uid: number
    fans: boolean
}>()

//获取关注消息
function getWathList() {
    watchList(props.uid, props.fans).then((data: Response<Array<Watch>>) => {
        if (data.status === 200) {
            watchs.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })
}

getWathList()
</script>

<style scoped>
.like-tab {
    list-style-type: none;
    padding-inline-start: 0px;
}
</style>
