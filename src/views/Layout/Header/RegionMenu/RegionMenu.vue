<template>
    <el-menu class="menu" mode="horizontal" router :ellipsis="true" :default-active="route.fullPath">
        <el-menu-item index="/" style="background: none" @click="router.replace('/')">
            <template #title>
                <span>综合</span>
            </template>
        </el-menu-item>
        <RegionItem v-for="region in regions" :item="region" :key="region.name"></RegionItem>
    </el-menu>
</template>

<script setup lang="ts">
import {ref } from "vue"
import { useRoute } from "vue-router"
import RegionItem from "./RegionItem.vue"
import { listRegion } from "@/api/article/region"
import { Response } from "@/interface/common/response"
import { Region } from "@/interface/article/region"


const route = useRoute()
const regions = ref<Array<Region>>([])

function getRegionList() {
    listRegion().then((data: Response<Array<Region>>) => {
        regions.value = data.result
    })
}

getRegionList()
</script>

<style scoped>
.menu {
    border-bottom: none;
    background: none;
    width: 20vw;
}
</style>
