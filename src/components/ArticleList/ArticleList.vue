<template>
    <div style="margin-bottom: 200px">
        <ul class="article-container" style="padding-inline-start: 0">
            <ArticleItem v-for="item in items.page" :data="item" :key="item.id" :isIndependent="isIndependent" @click="jumpArticle(item.id)" />
        </ul>
        <!-- 骨架屏 -->
        <el-skeleton v-for="item in 10" :key="item" class="article-container" :rows="4" animated v-show="loading" :loading="true" :throttle="500">
            <template #template>
                <div class="article-skeleton">
                    <div class="article-main" style="width: 100%">
                        <div class="article-meta">
                            <el-skeleton-item style="width: 50px; height: 20px; margin-right: 10px" />
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
        <el-empty v-if="items.totalCount <= 0">
        </el-empty>
    </div>
</template>

<script setup lang="ts">
import ArticleItem from "./ArticleItem.vue"
import { Article } from "@/interface/artcle/article"
import { PageBean } from "@/interface/common/response"
import { useRouter } from "vue-router"
import { watch, ref } from "vue"

const router = useRouter()
const isLoading = ref(false)
const props = defineProps<{
    items: PageBean<Array<Article>>
    loading: boolean
    isIndependent: boolean //文章列表是否有分区选项菜单
}>()

function jumpArticle(aid: number) {
    let url = router.resolve({
        path: `/article/${aid}`,
    })
    window.open(url.href, "_blank")
}

</script>

<style>
/* 主内容容器 */
.article-container {
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
}

/* 加载骨架屏 */
.article-skeleton {
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0px 10px 0px 10px;
    border-bottom: 0.5px solid lightgray;
}

/* 文章条目 */
.article-block {
    list-style: none;
    padding-inline-start: 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    padding: 0px 10px 0px 10px;
    border-bottom: 0.5px solid lightgray;
}
.article-block:hover {
    background: #fafafa;
}

/* 行间距 */
.article-meta,
.article-title,
.article-summay,
.article-count {
    margin: 10px 0px 10px 0px;
}

.article-meta > span {
    color: #86909c !important;
}

.article-title {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

/* 文章摘要 */
.article-summay {
    color: #86909c;
    font-size: 13px;
    line-height: 22px;
    display: -webkit-box;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
}

/* 点赞数据间距 */
.article-count-item {
    margin: 5px;
    color: #86909c;
}
.count-likes:hover,
.count-likes-active {
    color: pink;
}
.count-star:hover,
.count-star-active {
    color: orange;
}
.count-comment:hover {
    color: skyblue;
}

/* 文章封面 */
.article-photo {
    flex: 0 0 auto;
    width: 120px;
    height: 80px;
    margin-left: 24px;
    background-color: #fff;
    border-radius: 2px;
}
.tag {
    font-style: italic;
    margin-left: 5px;
}
</style>
