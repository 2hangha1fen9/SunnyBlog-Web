<template>
    <el-input class="search-bar" clearable :suffix-icon="Search" v-model="keyword" placeholder="搜索文章/标签/用户" @keyup.enter="search" />
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { Search } from "@element-plus/icons-vue"

const route = useRoute()
const router = useRouter()
const keyword = ref("")
function search() {
    if (keyword.value) {
        if (route.matched.find((r) => r.name === "search")) {
            //默认跳转
            let tabName = route.path.replace("/search", "").split("/")[1]
            if (tabName && keyword.value) {
                //在搜索页面则修改搜索值跳转
                router.push(`/search/${tabName}/${keyword.value}`)
            } else {
                router.push(`/search/article/${keyword.value}`)
            }
        } else {
            router.push(`/search/article/${keyword.value}`)
        }
    }
}
</script>

<style>
.search-bar {
    margin: 15px;
}
</style>
