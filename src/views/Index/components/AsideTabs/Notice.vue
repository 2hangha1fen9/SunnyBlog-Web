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

getConfig("notice").then((data: Response<string>) => {
    if (data.status === 200) {
        nextTick(() => {
            Vditor.preview(preview.value, data.result.trim() || "暂无公告", {
                markdown: {
                    toc: true,
                },
            })
        })
    }
})
</script>

<style scoped>
.board-preview {
    box-shadow: 0px 0px 10px rgb(0 0 0 / 2%), 0px 5px 20px rgb(0 0 0 / 9%);
    padding: 10px;
    background: #ffff;
    margin-bottom: 20px;
}
.board-card::-webkit-scrollbar {
    display: none;
}
</style>
