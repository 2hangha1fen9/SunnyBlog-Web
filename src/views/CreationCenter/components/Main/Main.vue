<template>
    <el-container direction="vertical" class="editor-container">
        <!-- 头部 -->
        <nav class="nav">
            <!-- 侧边栏按钮 -->
            <Hamburger :is-active="sidebar.opened" @toggleClick="toggleSideBar" />
            <div class="nav-item title-item">
                <input type="text" class="title-input" placeholder="请输入文章标题" v-model="article.title" />
                <el-button round type="success" class="title-submit" :loading="setBtnLoading" @click="saveArticle">保存</el-button>
            </div>
            <el-divider direction="vertical" />
            <div class="nav-item">
                <!-- 头像 -->
                <el-popover>
                    <template #reference>
                        <Avatar :photo="photo" :username="username" :showUsername="false"></Avatar>
                    </template>
                    <template #default>
                        <el-menu class="dropdown-menu" active-text-color="#303133">
                            <el-menu-item index="0"><a href="/" target="blank" style="text-decoration: none; height: 100%; width: 100%; color: black">首页</a></el-menu-item>
                            <el-menu-item index="1"><a :href="`/user/${userId}`" target="_blank" style="text-decoration: none; height: 100%; width: 100%; color: black">个人主页</a></el-menu-item>
                            <el-menu-item index="2"><a :href="`/setting`" target="_blank" style="text-decoration: none; height: 100%; width: 100%; color: black">用户设置</a></el-menu-item>
                            <el-menu-item index="3" @click="artDialogVisible = true">文章管理</el-menu-item>
                            <el-menu-item index="4" @click="tagDialogVisible = true">标签管理</el-menu-item>
                            <el-menu-item index="5" @click="restoreDialogVisible = true">回收站</el-menu-item>
                        </el-menu>
                    </template>
                </el-popover>
            </div>
        </nav>
        <div class="main">
            <!-- markdown编辑器 -->
            <div id="vditor"></div>
            <!-- 文章管理对话框 -->
            <el-dialog align-center fullscreen width="60%" v-model="artDialogVisible" v-if="artDialogVisible" title="文章管理">
                <ArticleManager @closeDialog="artDialogVisible = false" />
            </el-dialog>
            <!-- 文章保存对话框 -->
            <el-dialog align-center @close="setBtnLoading = false" v-model="setDialogVisible" v-if="setDialogVisible" title="发布文章">
                <ArticleSettingPanel :article="article" :isEdit="isEdit" @closeDialog="setDialogVisible = setBtnLoading = false"></ArticleSettingPanel>
            </el-dialog>
            <!-- 回收站 -->
            <el-dialog align-center @close="restoreDialogVisible = false" v-model="restoreDialogVisible" v-if="restoreDialogVisible" title="回收站">
                <ArticleRecycleBin />
            </el-dialog>
            <!-- 标签管理对话框 -->
            <el-dialog width="70%" align-center v-model="tagDialogVisible" v-if="tagDialogVisible" title="标签管理">
                <TagManager />
            </el-dialog>
        </div>
    </el-container>
</template>

<script setup lang="ts">
import Vditor from "vditor"
import "vditor/dist/index.css"
import { ref, onMounted, computed, watch, nextTick, getCurrentInstance, onUnmounted } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import ArticleSettingPanel from "../Dialog/ArticleSettingPanel.vue"
import ArticleRecycleBin from "../Dialog/ArticleRecycleBin.vue"
import ArticleManager from "../Dialog/ArticleManager.vue"
import Hamburger from "../SideBar/Hamburger.vue"
import Avatar from "@/components/Avatar.vue"
import TagManager from "../Dialog/TagManager.vue"
//接口
import { Article } from "@/interface/article/article"
import { Response } from "@/interface/common/response"
// api
import { uploadPicture } from "@/api/article/drawing-bed"
import { updateArticle, getArticle } from "@/api/article/article"
import { getImgUrl } from "@/utils/converter"

const router = useRouter()
const route = useRoute()
const store = useStore() //使用vuex

//汉堡按钮状态
const sidebar = computed(() => store.getters["sidebar/sidebar"])
// 头像数据
const userId = computed(() => store.getters["identity/userId"])
const username = computed(() => store.getters["identity/username"])
const photo = computed(() => store.getters["identity/photo"])

//文章设置对话框状态
const articleId = ref(parseInt(route.query["articleId"]))
const isEdit = ref(Boolean(route.query["isEdit"]))
const setBtnLoading = ref(false)
const setDialogVisible = ref(false) //对话框显示状态
const article = ref<Article>({})
//回收站对话框状态
const restoreDialogVisible = ref(false)
//添加标签对话框
const tagDialogVisible = ref(false)
//文章管理对话框
const artDialogVisible = ref(false)
//markdown编辑器
const vditor = ref<Vditor | null>(null)
//自动保存定时器 间隔5分钟
let autoSaveTimer = null

//侧边栏切换
function toggleSideBar() {
    store.dispatch("sidebar/toggleSideBar")
}

//初始化文章数据
function initArticle() {
    getArticle(articleId.value).then((data: Response<Article>) => {
        article.value = data.result
        vditor.value?.setTheme("classic", data.result.contentStyle, data.result.codeStyle)
        vditor.value?.setValue(data.result.content || "")

        //将分类数据,标签数据转换为ID数组
        let tagIds = []
        article.value.tags.forEach((item) => {
            tagIds.unshift(item.id)
        })
        article.value.tags = tagIds
    })
}
//初始化编辑器
function initEditor() {
    vditor.value?.destroy()
    //markdown编辑器配置
    vditor.value = new Vditor("vditor", {
        height: "91vh",
        typewriterMode: true, //打字机模式
        cache: {
            enable: false, //关闭localStorage缓存
        },
        fullscreen: {
            index: 9999, //全屏层级
        },
        preview: {
            markdown: {
                toc: true,
                mark: true,
            },
        },
        outline: {
            position: "right",
        },
        counter: {
            enable: true,
            type: "text",
        },
        toolbar: ["emoji", "headings", "bold", "italic", "strike", "line", "|", "outdent", "indent", "|", "quote", "list", "ordered-list", "check", "table", "|", "code", "inline-code", "|", "insert-after", "insert-before", "|", "undo", "redo", "|", "upload", "link", "|", "code-theme", "content-theme", "export", "|", "edit-mode", "preview", "outline", "fullscreen"],
        upload: {
            //自定义上传逻辑
            accept: "image/*",
            handler(files) {
                let formData = new FormData()
                formData.append("data", files[0])
                uploadPicture(formData).then((data: Response<string>) => {
                    if (data.status === 200) {
                        let imgUrl = getImgUrl("article-service", data.result.path, false)
                        let linkUrl = `![${"img"}](${imgUrl})`
                        vditor.value?.insertValue(linkUrl)
                    } else {
                        ElMessage.warning("图片上传失败")
                    }
                })
            },
        },
        after() {
            nextTick(() => {
                isEdit.value && initArticle()
            })
        },
    })

    //自动保存定时器
    clearInterval(autoSaveTimer)
    autoSaveTimer = setInterval(() => {
        staticSaveArticle(true)
    }, 1000 * 60 * 5)
}

//获取文章摘要
function getSummary() {
    let temp = document.createElement("div")
    temp.innerHTML = vditor.value?.getHTML()
    let summary = ""
    for (let e of temp.children) {
        if (e.tagName === "P") {
            summary += e.innerText
        }
    }
    article.value.summary = summary.substring(0, 200)
}

//保存文章
function saveArticle() {
    setBtnLoading.value = true
    article.value.content = vditor.value?.getValue()
    article.value.contentStyle = vditor.value?.vditor.options.preview?.theme?.current
    article.value.codeStyle = vditor.value?.vditor.options.preview?.hljs?.style
    getSummary()
    setDialogVisible.value = true
}
//静默保存文章
function staticSaveArticle(auto = false) {
    if (isEdit.value) {
        setBtnLoading.value = true
        article.value.content = vditor.value?.getValue()
        article.value.contentStyle = vditor.value?.vditor.options.preview?.theme?.current
        article.value.codeStyle = vditor.value?.vditor.options.preview?.hljs?.style
        getSummary()
        updateArticle(article.value)
            .then((data: Response<string>) => {
                if (data.status === 200) {
                    ElMessage.success("保存成功")
                    //更新目录节点
                    instance?.proxy?.$bus.emit("updateArticleNode", article.value)
                } else {
                    ElMessage.warning(data.message)
                }
            })
            .finally(() => {
                setBtnLoading.value = false
            })
    } else {
        !auto && saveArticle()
    }
}

//拖拽文章同步修改目录
const instance = getCurrentInstance()
instance?.proxy?.$bus.on("updateCategory", updateCategory)
function updateCategory(cid: number) {
    if (isEdit.value) {
        article.value.categoryId = cid
    }
}
//目录上修改名称同步修改模型
instance?.proxy?.$bus.on("updateArticleName", updateArticleName)
function updateArticleName({ aid, name }) {
    if (aid == article.value.id) {
        article.value.title = name
    }
}
//重置文章数据模型
instance?.proxy?.$bus.on("resetArticle", resetArticle)
function resetArticle(aid: number) {
    if (aid == article.value.id) {
        article.value = {}
        article.value.status = 4
        article.value.commentStatus = 1
        article.value.isLock = 1
        isEdit.value = null
        router.replace({
            query: null,
        })
        initEditor()
    }
}

onMounted(() => {
    initEditor()
    //监视路由query参数
    watch(route, (newVal) => {
        if (newVal.query["articleId"]) {
            articleId.value = parseInt(route.query["articleId"])
            if (newVal.query["isEdit"]) {
                isEdit.value = Boolean(route.query["isEdit"])
            }
            initEditor()
        }
    })
    //ctrl+s保存
    addEventListener("keydown", function (e) {
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
            e.preventDefault()
            staticSaveArticle()
        }
    })
    //响应式配置
    addEventListener("resize", collspaseAdide)
})

collspaseAdide()
function collspaseAdide() {
    if (document.documentElement.clientWidth <= 1000) {
        store.dispatch("sidebar/setStatus", true)
    } else {
        store.dispatch("sidebar/setStatus", false)
    }
}

onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("updateCategory")
    instance?.proxy?.$bus.all.delete("resetArticle")
    instance?.proxy?.$bus.all.delete("updateArticleName")
    removeEventListener("resize", collspaseAdide)
    clearInterval(autoSaveTimer)
})
</script>

<style>
/* 标题栏 */
.nav {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    height: var(--el-menu-item-height);
    overflow: hidden;
    background: #fff;
}
.title-input {
    outline: none;
    border: none;
    width: 100%;
    font-size: 24px;
    font-weight: 500;
    color: #1d2129;
    padding-left: 10px;
}
.nav-item {
    height: var(--el-menu-item-height);
    display: flex;
    align-items: center;
    margin: 5px;
}
.title-item {
    width: 100%;
}
.article-title {
    width: 100%;
}

/* 内容编辑栏 */
.editor-container {
    position: relative;
    min-height: 100%;
    background-color: rgb(246, 248, 249);
}
.main {
    width: 100%;
    position: relative;
    overflow: hidden;
}
#vditor {
    border: none;
}
.vditor-toolbar {
    background-color: #fff !important;
}

.dropdown-menu {
    border: none;
}
.el-menu-item {
    height: 40px;
    line-height: 40px;
}
</style>
