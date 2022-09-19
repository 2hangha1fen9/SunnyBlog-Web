<template>
    <div>
        <ArticleList :items="state" />
        <el-empty v-if="state.totalCount <= 0">
            <el-link type="primary" href="/">返回</el-link>
        </el-empty>
        <!-- 骨架屏 -->
        <el-skeleton v-for="item in 10" :key="item" class="main-content" :rows="4" animated :loading="loading" :throttle="500">
            <template #template>
                <div class="article-skeleton">
                    <div class="article-main" style="width: 100%">
                        <div class="article-meta">
                            <el-skeleton-item style="width: 50px; height: 20px; margin-right: 10px" />
                            <el-skeleton-item style="width: 50px; height: 20px; margin-right: 10px" />
                            <el-skeleton-item style="width: 50px; height: 20px; margin-right: 10px" />
                        </div>
                        <div class="article-intro">
                            <el-skeleton-item variant="h3" />
                            <el-skeleton-item variant="p" />
                        </div>
                        <div class="article-count" style="display: flex">
                            <el-skeleton-item style="display: inline; width: 50px; margin: 5px" />
                            <el-skeleton-item style="display: inline; width: 50px; margin: 5px" />
                            <el-skeleton-item style="display: inline; width: 50px; margin: 5px" />
                            <el-skeleton-item style="display: inline; width: 50px; margin: 5px" />
                        </div>
                    </div>
                    <el-skeleton-item class="article-photo" variant="image" />
                </div>
            </template>
        </el-skeleton>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from "vue"
import { useRoute, user } from "vue-router"
import { ElMessage } from "element-plus"
import { debounce } from "lodash" //引入防抖节流
import ArticleList from "@/components/ArticleList/ArticleList.vue"
import { SearchCondidtion } from "@/interface/common/search-condition"
//api
import { listArticle } from "@/api/article/article"
import { getArticleMetaList } from "@/api/comment/meta"
//接口
import { Article, Meta } from "@/interface/article/article"
import { Response, PageBean } from "@/interface/common/response"

const route = useRoute()
const loading = ref(false)
const state = reactive<PageBean<Array<Article>>>({
    page: [],
    pageIndex: 1,
}) //表格数据

//监视路由query参数
let condidtion: Array<SearchCondidtion> = null
watch(route, () => {
    let region = route.query["region"]
    let tag = route.query["tag"]
    if (region || tag) {
        let cons: Array<SearchCondidtion> = []
        if (region) {
            cons.push({
                key: "region",
                value: region,
            })
        }
        if (tag) {
            cons.push({
                key: "tag",
                value: tag,
            })
        }
        condidtion = cons
    } else {
        condidtion = null
    }
    getArticleLit()
})

function getArticleLit() {
    loading.value = true
    listArticle(state.pageIndex, state.pageSize, condidtion).then((data: Response<PageBean<Array<Article>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        //填充文章元数据
        getArticleMetaList(data.result.page.map((m) => m.id)).then((d: Response<Array<Meta>>) => {
            d.result.forEach((meta: Meta) => {
                data.result.page.forEach((item: Article) => {
                    if (item.id === meta.articleId) {
                        item.meta = meta
                    }
                })
            })

            //将结果保存
            if (state.pageIndex !== 1) {
                state.page.push(...data.result.page)
            } else {
                state.page = data.result.page
            }
            state.pageSize = data.result.pageSize
            state.totalPages = data.result.totalPages
            state.totalCount = data.result.totalCount
        })
        loading.value = false
    })
}
const moreArticle = debounce(function moreArticle() {
    if (state.pageIndex < state.totalPages) {
        state.pageIndex++
        console.log(state.pageIndex)
        getArticleLit()
    }
}, 1000)

//监视滚动条,滚动到底部加载数据
function watchScroll() {
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    //变量windowHeight是可视区的高度
    var windowHeight = document.documentElement.clientHeight || document.body.clientHeight
    //变量scrollHeight是滚动条的总高度
    var scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight
    //滚动条到底部的条件
    if (Math.ceil(scrollTop + windowHeight) > scrollHeight) {
        //到了这个就可以进行业务逻辑加载后台数据了
        moreArticle()
    }
}

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})

getArticleLit()
</script>

<style></style>
