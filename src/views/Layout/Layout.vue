<template>
    <main class="main-container">
        <Header/>
        <Main/>
    </main>
</template>

<script setup lang="ts">
import Header from "./Header/Header.vue"
import Main from './Main/Main.vue'
</script>

<style scoped>
.main-container {
    display: flex;
    flex-direction: column;
}
</style>