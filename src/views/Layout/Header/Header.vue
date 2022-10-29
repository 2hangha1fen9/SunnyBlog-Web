<template>
    <header :class="{ 'header-container': true, 'header-up': !visible }" id="header">
        <div class="left-container">
            <svg-icon icon-class="sunny" id="logo" @click="router.push('/')" />
            <h3 @click="router.push('/index')" style="cursor: pointer">SunnyBlog</h3>
            <SearchBar />
        </div>
        <div class="right-container">
            <!-- 头像 -->
            <el-switch v-model="isDark" class="dark-btn" :inactive-icon="Sunny" :active-icon="Moon" :inline-prompt="true" />
            <svg-icon v-if="isValid" class="notify-btn" icon-class="notify" @click="router.push('/notification')">消息</svg-icon>
            <p class="avatar-container" v-if="isValid">
                <el-popover>
                    <template #reference>
                        <Avatar :photo="photo" :username="username" :showUsername="false"></Avatar>
                    </template>
                    <template #default>
                        <el-menu class="dropdown-menu" active-text-color="var(--el-text-color-primary)">
                            <el-menu-item index="0"><a :href="`/user/${userId}`" style="text-decoration: none; height: 100%; width: 100%; color: var(--el-text-color-primary)">个人主页</a></el-menu-item>
                            <el-menu-item index="1" @click="router.push('/setting')">用户设置</el-menu-item>
                            <el-menu-item index="2" @click="toggleState">{{ isValid ? "登出" : "登录" }}</el-menu-item>
                        </el-menu>
                    </template>
                </el-popover>
            </p>
            <!-- 创作中心 -->
            <el-button type="primary" @click="jumpCreation" round>
                <svg-icon icon-class="creation" />
                创作中心
            </el-button>
            <el-button v-if="!isValid" round class="d" @click="toggleState">{{ isValid ? "登出" : "登录" }}</el-button>
        </div>
    </header>
</template>

<script setup lang="ts">
import Avatar from "@/components/Avatar.vue"
import { computed, getCurrentInstance, onMounted, ref, watch } from "vue"
import { useDark, useToggle } from "@vueuse/core"
import { Sunny, Moon } from "@element-plus/icons-vue"
import { useStore } from "vuex"
import { useRouter, useRoute } from "vue-router"
import SearchBar from "./SearchBar.vue"

const isDark = useDark()
const store = useStore()
const router = useRouter()
const route = useRoute()
const instance = getCurrentInstance()

const userId = computed(() => store.getters["identity/userId"])
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
//需要收起的组件
const scrollList = ref([/index/i, /article/i, /user/i])
function watchScroll() {
    //变量scrollTop是滚动条滚动时，距离顶部的距离
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    if (scrollTop > 60) {
        scrollList.value.forEach((r) => {
            if (r.test(decodeURIComponent(route.path))) {
                visible.value = false
            }
        })
    } else {
        visible.value = true
    }
}

//跳转创作中心
function jumpCreation() {
    let url = router.resolve({
        path: `/creation`,
    })
    window.open(url.href, "_blank")
}

//监听黑暗模式变化
watch(isDark, (newVal) => {
    instance?.proxy?.$bus.emit("switchStyle", newVal)
})

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
    border-bottom: 1px solid var(--el-border-color);
    background-image: radial-gradient(transparent 1px, var(--el-bg-color) 1px);
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
    padding: 5px;
}

.right-container >>> .el-input__wrapper {
    border-radius: 50px;
}

.header-up {
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

.notify-btn {
    padding: 5px;
    color: gray;
    cursor: pointer;
    white-space: nowrap;
}
.notify-btn:hover {
    color: skyblue;
}

.dropdown-menu {
    border: none;
}
.el-menu-item {
    height: 40px;
    line-height: 40px;
}

.dark-btn {
    margin: 10px;
    --el-switch-on-color: var(--el-mask-color-extra-light);
}
</style>
