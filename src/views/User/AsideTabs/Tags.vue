<template>
    <TagCard :tags="tags" title="标签" :round="true" @jumpTag="jumpTag" />
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
import { listUserTag } from "@/api/article/tag"

const router = useRouter()
const props = defineProps<{
    uid: string
}>()
const tags = ref<Array<Tag>>([])

//获取标签
function getTag() {
    //获取公共标签
    listUserTag(props.uid).then((data: Response<Array<Tag>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        tags.value = data.result
    })
}

function jumpTag(tagName: string) {
    router.replace(`/user/${props.uid}/article?tag=${tagName}`)
}

getTag()
</script>
