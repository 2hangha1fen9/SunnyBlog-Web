<template>
    <ArticleList :items="state" :loading="loading" :isIndependent="true" />
</template>

<script setup lang="ts">
import { debounce } from "lodash" //引入防抖节流
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue"
import ArticleList from "@/components/ArticleList/ArticleList.vue"
import { ElMessage } from "element-plus"
//api
import { listUserArticle, listUserLikeArticle } from "@/api/article/article"
import { getArticleMetaList } from "@/api/comment/meta"
//接口
import { Article, Meta } from "@/interface/article/article"
import { SearchCondidtion } from "@/interface/common/search-condition"
import { Response, PageBean } from "@/interface/common/response"

const props = defineProps<{
    uid: string
    isLikeOrCollection: string //是否为用户点赞/收藏的文章 1点赞n收藏
}>()
const loading = ref(false)
const state = reactive<PageBean<Array<Article>>>({
    page: [],
    pageIndex: 1,
}) //表格数据

function getArticleLit(needFlush = false) {
    loading.value = true
    let tempData = null

    getData(needFlush)
        .then((data: Response<PageBean<Array<Article>>>) => {
            if (data.status !== 200) {
                ElMessage.warning("数据拉取失败")
            }
            if (state.pageIndex !== 1 && !needFlush) {
                state.page.push(...data.result.page)
            } else {
                state.page = data.result.page
            }
            state.pageSize = data.result.pageSize
            state.totalPages = data.result.totalPages
            state.totalCount = data.result.totalCount
            loading.value = false
        })
        .then(() => {
            //填充文章元数据
            getArticleMetaList(state.page.map((m) => m.id)).then((d: Response<Array<Meta>>) => {
                d.result.forEach((meta: Meta) => {
                    state.page.forEach((item: Article) => {
                        if (item.id === meta.articleId) {
                            item.meta = meta
                        }
                    })
                })
            })
        })
}

//获取数据类型点赞/收藏
function getData(needFlush = false) {
    if (props.isLikeOrCollection) {
        return listUserLikeArticle(props.uid, props.isLikeOrCollection == 1, needFlush ? 1 : state.pageIndex, 10, null)
    } else {
        return listUserArticle(props.uid, needFlush ? 1 : state.pageIndex, 10, null)
    }
}

getArticleLit(true)
const moreArticle = debounce(function () {
    if (state.pageIndex < state.totalPages) {
        state.pageIndex++
        getArticleLit()
    }
}, 200)

//监视滚动条,滚动到底部加载数据
const watchScroll = debounce(function () {
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    //变量windowHeight是可视区的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    //滚动条到底部的条件
    if (Math.ceil(scrollTop + windowHeight) >= scrollHeight) {
        //到了这个就可以进行业务逻辑加载后台数据了
        moreArticle()
    }
}, 500)

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", watchScroll)
})
</script>

<style></style>
