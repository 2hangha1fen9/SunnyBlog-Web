<template>
    <div ref="preview" class="board-preview"></div>
</template>

<script setup lang="ts">
import Vditor from "vditor"
import "vditor/dist/index.css"
import { ElMessage } from "element-plus"
import { ref, onMounted, nextTick } from "vue"
import { Response } from "@/interface/common/response"
import { getConfig } from "@/api/article/siteconfig"

const preview = ref()

getConfig("footer").then((data: Response<string>) => {
    if (data.status === 200 && data.result.trim()) {
        nextTick(() => {
            Vditor.preview(preview.value, data.result || "", {
                markdown: {
                    toc: true,
                },
            })
        })
    }
})
</script>

<style scoped>
.board-card::-webkit-scrollbar {
    display: none;
}
</style>
