<template>
    <div class="tag-aside">
        <TagCard :tags="tags" title="标签" @jumpTag="jumpTag" />
    </div>
</template>

<script setup lang="ts">
import TagCard from "@/components/TagCard.vue"
import { ref } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { ElMessage } from "element-plus"
//接口
import { Response } from "@/interface/common/response"
import { Tag } from "@/interface/article/tag"
//api
import { listPublicTag } from "@/api/article/tag"

const router = useRouter()
const tags = ref<Array<Tag>>([])

//获取标签
function getTag() {
    //获取公共标签
    listPublicTag([
        {
            key: "ArticleCount",
            sort: -1,
        },
    ]).then((data: Response<Array<Tag>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        tags.value = data.result
    })
}

function jumpTag(tagName: string) {
    router.replace(`/index?tag=${tagName}`)
}

getTag()
</script>

<style scoped>
/* 标签卡片 */
.tag-aside {
    box-shadow: 0px 0px 14px rgb(0 0 0 / 7%);
    margin-bottom: 20px;
}
.tag-aside >>> .tag-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
}
</style>
