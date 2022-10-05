<template>
    <div class="avatar">
        <el-avatar :src="photo" size="default" />
        <span class="d" v-if="showUsername">{{ username }}</span>
    </div>
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
.avatar {
    display: flex;
    align-items: center;
    flex-direction: column;
}
.d {
    margin: 5px;
}
</style>
