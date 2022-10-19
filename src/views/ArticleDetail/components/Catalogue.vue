<template>
    <div id="catalogue" ref="catalogue" :class="{ 'sticky-catalogue': isSticky, 'vditor-outline': true }"></div>
</template>

<script setup lang="ts">
import { getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref } from "vue"
import { debounce } from "lodash" //引入防抖节流
import Vditor from "vditor"
import "vditor/dist/index.css"

const isSticky = ref(false)
const catalogue = ref()
const catalogueInitTop = ref(0)
const instance = getCurrentInstance()
const headingElements = ref([])
const renderSuccess = ref(false) //防止获取目录位置信息被更改

instance?.proxy?.$bus.on("renderCatalogue", renderCatalogue)
//渲染目录
function renderCatalogue(data: HTMLElement) {
    nextTick(() => {
        Vditor.outlineRender(data, catalogue.value)
        if (catalogue.value.innerText.trim() !== "") {
            //显示目录
            catalogue.value.style.display = "block"
            //获取目录初始位置
            catalogueInitTop.value = catalogue.value.getBoundingClientRect().top
            //修正目录偏移量
            if (document.documentElement.scrollTop) {
                catalogueInitTop.value += document.documentElement.scrollTop + 80
            }
            getToc(data) //获取所有h标签

            renderSuccess.value = true
        }
    })
}
//获取所有标题
function getToc(element: HTMLElement) {
    Array.from(element.children).forEach((item) => {
        if (item.tagName.length === 2 && item.tagName !== "HR" && item.tagName.indexOf("H") === 0) {
            headingElements.value.push(item)
        }
    })
}

//监听滚动条固定目录
const watchCatalogueScroll = () => {
    if (renderSuccess.value && window.scrollY > catalogueInitTop.value - 80) {
        isSticky.value = true
    } else {
        isSticky.value = false
    }
}
//监听当前目录项
const watchCatalogueItemScroll = debounce(function () {
    const scrollTop = window.scrollY //获取
    const currentElement = document.querySelector(".vditor-outline__item--current") //获取当前激活项

    //获取所有标题距离顶部距离
    let toc = []
    headingElements.value.forEach((item) => {
        toc.push({
            id: item.id,
            offsetTop: item.offsetTop,
        })
    })
    for (let i = 0, iMax = toc.length; i < iMax; i++) {
        if (scrollTop < toc[i].offsetTop - 30) {
            //标题超出屏幕,激活下一个标题
            if (currentElement) {
                currentElement.classList.remove("vditor-outline__item--current")
            }
            let index = i > 0 ? i - 1 : 0
            document.querySelector('span[data-target-id="' + toc[index].id + '"]').classList.add("vditor-outline__item--current")
            break
        }
    }
    //让当前激活项显示在屏幕中
    if (catalogue.value.classList[1] && catalogue.value.clientHeight / 2 < currentElement?.offsetTop) {
        document.querySelector(".vditor-outline__item--current").scrollIntoView({ block: "center", behavior: "smooth", inline: "center" })
    }
}, 10)

onMounted(() => {
    window.addEventListener("scroll", watchCatalogueScroll)
    window.addEventListener("scroll", watchCatalogueItemScroll)
})

onBeforeUnmount(() => {
    window.removeEventListener("scroll", watchCatalogueScroll)
    window.removeEventListener("scroll", watchCatalogueItemScroll)
    instance?.proxy?.$bus.all.delete("renderCatalogue")
})
</script>
