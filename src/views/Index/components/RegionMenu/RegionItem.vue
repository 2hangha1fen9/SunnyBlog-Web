<template>
    <!-- 如果路由有子级 -->
    <el-sub-menu v-if="item.inverseParent && item.inverseParent.length" :index="regionPath" :show-timeout="100">
        <template #title>
            <span @click="openMenu" style="width: 100%">{{ item.name }}</span>
        </template>
        <el-menu-item :index="regionPath">
            <template #title>
                <span>{{ item.name }} </span>
            </template>
        </el-menu-item>
        <!-- 遍历子级 -->
        <RegionItem v-for="chlid in item.inverseParent" :item="chlid" :key="`${regionPath}/${chlid.name}`" :regionPath="`${regionPath}/${chlid.name}`"></RegionItem>
    </el-sub-menu>
    <!-- 路由没有子级 -->
    <el-menu-item v-else :index="regionPath">
        <template #title>
            <span>{{ item.name }}</span>
        </template>
    </el-menu-item>
</template>

<script setup lang="ts">
import { getCurrentInstance } from "vue"
import { Region } from "@/interface/article/region"

defineProps<{
    item: Region
    regionPath: string
}>()

//调用菜单的选中方法
const instance = getCurrentInstance()
function openMenu() {
    instance?.proxy?.$bus.emit("openSubMenu")
}
</script>
