<template>
    <div class="order-bar">
        <div>
            <el-link @click="dataType = true" :type="dataType ? 'primary' : ''">我的评论</el-link>
            <el-divider direction="vertical" />
            <el-link @click="dataType = false" :type="!dataType ? 'primary' : ''">我的回复</el-link>
        </div>
        <el-input class="comment-search" placeholder="搜索" size="small" v-model="searchKeyword" @keyup.enter="getList(true)" clearable>
            <template #prepend>
                <el-select v-model="searchType" style="width: 100px" default-first-option="title">
                    <el-option label="文章名" value="articleTitle" />
                    <el-option label="内容" value="content" />
                    <el-option label="昵称/用户名" value="nick" />
                </el-select>
            </template>
        </el-input>
        <el-radio-group v-model="orderByDesc" size="small">
            <el-radio-button :label="true">升序</el-radio-button>
            <el-radio-button :label="false">倒序</el-radio-button>
        </el-radio-group>
    </div>
    <el-empty v-if="state?.totalCount <= 0" />
    <ul v-if="dataType" class="comment-list">
        <CommentListItem v-for="item in state.page" :key="`${item.id}`" :comment="item" :showStatus="true" :showTitle="true" @delete="removeComment" />
    </ul>
    <ul v-if="!dataType" class="comment-list">
        <CommentListItem v-for="item in state.page" :key="`${item.id}`" :comment="item" :showStatus="true" :showTitle="true" :showUsername="true" @delete="removeComment" @allow="allowCommentStatus" @reply="replyComment" />
    </ul>
    <el-dialog align-center v-model="dialogVisible" v-if="dialogVisible" title="回复">
        <CommentReplyEditor :comment="currentComment" @closeDialog="dialogVisible = false" />
    </el-dialog>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import { ref, reactive, onMounted, onBeforeUnmount, watch } from "vue"
import { Comment } from "@/interface/comment/comment"
import { Response, PageBean } from "@/interface/common/response"
import { getCommentList, getToMyCommentList, authorDeleteComment, deleteComment, allowComment } from "@/api/comment/comment"
import { ElMessage } from "element-plus"
import CommentListItem from "@/components/CommentListItem.vue"
import CommentReplyEditor from "@/components/CommentReplyEditor.vue"
import { debounce } from "lodash" //引入防抖节流

const store = useStore()
const props = defineProps<{
    uid: number
}>()
const state = reactive<PageBean<Array<Comment>>>({
    page: [],
    pageIndex: 1,
    totalCount: 0,
})

//选中的评论
const currentComment = ref<Comment>()
//回复对话框状态
const dialogVisible = ref(false)
//展示的数据类型 true我发表的评论 false回复我的评论
const dataType = ref(true)
//搜索关键字
const searchKeyword = ref("")
const searchType = ref("articleTitle")
//排序关键字
const orderByDesc = ref(true)
//当前登录的用户id
const userId = store.getters["identity/userId"]

function getList(needFlush = false) {
    getData(needFlush).then((data: Response<PageBean<Array<Comment>>>) => {
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
//获取对应的数据类型
function getData(needFlush = false) {
    let con = [
        {
            key: searchType.value,
            value: searchKeyword.value,
        },
        {
            key: "createTime",
            sort: orderByDesc.value ? -1 : 1,
        },
    ]
    if (dataType.value) {
        return getCommentList(props.uid, needFlush ? 1 : state.pageIndex, 10, con)
    } else {
        return getToMyCommentList(needFlush ? 1 : state.pageIndex, 10, con)
    }
}

//删除评论数据
function deleteItem(cid: number) {
    state.page = state.page.filter((item: Comment) => item.id !== cid)
}
//删除评论
function removeComment(cid: number) {
    //判断是否是作者删除还是评论者删除
    if (dataType.value) {
        deleteComment(cid).then((data: Response<string>) => {
            if (data.status === 200) {
                deleteItem(cid)
            }
        })
    } else {
        authorDeleteComment(cid).then((data: Response<string>) => {
            if (data.status === 200) {
                deleteItem(cid)
            }
        })
    }
}
//审核评论
function allowCommentStatus(cid: number) {
    allowComment(cid).then((data: Response<string>) => {
        if (data.status === 200) {
            state.page.forEach((item: Comment) => {
                if (item.id == cid) {
                    item.status = 1
                }
            })
        }
    })
}
//回复评论
function replyComment(comment: Comment) {
    currentComment.value = comment
    dialogVisible.value = true
}

//监视数据类型切换相应数据
watch([dataType, orderByDesc], (newVal) => {
    dataType.value = newVal[0]
    orderByDesc.value = newVal[1]
    getList(true)
})

//监视滚动条,滚动到底部加载数据
const moreComment = debounce(function () {
    if (state.pageIndex < state.totalPages) {
        state.pageIndex++
        getList()
    }
}, 100)
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
        moreComment()
    }
}, 100)

getList(true)

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", watchScroll)
})
</script>
