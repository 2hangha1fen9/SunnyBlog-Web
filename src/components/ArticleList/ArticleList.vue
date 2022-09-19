<template>
    <ul class="main-content" style="padding-inline-start: 0">
        <ArticleItem v-for="item in items.page" :data="item" :key="item.id" />
    </ul>
</template>

<script setup lang="ts">
import ArticleItem from "./ArticleItem.vue"
import { Article } from "@/interface/artcle/article"
import { PageBean } from "@/interface/common/response"
defineProps<{
    items: PageBean<Array<Article>>
}>()
</script>

<style>
/* 主内容容器 */
.main-content {
    max-width: 700px;
    overflow: auto;
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
.article.title,
.article-summay,
.article-count {
    margin: 10px 0px 10px 0px;
}

.article-meta > span {
    color: #86909c !important;
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
