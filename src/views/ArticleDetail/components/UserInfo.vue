<template>
    <div class="user-info">
        <div class="user-avatar">
            <Avatar class="user-avatar" :photo="photo" :username="state?.nick || state?.username" :showUsername="true" />
            <p>{{ state?.remark }}</p>
            <p>关注者:{{ state?.fans }}</p>
            <el-button class="watch-btn" :type="isWatch ? 'success' : 'primary'" @click="watchUserInfo" :loading="loading">{{ isWatch ? "取消关注" : "关注" }}</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue"
import { computed, ref, watch } from "vue"
import { useStore } from "vuex"
import { User } from "@/interface/user/user"
import { Response } from "@/interface/common/response"
import { watchUser, watchStatus } from "@/api/user/watch"
import { ElMessage } from "element-plus"

const store = useStore()
const props = defineProps<{
    user: User
}>()
const state = ref<User>(props?.user)

const photo = computed(() => {
    if (state.value) {
        return `${process.env.VUE_APP_BASE_API}/user-service${state.value?.photo}`
    }
})
const isWatch = ref(false)
const isLogin = store.getters["identity/isValid"]
const loading = ref(false)

//关注用户
function watchUserInfo() {
    loading.value = true
    watchUser(state.value?.id)
        .then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success(data.result)
                isWatch.value = !isWatch.value
            } else {
                ElMessage.warning(data.message)
            }
        })
        .finally(() => {
            loading.value = false
        })
}

//关注状态
function status() {
    if (isLogin) {
        console.log(state.value)
        watchStatus(state.value?.id).then((data: Response<boolean>) => {
            if (data.status === 200) {
                isWatch.value = data.result
            }
        })
    }
}

watch(props, (newVal) => {
    state.value = newVal.user
    status()
})
</script>
