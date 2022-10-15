<template>
    <el-card class="tag-card" shadow="never">
        <template #header>
            <span>{{ title }}</span>
        </template>
        <el-tooltip v-for="tag in tags" :key="tag.name" effect="dark" :content="` ${tag.articleCount || 0} 篇文章`" placement="top-start">
            <el-tag class="tag-item" :color="tag.color" effect="dark" @click="emits('jumpTag', tag.name)" :round="round">
                {{ tag.name }}
            </el-tag>
        </el-tooltip>
    </el-card>
</template>

<script setup lang="ts">
import { Tag } from "@/interface/article/tag"

const props = defineProps<{
    title: string
    tags: Array<Tag>
    round: boolean
}>()
const emits = defineEmits<{
    (event: "jumpTag", tagName: string): void
}>()
</script>
