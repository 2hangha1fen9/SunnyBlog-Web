<template>
    <section class="identity-container">
        <img id="bgBox" src="https://baotangguo.cn:8081/" />
        <router-view v-slot="{ Component }">
            <transition name="fade-transform" mode="out-in" appear>
                <component :key="key" :is="Component" />
            </transition>
        </router-view>
    </section>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

const route = useRoute()
const key = computed(() => route.path)
</script>

<style scoped>
.identity-container {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}
#bgBox {
    z-index: -1;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: opacity 1s, transform 0.25s, filter 0.25s;
}
</style>
