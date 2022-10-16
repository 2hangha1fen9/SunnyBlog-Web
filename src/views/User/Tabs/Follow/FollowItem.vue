<template>
    <li class="follow-item">
        <div class="follow-avatar">
            <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
            <div>
                <el-link :href="`/user/${state?.userId}`" target="_blank">{{ state?.nick || state?.username }}</el-link>
                <p class="user-remark">{{ state?.remark }}</p>
            </div>
        </div>
        <el-button size="small" :type="isWatch ? 'success' : 'primary'" @click="watchUserInfo" :loading="loading">{{ isWatch ? "取消关注" : "关注" }}</el-button>
    </li>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue"
import { computed, ref, watch } from "vue"
import { useStore } from "vuex"
import { Watch } from "@/interface/user/watch"
import { Response } from "@/interface/common/response"
import { watchUser, watchStatus } from "@/api/user/watch"
import { ElMessage } from "element-plus"
import { getImgUrl } from "@/utils/converter"


const store = useStore()
const props = defineProps<{
    watch: Watch
}>()
const state = ref<Watch>(props?.watch)

const photo = computed(() => {
    if (state.value) {
        return getImgUrl("user-service",state.value?.photo)
    }
})
const isWatch = ref(false)
const isLogin = store.getters["identity/isValid"]
const loading = ref(false)

//关注用户
function watchUserInfo() {
    loading.value = true
    watchUser(state.value?.userId)
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
    if (isLogin && state.value?.userId) {
        watchStatus(state.value?.userId).then((data: Response<boolean>) => {
            if (data.status === 200) {
                isWatch.value = data.result
            }
        })
    }
}

status()
watch(props, (newVal) => {
    state.value = newVal.user
    status()
})
</script>

<style scoped></style>
