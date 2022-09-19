<template>
    <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in" appear>
            <component :key="key" :is="Component" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const key = computed(() => route.path)
</script>

<style></style>
