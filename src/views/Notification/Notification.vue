<template>
    <div class="notify-container">
        <NotifyMenu />
    </div>
</template>

<script setup lang="ts">
import NotifyMenu from "./components/NotifyMenu.vue"
</script>

<style scoped>
.notify-container {
    width: 700px;
    max-width: 100%;
    padding: 20px;
    margin: 20px auto auto;
    box-shadow: 0px 0px 13.1px rgba(0, 0, 0, 0.024), 0px 0px 44px rgba(0, 0, 0, 0.036), 0px 0px 197px rgba(0, 0, 0, 0.06);
}
</style>
