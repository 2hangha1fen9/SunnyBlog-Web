<template>
    <el-avatar :src="photo" size="default" class="d" />
    <p class="d" v-if="showUsername">{{ username }}</p>
</template>

<script setup lang="ts">
defineProps({
    photo: {
        type: String,
        default: "",
    },
    username: {
        type: String,
        default: "小张",
    },
    showUsername: {
        type: Boolean,
        default: true,
    },
})

</script>

<style>
.d {
    margin: 5px;
}
</style>