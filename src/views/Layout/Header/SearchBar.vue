<template>
    <el-autocomplete class="search-bar" clearable :suffix-icon="Search" v-model="keyword" :fetch-suggestions="getHistory" placeholder="搜索文章/标签/用户" />
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { Search } from "@element-plus/icons-vue"

const keyword = ref("")
const history = reactive<Array<{ id: number; value: string }>>([
    {
        id: 1,
        value: "vue",
    },
    {
        id: 2,
        value: "c#",
    },
])
function getHistory(queryString, callback) {
    return callback(history)
}
</script>

<style>
.search-bar {
    margin: 15px;
}
</style>
