<template>
    <el-card class="rank-container">
        <template #header>
            <span>用户排行榜</span>
        </template>
        <ul class="rank-list" style="padding-inline-start: 0px">
            <UserItem v-for="item in ranks" :key="`${item?.id}`" :user="item" />
        </ul>
    </el-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import UserItem from "@/components/UserItem.vue"
import { User } from "@/interface/user/user"
import { Response, PageBean } from "@/interface/common/response"
import { listUser } from "@/api/user/user"
import { ElMessage } from "element-plus"

const ranks = ref<Array<User>>()

listUser(1, 10, [
    {
        key: "fans",
        sort: -1,
    },
]).then((data: Response<PageBean<Array<User>>>) => {
    if (data.status === 200) {
        ranks.value = data.result.page
    } else {
        ElMessage.warning("数据拉取失败")
    }
})
</script>

<style scoped>
.rank-container {
    margin-bottom: 20px;
}
/* 关注/粉丝页 */
.rank-list >>> .user-item {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.rank-list >>> .user-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
}

.rank-list >>> .user-avatar .el-avatar {
    width: 50px;
    height: 50px;
    margin-right: 10px;
}
</style>
