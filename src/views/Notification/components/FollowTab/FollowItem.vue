<template>
    <li class="follow-item">
        <div class="follow-avatar">
            <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
            <el-link style="margin: 5px" :href="`/user/${watch?.userId}`" target="_blank">{{ watch?.nick || watch?.username }}</el-link>
            关注了你
        </div>
        <el-button size="small" @click="remove">删除</el-button>
    </li>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue"
import { computed } from "vue"
import { format } from "timeago.js"
import { Response } from "@/interface/common/response"
import { Watch } from "@/interface/user/watch"
import { watchMessageDelete } from "@/api/user/watch"

const props = defineProps<{
    watch: Watch
}>()
const emits = defineEmits<{
    (event: "deleteMessage", lid: number): void
}>()
const photo = computed(() => {
    if (props?.watch.photo) {
        return `${process.env.VUE_APP_BASE_API}/user-service${props?.watch.photo}`
    }
    return null
})

function remove() {
    watchMessageDelete(props?.watch.id).then((data: Response<string>) => {
        if (data.status === 200) {
            emits("deleteMessage", props?.watch.id)
        }
    })
}
</script>

<style scoped>
.follow-item {
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
    justify-content: space-between;
    align-items: center;
}
.follow-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
