<template>
    <header class="header-container">
        <div class="left-container">
            <svg-icon icon-class="sunny" id="logo" />
            <h3>SunnyBlog</h3>
            <RegionMenu />
        </div>
        <div class="right-container">
            <SearchBar />
            <!-- 头像 -->
            <p class="avatar-container" v-if="isValid">
                <Avatar :photo="photo" :username="username" :showUsername="false"></Avatar>
            </p>
            <el-button round class="d" @click="toggleState">{{ isValid ? "登出" : "登录" }}</el-button>
        </div>
    </header>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue"
import { computed } from "vue"
import { useStore } from "vuex"
import { useRouter, useRoute } from "vue-router"
import SearchBar from "./SearchBar.vue"
import RegionMenu from "./RegionMenu/RegionMenu.vue"

const store = useStore()
const router = useRouter()
const route = useRoute()

const username = computed(() => store.getters["identity/username"])
const photo = computed(() => store.getters["identity/photo"])
const isValid = computed(() => store.getters["identity/isValid"])

//退出登录
function toggleState() {
    if (isValid.value) {
        //有登录状态显示退出登录
        store.dispatch("identity/logout")
    } else {
        //无状态,显示登录
        router.push(`/identity/login?redirect=${route.fullPath}`)
    }
}
</script>

<style scoped>
#logo {
    height: auto;
    width: 35px;
    margin: 10px;
}
.header-container {
    position: sticky;
    top: 0;
    border-bottom: 1px solid rgba(211, 211, 211, 0.626);
    background-image: radial-gradient(transparent 1px, #ffff 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
    height: 60px;
    display: flex;
    padding: 0px 5% 0px 5%;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
}
.left-container,
.right-container {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.avatar-container {
    width: 50px;
}

.right-container >>> .el-input__wrapper {
    border-radius: 50px;
}
</style>
