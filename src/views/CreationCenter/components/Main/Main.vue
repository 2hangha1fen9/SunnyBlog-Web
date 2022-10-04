<template>
    <el-container direction="vertical" class="main-container">
        <!-- 头部 -->
        <nav class="nav">
            <div class="nav-item title-item">
                <input type="text" class="title-input" placeholder="请输入文章标题" v-model="article.title" />
                <el-button type="success" class="title-submit" :loading="btnLoading" @click="saveArticle">保存</el-button>
            </div>
            <el-divider direction="vertical" />
            <div class="nav-item">
                <el-button round>内容管理</el-button>
            </div>
            <div class="nav-item">
                <!-- 头像 -->
                <Avatar :photo="photo" :username="username" :showUsername="false"></Avatar>
            </div>
        </nav>
        <div class="main">
            <!-- markdown编辑器 -->
            <div id="vditor"></div>
            <el-dialog @close="btnLoading = false" v-model="dialogVisible" v-if="dialogVisible" title="发布文章">
                <ArticleSettingPanel :article="article" :isEdit="false" @closeDialog="dialogVisible = false"></ArticleSettingPanel>
            </el-dialog>
        </div>
    </el-container>
</template>

<script setup lang="ts">
import Vditor from "vditor"
import "vditor/dist/index.css"
import { ref, onMounted, computed } from "vue"
import { useStore } from "vuex"
import { useRoute, useRouter } from "vue-router"
import { ElMessage } from "element-plus"
import ArticleSettingPanel from "./ArticleSettingPanel.vue"
import Avatar from "@/components/Avatar.vue"
//接口
import { Article } from "@/interface/article/article"
import { Response } from "@/interface/common/response"
// api
import { uploadPicture } from "@/api/article/drawing-bed"
import { updateArticle, getArticle } from "@/api/article/article"

const router = useRouter()
const route = useRoute()
const store = useStore() //使用vuex

// 头像数据
const username = computed(() => store.getters["identity/username"])
const photo = computed(() => store.getters["identity/photo"])

//从路由中获取文章id
const articleId: number = parseInt(route.query["articleId"])
const isEdit = Boolean(route.query["isEdit"])
const btnLoading = ref(false)
const dialogVisible = ref(false) //对话框显示状态
const article = ref<Article>({})

//初始化文章数据
function initArticle() {
    getArticle(articleId).then((data: Response<Article>) => {
        article.value = data.result
        vditor.value?.setTheme("classic", data.result.contentStyle, data.result.codeStyle)
        vditor.value?.setValue(data.result.content)

        //将分类数据,标签数据转换为ID数组
        let tagIds = []
        article.value.tags.forEach((item) => {
            tagIds.unshift(item.id)
        })
        article.value.tags = tagIds
        let categoryIds = []
        article.value.categorys.forEach((item) => {
            tagIds.unshift(item.id)
        })
        article.value.categorys = categoryIds
    })
}

function saveArticle() {
    btnLoading.value = true
    article.value.content = vditor.value?.getValue()
    article.value.contentStyle = vditor.value?.vditor.options.preview?.theme?.current
    article.value.codeStyle = vditor.value?.vditor.options.preview?.hljs?.style

    if (isEdit) {
        //编辑模式
        updateArticle(article.value).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success("保存成功")
                router.back()
            } else {
                ElMessage.error(data.message)
            }
            btnLoading.value = false
        })
    } else {
        dialogVisible.value = true
    }
}

//markdown编辑器
const vditor = ref<Vditor | null>(null)
onMounted(() => {
    if (isEdit) {
        initArticle()
    }
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
                        let imgUrl = `${process.env.VUE_APP_BASE_API}/article-service${data.result.path}`
                        let linkUrl = `![${"img"}](${imgUrl})`
                        vditor.value?.insertValue(linkUrl)
                    } else {
                        ElMessage.warning("图片上传失败")
                    }
                })
            },
        },
    })
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
    padding-left: 40px;
}
.nav-item {
    height: var(--el-menu-item-height);
    display: flex;
    align-items: center;
}
.title-item {
    width: 100%;
}
.article-title {
    width: 100%;
}

/* 内容编辑栏 */
.main-container {
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
</style>
