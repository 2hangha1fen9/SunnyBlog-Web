<template>
    <div class="order-bar">
        <div>
            <el-link @click="router.push({ query: null })" :type="defaultActive">最新</el-link>
            <el-divider direction="vertical" />
            <el-link @click="router.push({ query: { hot: true } })" :type="hotActive">热门</el-link>
        </div>
    </div>
    <ArticleList :items="state" :loading="loading" :isIndependent="true" />
</template>

<script setup lang="ts">
import { debounce } from "lodash" //引入防抖节流
import { useRoute, useRouter } from "vue-router"
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue"
import ArticleList from "@/components/ArticleList/ArticleList.vue"
import { ElMessage } from "element-plus"
//api
import { listArticle } from "@/api/article/article"
import { getArticleMetaList } from "@/api/comment/meta"
//接口
import { Article, Meta } from "@/interface/article/article"
import { SearchCondidtion } from "@/interface/common/search-condition"
import { Response, PageBean } from "@/interface/common/response"

const route = useRoute()
const router = useRouter()
const props = defineProps<{
    keyword: string
}>()
const keyword = ref(props.keyword)
const loading = ref(false)
const state = reactive<PageBean<Array<Article>>>({
    page: [],
    pageIndex: 1,
})
//搜索关键字
const condidtion = ref<Array<SearchCondidtion>>([])
const hotActive = computed(() => {
    return route.query["hot"] == "true" ? "primary" : "default"
})
const defaultActive = computed(() => {
    return route.query["hot"] == "true" ? "default" : "primary"
})

//监视路由query参数
watch(route, (newVal) => {
    keyword.value = newVal.params["keyword"]
    getArticleLit(true)
})

//获取数据
function getArticleLit(needFlush = false) {
    loading.value = true

    let tempCon: SearchCondidtion = [
        {
            key: "article",
            value: keyword.value,
        },
    ]

    //判断是否按点赞量排序
    let hot = route.query["hot"] === "true"
    if (hot) {
        tempCon.push({
            key: "hot",
            sort: -1,
        })
    }

    listArticle(needFlush ? 1 : state.pageIndex, 10, tempCon)
        .then((data: Response<PageBean<Array<Article>>>) => {
            if (data.status !== 200) {
                ElMessage.warning("数据拉取失败")
            }
            //判断是否要从头刷新，还是追加
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

getArticleLit(true)
const moreArticle = debounce(function () {
    if (state.pageIndex < state.totalPages) {
        state.pageIndex++
        getArticleLit()
    }
}, 100)

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
}, 100)

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", watchScroll)
})
</script>

<style scoped>
.order-bar {
    margin: 10px;
    display: flex;
    justify-content: space-between;
}
</style>
