<template>
    <div ref="preview" class="board-preview"></div>
</template>

<script setup lang="ts">
import Vditor from "vditor"
import "vditor/dist/index.css"
import { ElMessage } from "element-plus"
import { ref, onMounted, nextTick, getCurrentInstance, onUnmounted } from "vue"
import { useDark } from "@vueuse/core"
import { Response } from "@/interface/common/response"
import { getConfig } from "@/api/article/siteconfig"

//判断是否是黑暗模式
const isDark = useDark()
const preview = ref()
const instance = getCurrentInstance()

getConfig("notice").then((data: Response<string>) => {
    if (data.status === 200) {
        nextTick(() => {
            Vditor.preview(preview.value, data.result.trim() || "暂无公告", {
                markdown: {
                    toc: true,
                },
                theme: {
                    current: isDark.value ? "dark" : "light",
                },
                hljs: {
                    lineNumber: true,
                    style: isDark.value ? "native" : "github",
                },
            })
        })
    }
})

//切换黑暗模式事件
instance?.proxy?.$bus.on("switchStyle", switchStyle)
function switchStyle(status: boolean) {
    Vditor.setContentTheme(status ? "dark" : "light", "https://unpkg.com/vditor@3.8.17/dist/css/content-theme/")
}

onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("switchStyle")
})
</script>

<style scoped>
.board-preview {
    box-shadow: var(--el-box-shadow);
    padding: 10px;
    background: var(--el-bg-color);
    margin-bottom: 20px;
}
.board-card::-webkit-scrollbar {
    display: none;
}
</style>
