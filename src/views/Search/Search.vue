<template>
    <div class="search-container">
        <el-menu class="menu" mode="horizontal" router :ellipsis="true" :default-active="defaultActive">
            <el-menu-item :index="`/search/article/${keyword}`" style="background: none">文章</el-menu-item>
            <el-menu-item :index="`/search/tag/${keyword}`" style="background: none">标签</el-menu-item>
            <el-menu-item :index="`/search/user/${keyword}`" style="background: none">用户</el-menu-item>
        </el-menu>
        <router-view></router-view>
    </div>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from "vue-router"
import { reactive, ref, watch } from "vue"

const router = useRouter()
const route = useRoute()
const defaultActive = ref<string>()
const props = defineProps<{
    keyword: string
}>()

watch(
    route,
    (newVal) => {
        defaultActive.value = decodeURI(newVal.path)
    },
    {
        immediate: true,
    }
)
</script>

<style scoped>
.search-container {
    width: 700px;
    max-width: 100%;
    margin: 20px auto auto;
    box-shadow: var(--el-box-shadow);
}
.menu {
    transition: all 0.5s;
    position: sticky;
    top: 0;
    z-index: 10;
    border-bottom: none;
    background: none;
    max-width: 100%;
    justify-content: center;
    height: 40px;
    border-bottom: 1px solid var(--el-border-color);
    background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
}
</style>
