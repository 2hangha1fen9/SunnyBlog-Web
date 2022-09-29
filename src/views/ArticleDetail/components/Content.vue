<template>
    <div id="content" ref="content"></div>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, onBeforeUnmount, ref } from "vue"
import { Article } from "@/interface/article/article"
import Vditor from "vditor"
import "vditor/dist/index.css"

const article = ref<Article>()
const content = ref()

//渲染文章
const instance = getCurrentInstance()
instance?.proxy?.$bus.on("renderArticle", renderArticle)
function renderArticle(data: Article) {
    nextTick(() => {
        article.value = data
        Vditor.preview(content.value, article.value.content, {
            markdown: {
                toc: true,
                mark: true,
            },
            theme: {
                current: article.value.contentStyle,
            },
            hljs: {
                lineNumber: true,
                style: article.value.codeStyle,
            }
        }).then(() => {
            instance?.proxy?.$bus.emit("renderCatalogue", content.value)
        })
    })
}

onBeforeUnmount(() => {
    instance?.proxy?.$bus.all.delete("renderArticle")
})
</script>
