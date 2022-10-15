<template>
    <div style="margin-bottom: 500px">
        <el-input class="follow-search" placeholder="搜索用户" size="small" v-model="searchKeyword" @keyup.enter="getWathList(true)" clearable></el-input>
        <el-empty v-if="watchs?.totalCount <= 0" />
        <ul class="follow-list" style="padding-inline-start: 0px" v-else>
            <UserItem v-for="item in watchs.page" :key="`${item.id}`" :user="item" />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue"
import { debounce } from "lodash" //引入防抖节流
import UserItem from "@/components/UserItem.vue"
import { Watch } from "@/interface/user/watch"
import { Response } from "@/interface/common/response"
import { watchList } from "@/api/user/watch"
import { ElMessage } from "element-plus"

const watchs = reactive<PageBean<Array<Watch>>>({
    page: [],
    pageIndex: 1,
})
const props = defineProps<{
    uid: number
    fans: boolean
}>()
//搜索关键字
const searchKeyword = ref("")

//获取关注消息
function getWathList(needFlush = false) {
    watchList(props.uid, props.fans, needFlush ? 1 : watchs.pageIndex, 10, [
        {
            key: "username",
            value: searchKeyword.value,
        },
    ]).then((data: Response<Array<Watch>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        //判断是否要从头刷新，还是追加
        if (watchs.pageIndex !== 1 && !needFlush) {
            watchs.page.push(...data.result.page)
        } else {
            watchs.page = data.result.page
        }
        watchs.pageSize = data.result.pageSize
        watchs.totalPages = data.result.totalPages
        watchs.totalCount = data.result.totalCount
    })
}

getWathList(true)
//判断是否到滚动条底部
const moreFollow = debounce(function () {
    if (watchs.pageIndex < watchs.totalPages) {
        watchs.pageIndex++
        getWathList()
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
        moreFollow()
    }
}, 100)

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})
onBeforeUnmount(() => {
    window.removeEventListener("scroll", watchScroll)
})
</script>
