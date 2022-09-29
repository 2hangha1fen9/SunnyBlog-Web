<template>
    <div class="comment-list">
        <CommentItem v-for="item in comments" :key="`${item.id}`" :comment="item" />
    </div>
</template>

<script setup lang="ts">
import CommentItem from "./CommentItem.vue"

defineProps<{
    comments: Array<Comment>
}>()
</script>
