<template>
    <li class="user-item">
        <div class="user-avatar">
            <Avatar :photo="photo" :showUsername="false" />
            <div>
                <el-link :href="`/user/${user?.userId}`" target="_blank">{{ user?.nick || user?.username }}</el-link>
                <p class="user-remark">{{ user?.remark }}</p>
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
import { User } from "@/interface/user/user"
import { Response } from "@/interface/common/response"
import { watchUser, watchStatus } from "@/api/user/watch"
import { ElMessage } from "element-plus"
import { getImgUrl } from "@/utils/converter"

const store = useStore()
const props = defineProps<{
    user: User | Watch
}>()

const photo = computed(() => {
    if (props) {
        return getImgUrl("user-service", props.user.photo)
    }
})
const isWatch = ref(false)
const isLogin = store.getters["identity/isValid"]
const loading = ref(false)

//关注用户
function watchUserInfo() {
    loading.value = true
    watchUser(props.user?.userId)
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
        watchStatus(props.user?.userId).then((data: Response<boolean>) => {
            if (data.status === 200) {
                isWatch.value = data.result
            }
        })
    }
}

status()
</script>
