<template>
    <Follow :uid="uid" :fans="true" />
</template>

<script setup lang="ts">
import Follow from "../Follow/Follow.vue"

defineProps<{
    uid: string
}>()
</script>
