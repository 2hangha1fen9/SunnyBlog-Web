<template>
    <el-card class="count-tab">
        <template #header>
            <span>文章总览</span>
        </template>
        <ul class="count-view">
            <li>
                <h4>文章总数</h4>
                <p>{{ state.articleCount || 0 }}</p>
            </li>
            <li>
                <h4>标签总数</h4>
                <p>{{ state.tagCount || 0 }}</p>
            </li>
            <li>
                <h4>展示文章</h4>
                <p>{{ state.showArticleCount || 0 }}</p>
            </li>
            <li>
                <h4>待审核文章</h4>
                <p>{{ state.penddingArticleCount || 0 }}</p>
            </li>
            <li>
                <h4>锁定文章</h4>
                <p>{{ state.lockArticleCount || 0 }}</p>
            </li>
            <li>
                <h4>回收站文章</h4>
                <p>{{ state.recycleArticleCount || 0 }}</p>
            </li>
            <li>
                <h4>今日发布</h4>
                <p>{{ state.todayPublish || 0 }}</p>
            </li>
            <li>
                <h4>昨日发布</h4>
                <p>{{ state.yesterdayPublish || 0 }}</p>
            </li>
            <li>
                <h4>本周发布</h4>
                <p>{{ state.weekPublish || 0 }}</p>
            </li>
            <li>
                <h4>本月发布</h4>
                <p>{{ state.monthPublish || 0 }}</p>
            </li>
        </ul>
    </el-card>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Response } from "@/interface/common/response"
import { ArticleCountStatistics } from "@/interface/article/statistics"
import { getArticleCount } from "@/api/article/statistics"

const state = ref<ArticleCountStatistics>({})

getArticleCount().then((data: Response<UserCountStatistics>) => {
    if (data.status === 200) {
        state.value = data.result
    }
})
</script>
