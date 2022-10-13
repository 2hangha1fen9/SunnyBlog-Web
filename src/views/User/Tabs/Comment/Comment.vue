<template>
    <el-empty v-if="state?.totalCount <= 0" />
    <ul v-else class="comment-list">
        <CommentItem v-for="item in state.page" :comment="item" :uid="uid"/>
    </ul>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from "vue"
import { Comment } from "@/interface/comment/comment"
import { Response, PageBean } from "@/interface/common/response"
import { getCommentList } from "@/api/comment/comment"
import { ElMessage } from "element-plus"
import CommentItem from "./CommentItem.vue"
import { debounce } from "lodash" //引入防抖节流

const props = defineProps<{
    uid: number
}>()
const state = reactive<PageBean<Array<Comment>>>({
    page: [],
    pageIndex: 1,
})

function getList(needFlush = false) {
    getCommentList(props.uid, needFlush ? 1 : state.pageIndex, 10, null).then((data: Response<PageBean<Array<Comment>>>) => {
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
    })
}
const moreArticle = debounce(function () {
    if (state.pageIndex < state.totalPages) {
        state.pageIndex++
        getList()
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

getList(true)

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", watchScroll)
})
</script>

<style scoped>
.comment-list {
    padding-inline-start: 0px;
}
</style>
