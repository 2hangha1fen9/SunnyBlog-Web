<template>
    <div class="tag-container">
        <el-empty v-if="state.length <= 0" />
        <div v-else>
            <el-tooltip v-for="tag in state" :key="tag.name" effect="dark" :content="` ${tag.articleCount} 篇文章`" placement="top-start">
                <el-tag class="tag-item" :color="tag.color" effect="dark" @click.stop="jumpArticleList(tag.name)">
                    {{ tag.name }}
                </el-tag>
            </el-tooltip>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Tag } from "@/interface/article/tag"
import { Response } from "@/interface/common/response"
import { listPublicTag } from "@/api/article/tag"
import { ElMessage } from "element-plus"

const route = useRoute()
const router = useRouter()
const props = defineProps<{
    keyword: string
}>()
const keyword = ref(props.keyword)
const state = ref<Array<Tag>>([])

function getTag() {
    listPublicTag([
        {
            key: "name",
            value: keyword.value,
        },
    ]).then((data: Response<Array<Tag>>) => {
        if (data.status === 200) {
            state.value = data.result
        } else {
            ElMessage.warning(data.message)
        }
    })
}

getTag()
watch(route, (newVal) => {
    keyword.value = newVal.params["keyword"]
    getTag()
})

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

<style scoped>
.tag-container {
    width: 100%;
    min-height: 700px;
    padding: 20px;
    box-sizing: border-box;
}
.tag-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
}
</style>
