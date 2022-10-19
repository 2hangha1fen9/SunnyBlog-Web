<template>
    <div class="user-img-cover" :style="{ 'background-image': `url(${cover})` }">
        <div class="user-img-info">
            <Avatar class="user-img-avatar" :photo="photo" :showUsername="false" />
            <div class="user-img-nick">
                <p>
                    {{ user.nick || user.username }}
                    <svg-icon v-if="user.sex && user.sex != 0" class="user-sex" :icon-class="user.sex == 1 ? 'sexm' : 'sexw'" />
                    <el-button v-if="user.id != userId" round size="small" :type="isWatch ? 'success' : 'primary'" @click="watchUserInfo" :loading="loading">{{ isWatch ? "取消关注" : "关注" }}</el-button>
                </p>
                <p class="user-img-remark">{{ user.remark }}</p>
                <p class="user-img-remark">加入于：{{ dateFormatter(user.registerTime) }}</p>
            </div>

            <div class="user-img-meta">
                <el-tag class="meta-item" effect="dark" round color="pink"> 粉丝 {{ user.fans }} </el-tag>
                <el-tag class="meta-item" effect="dark" round color="#f89898"> 浏览 {{ meta.likeCount }} </el-tag>
                <el-tag class="meta-item" effect="dark" round color="crimson"> 点赞 {{ meta.likeCount }} </el-tag>
                <el-tag class="meta-item" effect="dark" round color="coral"> 评论 {{ meta.commentCount }} </el-tag>
                <el-tag class="meta-item" effect="dark" round color="darkorange"> 收藏 {{ meta.collectionCount }} </el-tag>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import { computed, ref, watch } from "vue"
import { ElMessage } from "element-plus"
import Avatar from "@/components/Avatar.vue"
import { User } from "@/interface/user/user"
import { UserMeta } from "@/interface/comment/summary"
import { watchUser, watchStatus } from "@/api/user/watch"
import { dateFormatter } from "@/utils/converter"
import { getImgUrl } from "@/utils/converter"

const store = useStore()
const props = defineProps<{
    user: User
    meta: UserMeta
}>()

const cover = computed(() => {
    if (props.user) {
        return getImgUrl("user-service", props.user.cover)
    }
})
const photo = computed(() => {
    if (props.user) {
        return getImgUrl("user-service", props.user.photo)
    }
})
const isWatch = ref(false)
const isLogin = store.getters["identity/isValid"]
const userId = store.getters["identity/isValid"]
const loading = ref(false)

//关注用户
function watchUserInfo() {
    loading.value = true
    watchUser(props.user.id)
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
    if (isLogin && props.user.id && userId != props.user.id) {
        watchStatus(props.user.id).then((data: Response<boolean>) => {
            if (data.status === 200) {
                isWatch.value = data.result
            }
        })
    }
}

watch(props, (newVal) => {
    props.user = newVal
    status()
})
</script>
