<template>
    <el-menu @open="watchExpandPath" class="menu" mode="horizontal" router :default-active="defaultActive">
        <el-menu-item index="/index" style="background: none" @click="router.replace('/index')">
            <template #title>
                <span>综合</span>
            </template>
        </el-menu-item>
        <RegionItem v-for="region in regions" :item="region" :key="region.name" :regionPath="`/index/${region.name}`"></RegionItem>
    </el-menu>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance, watch, onBeforeUnmount } from "vue"
import { useRouter, useRoute } from "vue-router"
import RegionItem from "./RegionItem.vue"
import { listRegion } from "@/api/article/region"
import { Response } from "@/interface/common/response"
import { Region } from "@/interface/article/region"

const router = useRouter()
const route = useRoute()
const defaultActive = ref<string>()

watch(route, (newVal) => {
    defaultActive.value = decodeURI(newVal.path)
})

const regions = ref<Array<Region>>([])
function getRegionList() {
    listRegion()
        .then((data: Response<Array<Region>>) => {
            regions.value = data.result
            defaultActive.value = decodeURI(route.path)
        })
        .then(() => {
            //如果路径含有region参数则跳转到相应region
            let region = route.query["region"]
            if (region) {
                jumpRegion(region)
            }
        })
}
getRegionList()

//监视菜单展开的项
const currentExpandPath = ref<string>()
function watchExpandPath(index) {
    currentExpandPath.value = index
}
//监听子菜单选中事件
const instance = getCurrentInstance()
instance?.proxy?.$bus.on("openSubMenu", () => {
    router.push(currentExpandPath.value)
})

//获取某个分区的路由路径
let state = false //判断是否查询到
function getRegionPath(regions: Array<Region>, result: string, key: string): string {
    for (let region of regions) {
        if (region.name.toLowerCase() === decodeURIComponent(key.toLowerCase())) {
            state = true
            result = result.concat(`/${region.name}`)
        }

        if (region.inverseParent.length > 0 && !state) {
            let r = getRegionPath(region.inverseParent, result.concat(`/${region.name}`), key)
            //找到了则将查询的结果返回,没有则抛弃
            if (state) {
                return r
            }
        }
    }
    return result
}

//跳转某个分区方法
instance?.proxy.$bus.on("jumpRegion", jumpRegion)
function jumpRegion(region: string) {
    state = false
    let regionPath = getRegionPath(regions.value, "", region)
    router.push(`/index${regionPath}`)
}

onBeforeUnmount(() => {
    instance?.proxy?.$bus.all.delete("jumpRegion")
    instance?.proxy?.$bus.all.delete("openSubMenu")
})
</script>

<style scoped>
.menu {
    overflow-y: hidden;
    overflow-x: scroll;
    position: sticky;
    border-bottom: none;
    background: none;
    max-width: 100%;
    justify-content: center;
    height: 40px;
    top: 0;
    border-bottom: 1px solid rgba(211, 211, 211, 0.626);
    background-image: radial-gradient(transparent 1px, #ffff 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
    z-index: 10;
}

.menu::-webkit-scrollbar {
    display: none;
}
</style>
