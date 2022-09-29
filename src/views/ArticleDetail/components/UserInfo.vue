<template>
    <div class="user-info">
        <div class="user-avatar">
            <Avatar class="user-avatar" :photo="photo" :username="user?.nick || user?.username" :showUsername="true" />
            <p >{{ user?.remark }}</p>
            <p>关注者:{{ user?.fans }}</p>
            <el-button class="watch-btn" type="primary">关注</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { User } from "@/interface/user/user"
import Avatar from "@/components/Avatar.vue"
import { computed } from "@vue/runtime-core"
const props = defineProps<{
    user: User
}>()

const photo = computed(() => {
    if (props?.user) {
        return `${process.env.VUE_APP_BASE_API}/user-service${props?.user?.photo}`
    }
})
</script>
