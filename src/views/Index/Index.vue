<template>
    <div>
        <RegionMenu />
        <div class="index-container">
            <Article />
            <div class="aside-container">
                <Notice />
                <Tags />
                <UserRank />
                <Footer />
            </div>
        </div>
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
