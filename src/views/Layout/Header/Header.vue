<template>
    <header :class="{ 'header-container': true, 'header-up': !visible }">
        <div class="left-container">
            <svg-icon icon-class="sunny" id="logo" />
            <h3>SunnyBlog</h3>
            <el-menu class="links" mode="horizontal" router :ellipsis="true">
                <el-menu-item index="/index" style="background: none">首页</el-menu-item>
                <el-menu-item index="/rank" style="background: none">排行榜</el-menu-item>
                <el-menu-item index="/rank" style="background: none">开源</el-menu-item>
            </el-menu>
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
import { computed, onMounted, ref } from "vue"
import { useStore } from "vuex"
import { useRouter, useRoute } from "vue-router"
import SearchBar from "./SearchBar.vue"

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

//监视滚动条,顶部header离开可视区域隐藏
const visible = ref(true)
function watchScroll() {
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 60) {
        visible.value = false
    } else {
        visible.value = true
    }
}

onMounted(() => {
    window.addEventListener("scroll", watchScroll)
})
</script>

<style>
#logo {
    height: auto;
    width: 35px;
    margin: 10px;
}
.header-container {
    transition: all 0.5s;
    position: sticky;
    top: 0;
    border-bottom: 1px solid rgba(211, 211, 211, 0.626);
    background-image: radial-gradient(transparent 1px, #ffff 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);
    -webkit-backdrop-filter: saturate(50%) blur(4px);
    min-height: 60px;
    display: flex;
    flex-wrap: wrap;
    overflow: hidden;
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
    padding-left: 5%;
    padding-right: 5%;
}
.left-container {
    flex-grow: 1;
}

.avatar-container {
    width: 50px;
}

.right-container >>> .el-input__wrapper {
    border-radius: 50px;
}

.header-up {
    position: fixed;
    width: 100%;
    opacity: 1;
    transform: translateY(-120px);
}

.links {
    border-bottom: none;
    background: none;
    height: 100%;
    width: 100%;
}
</style>
