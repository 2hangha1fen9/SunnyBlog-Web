<template>
    <div class="comment-editor">
        <CommentEditor :aid="aid" />
    </div>
    <el-card class="comment-card" id="comment">
        <template #header>
            <span>评论</span>
        </template>
        <el-empty v-if="state?.totalCount <= 0" />
        <CommentList v-else :comments="state?.page" />
        <el-pagination class="pageination" @current-change="scrollTop" v-if="state.totalCount > 0" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
    </el-card>
</template>

<script setup lang="ts">
import { reactive, onMounted, watch, getCurrentInstance, onUnmounted } from "vue"
import { ElMessage } from "element-plus"
import CommentList from "./CommentList.vue"
import CommentEditor from "./CommentEditor.vue"
import { Comment } from "@/interface/comment/comment"
import { Response, PageBean } from "@/interface/common/response"
import { getArticleComment } from "@/api/comment/comment"

const instance = getCurrentInstance()
const state = reactive<PageBean<Array<Comment>>>({})
const props = defineProps<{
    aid: string
}>()

function listComment(isFirst = false) {
    getArticleComment(props.aid, isFirst ? 1 : state?.pageIndex, state?.pageSize, null).then((data: Response<PageBean<Array<Comment>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        state.page = data.result.page
        state.pageSize = data.result.pageSize
        state.totalPages = data.result.totalPages
        state.totalCount = data.result.totalCount
    })
}

function scrollTop() {
    window.scrollTo({ top: document.getElementById("comment")?.offsetTop + 300, behavior: "smooth" }) //滚动到页面顶部
}

listComment()
instance?.proxy?.$bus.on("listComment", listComment)

onMounted(() => {
    //监听页码页面尺寸
    watch([() => state.pageIndex, () => state.pageSize], () => {
        listComment()
    })
})
onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("listComment")
})
</script>
