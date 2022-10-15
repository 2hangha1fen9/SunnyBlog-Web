<template>
    <div :class="['user-normal-cover',gradientClass]">
        <Avatar class="user-normal-avatar" :photo="photo" :showUsername="false" />
        <div class="user-normal-info">
            <p>
                <h1>
                    {{ user.nick || user.username }}
                    <svg-icon v-if="user.sex && user.sex != 0" class="user-sex" :icon-class="user.sex == 1 ? 'sexm' : 'sexw'" />
                </h1>
                <el-button class="user-normal-follow-btn" v-if="user.id != userId" round :type="isWatch ? 'success' : 'primary'" @click="watchUserInfo" :loading="loading">{{ isWatch ? "取消关注" : "关注" }}</el-button>
            </p>
            <p class="user-normal-remark">{{ user.remark }}</p>
            <p>加入于：{{dateFormatter(user.registerTime)}}</p>
            <div class="user-normal-meta">
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
import { computed, ref, watch,reactive } from "vue"
import { ElMessage } from "element-plus"
import Avatar from "@/components/Avatar.vue"
import { User } from "@/interface/user/user"
import { UserMeta } from "@/interface/comment/summary"
import { watchUser, watchStatus } from "@/api/user/watch"
import {dateFormatter}from "@/utils/converter"
import { random } from "lodash"

const store = useStore()
const props = defineProps<{
    user: User
    meta: UserMeta
}>()

const photo = computed(() => {
    if (props.user) {
        return `${process.env.VUE_APP_BASE_API}/user-service${props.user.photo}`
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

status()
watch(props, (newVal) => {
    props.user = newVal
    status()
})

const gradientClass = computed(() => {
    return `gradient-${random(1,5)}`
})
</script>

<style scoped>
.gradient-1{
    background:#4ca1af;
    background: -webkit-linear-gradient(to right, #c4e0e5, #4ca1af);
    background: linear-gradient(to right, #c4e0e5, #4ca1af);
}
.gradient-2{
    background:#c2e59c;
    background: -webkit-linear-gradient(to right, #b6fbff, #83a4d4);
    background: linear-gradient(to right, #64b3f4, #c2e59c);
}
.gradient-3{
    background:#83a4d4;
    background: -webkit-linear-gradient(to right, #b6fbff, #83a4d4);
    background: linear-gradient(to right, #b6fbff, #83a4d4);
}
.gradient-4{
    background:#50C9C3;
    background: -webkit-linear-gradient(to right, #b6fbff, #83a4d4);
    background: linear-gradient(to right, #96DEDA, #50C9C3);
}
.gradient-5{
    background:#7F7FD5;
    background: -webkit-linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);;
    background: linear-gradient(to right, #91EAE4, #86A8E7, #7F7FD5);
}
</style>