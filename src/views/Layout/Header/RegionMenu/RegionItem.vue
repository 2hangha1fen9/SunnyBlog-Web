<template>
    <!-- 如果路由有子级 -->
    <el-sub-menu v-if="item.inverseParent && item.inverseParent.length" :index="`/?region=${item.name}`" @click="router.push(`/?region=${item.name}`)">
        <template #title>
            <span>{{ item.name }} </span>
        </template>
        <el-menu-item :index="`/?region=${item.name}`">
            <template #title>
                <span>{{ item.name }} </span>
            </template>
        </el-menu-item>
        <!-- 遍历子级 -->
        <RegionItem v-for="chlid in item.inverseParent" :item="chlid" :key="chlid.id"></RegionItem>
    </el-sub-menu>
    <!-- 路由没有子级 -->
    <el-menu-item v-else :index="`/?region=${item.name}`">
        <template #title>
            <span>{{ item.name }}</span>
        </template>
    </el-menu-item>
</template>

<script setup lang="ts">
import { Region } from "@/interface/article/region"
import { useRouter } from "vue-router"
const router = useRouter()
defineProps<{
    // eslint-disable-next-line no-undef
    item: Region
}>()
</script>
