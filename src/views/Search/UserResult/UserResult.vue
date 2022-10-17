<template>
    <div class="user-container">
        <el-empty v-if="users.totalCount <= 0" />
        <ul v-else style="padding-inline-start: 0px" class="user-list">
            <UserItem v-for="item in users.page" :key="`${item.id}`" :user="item" />
        </ul>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, reactive, ref, watch } from "vue"
import { debounce } from "lodash" //引入防抖节流
import { ElMessage } from "element-plus"
import UserItem from "@/components/UserItem.vue"
import { Watch } from "@/interface/user/watch"
import { Response } from "@/interface/common/response"
import { listUser } from "@/api/user/user"
import { useRoute } from "vue-router"

const route = useRoute()
//搜索关键字
const props = defineProps<{
    keyword: string
}>()
const keyword = ref(props.keyword)
//数据
const users = reactive<PageBean<Array<Watch>>>({
    page: [],
    pageIndex: 1,
})

//获取关注消息
function getUserList(needFlush = false) {
    listUser(needFlush ? 1 : users.pageIndex, 10, [
        {
            key: "user",
            value: keyword.value,
        },
    ]).then((data: Response<Array<Watch>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        //判断是否要从头刷新，还是追加
        if (users.pageIndex !== 1 && !needFlush) {
            users.page.push(...data.result.page)
        } else {
            users.page = data.result.page
        }
        users.pageSize = data.result.pageSize
        users.totalPages = data.result.totalPages
        users.totalCount = data.result.totalCount
    })
}

getUserList(true)
watch(route, (newVal) => {
    keyword.value = newVal.params["keyword"]
    getUserList(true)
})

//判断是否到滚动条底部
const moreUser = debounce(function () {
    if (users.pageIndex < users.totalPages) {
        users.pageIndex++
        getUserList()
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
        getUserList()
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
.user-container {
    width: 100%;
    min-height: 700px;
    padding: 20px;
    box-sizing: border-box;
}

.user-list >>> .user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
}

.user-list >>> .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.user-list >>> .user-avatar .el-avatar {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
</style>
