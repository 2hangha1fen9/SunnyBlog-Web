<template>
    <header v-if="articlePhoto" class="img-cover" :style="{ 'background-image': `url(${articlePhoto})` }">
        <div class="cover-img-meta" v-if="state">
            <h1 class="cover-title">{{ state?.title }}</h1>
            <p class="cover-meta">
                <span>阅读: {{ state?.meta?.viewCount }}</span>
                <span>点赞: {{ state?.meta?.likeCount }}</span>
                <span>收藏: {{ state?.meta?.collectionCount }}</span>
            </p>
            <el-link v-if="state.regionName" @click="jumpRegion(state.regionName)" style="color: white">{{ state.regionName }}</el-link>
        </div>
    </header>
    <header v-else class="pure-cover reactive-main">
        <div class="cover-pure-meta" v-if="state">
            <h1 class="cover-title">{{ state?.title }}</h1>
            <p class="cover-meta">
                <span>阅读: {{ state?.meta?.viewCount }}</span>
                <span>点赞: {{ state?.meta?.likeCount }}</span>
                <span>收藏: {{ state?.meta?.collectionCount }}</span>
                <el-divider direction="vertical" v-if="state.regionName" />
                <el-link v-if="state.regionName" @click="jumpRegion(state.regionName)">{{ state.regionName }}</el-link>
            </p>
        </div>
    </header>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { watch, ref, getCurrentInstance } from "vue"
import { Article } from "@/interface/article/article"
import { getImgUrl } from "@/utils/converter"

const props = defineProps<{
    article: Article
}>()

const router = useRouter()
const state = ref<Article>(props.article)
const articlePhoto = ref<string>(null)

watch(
    props,
    (newVal) => {
        state.value = newVal.article
        if (state?.value?.photo) {
            articlePhoto.value = getImgUrl("article-service", state?.value?.photo)
        }
        return null
    },
    {
        immediate: true,
    }
)

const instance = getCurrentInstance()
//调用region组件的跳转方法
function jumpRegion(region) {
    //跳转到首页分类
    let url = router.resolve({
        path: "/index",
        query: {
            region: region,
        },
    })
    window.open(url.href, "_blank")
}
</script>
