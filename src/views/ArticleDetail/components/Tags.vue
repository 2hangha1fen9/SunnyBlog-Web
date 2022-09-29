<template>
    <el-card class="tag-container" shadow="never">
        <template #header>
            <span>标签</span>
        </template>
        <el-tooltip v-for="tag in state?.tags" :key="tag?.name" effect="dark" :content="` ${tag?.articleCount} 篇文章`" placement="top-start">
            <el-tag class="tag-item" :color="tag?.color" effect="dark" @click.stop="jumpArticleList(tag?.name)">
                {{ tag?.name }}
            </el-tag>
        </el-tooltip>
    </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { Article } from "@/interface/article/article"

const router = useRouter()
const props = defineProps<{
    article: Article
}>()

const state = ref<Article>(props.article)
watch(
    props,
    (newVal) => {
        state.value = newVal.article
    },
    {
        immediate: true,
    }
)

function jumpArticleList(tagName: string) {
    let url = router.resolve({
        path: "/article",
        query: {
            tag: tagName,
        },
    })
    window.open(url.href, "_blank")
}
</script>

<style></style>
