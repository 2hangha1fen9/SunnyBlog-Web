<template>
    <div>
        <RegionMenu />
        <div class="index-container">
            <Article />
            <div :class="{ 'aside-container': true, 'reactive-aside': true, 'show-aside': show }">
                <Notice />
                <Tags />
                <UserRank />
                <Footer />
            </div>
        </div>
        <svg-icon class="float-menu" icon-class="detail" @click="showAside" />
        <el-backtop :right="50" :bottom="50" />
    </div>
</template>

<script setup lang="ts">
import RegionMenu from "./components/RegionMenu/RegionMenu.vue"
import Article from "./components/Article.vue"
import Tags from "./components/AsideTabs/Tags.vue"
import UserRank from "./components/AsideTabs/UserRank.vue"
import Notice from "./components/AsideTabs/Notice.vue"
import Footer from "./components/AsideTabs/Footer.vue"
import { ref } from "@vue/reactivity"

const show = ref(false)
function showAside() {
    show.value = !show.value
    console.log(show.value)
}
</script>

<style scoped>
.index-container {
    width: 1140px;
    max-width: 100%;
    margin: 0 auto;
    position: relative;
}
.aside-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 300px;
}
</style>
