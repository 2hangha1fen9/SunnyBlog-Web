<template>
    <div id="content" ref="content" class="reactive-main"></div>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, onBeforeUnmount, ref, watch } from "vue"
import { Article } from "@/interface/article/article"
import Vditor from "vditor"
import { useStore } from "vuex"
import { useDark } from "@vueuse/core"
import "vditor/dist/index.css"

//判断是否是黑暗模式
const isDark = useDark()
const store = useStore()
const article = ref<Article>()
const content = ref()

//渲染文章
const instance = getCurrentInstance()
instance?.proxy?.$bus.on("renderArticle", renderArticle)

function renderArticle(data: Article) {
    nextTick(() => {
        article.value = data
        Vditor.preview(content.value, article.value.content || "", {
            markdown: {
                toc: true,
                mark: true,
            },
            theme: {
                current: isDark.value ? "dark" : article.value.contentStyle,
            },
            hljs: {
                lineNumber: true,
                style: isDark.value ? "native" : article.value.codeStyle,
            },
        }).then(() => {
            instance?.proxy?.$bus.emit("renderCatalogue", content.value)
        })
    })
}

//切换黑暗模式事件
instance?.proxy?.$bus.on("switchStyle", switchStyle)
function switchStyle(status: boolean) {
    Vditor.setContentTheme(status ? "dark" : article.value.contentStyle, "https://unpkg.com/vditor@3.8.17/dist/css/content-theme/")
    Vditor.setCodeTheme(status ? "native" : article.value.codeStyle)
}

onBeforeUnmount(() => {
    instance?.proxy?.$bus.all.delete("renderArticle")
    instance?.proxy?.$bus.all.delete("contentSwitchStyle")
})
</script>
