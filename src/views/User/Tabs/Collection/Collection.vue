<template>
    <Article :uid="uid" isLikeOrCollection="0" />
</template>

<script setup lang="ts">
import Article from "../Article/Article.vue"

defineProps<{
    uid: string
}>()
</script>
