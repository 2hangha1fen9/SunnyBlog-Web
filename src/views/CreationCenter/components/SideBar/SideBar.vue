<template>
    <nav :class="{ 'side-container': true, 'side-collapse': sidebar.opened }" @contextmenu="showContextMenu">
        <el-scrollbar max-height="100%" style="width: inherit">
            <CategoryTree @getContextNode="setContextNode" @newCategorySuccess="newCategorySuccess" />
        </el-scrollbar>
        <!-- 添加目录对话框 -->
        <el-dialog v-model="cateDialogVisible" v-if="cateDialogVisible" title="新建目录">
            <el-form :model="categoryState" label-width="80px" ref="formRef" :rules="rules">
                <el-form-item label="名称" required prop="name">
                    <el-input v-model="categoryState.name" @keyup.enter="newCategory(formRef)" />
                </el-form-item>
                <el-form-item label="上级目录" prop="regionId">
                    <el-tree-select
                        v-model="categoryState.parentId"
                        :data="categorys"
                        node-key="id"
                        :props="{
                            label: 'name',
                            children: 'inverseParent',
                        }"
                        clearable
                        check-strictly
                        :render-after-expand="false"
                    />
                </el-form-item>
                <div class="submit">
                    <el-button type="primary" :loading="cateLoading" @click="newCategory(formRef)">保存</el-button>
                </div>
            </el-form>
        </el-dialog>
        <!-- 添加文章对话框 -->
        <el-dialog align-center v-model="ArtDialogVisible" v-if="ArtDialogVisible" title="发布文章">
            <ArticleSettingPanel :article="articleState" :isEdit="false" @closeDialog="ArtDialogVisible = false"></ArticleSettingPanel>
        </el-dialog>
    </nav>
</template>

<script setup lang="ts">
import { useStore } from "vuex"
import { computed } from "vue"
import { getCurrentInstance, ref, reactive } from "vue"
import CategoryTree from "./CategoryTree.vue"
import ArticleSettingPanel from "../Main/ArticleSettingPanel.vue"
import { ElMessage } from "element-plus"
//上下文菜单
import { menusEvent } from "vue3-menus"
import type { FormRules, FormInstance } from "element-plus"
import { Category } from "@/interface/article/category"
import { ElMessageBox } from "element-plus"
import { listCategory } from "@/api/article/category"
import { Article } from "@/interface/article/article"

//侧边栏状态
const store = useStore()
const sidebar = computed(() => store.getters["sidebar/sidebar"])

const instance = getCurrentInstance()
const currentNode = ref<Category>()
//添加目录模型
const categoryState = ref<Category>({})
const categorys = ref<Array<Category>>([])
const cateLoading = ref(false)
const cateDialogVisible = ref(false)
const formRef = ref<FormInstance>()
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            trigger: "blur",
            message: "目录名不能为空",
        },
    ],
})
//添加文章模型
const articleState = ref<Article>({})
const ArtDialogVisible = ref(false)

const newOption = {
    label: "新建",
    children: [
        {
            label: "目录",
            click: () => {
                cateDialogVisible.value = true
                listCategory().then((data: Response<Array<Category>>) => {
                    if (data.status === 200) {
                        categorys.value = data.result
                        //初始化默认父级目录
                        if (currentNode.value) {
                            if (!currentNode.value.isArticle) {
                                categoryState.value.parentId = currentNode.value?.id
                            } else if (currentNode.value?.isArticle) {
                                categoryState.value.parentId = currentNode.value?.categoryId === 0 ? null : currentNode.value?.categoryId
                            }
                        } else {
                            categoryState.value.parentId = null
                        }
                    } else {
                        ElMessage.warning("信息获取失败")
                    }
                })
            },
        },
        {
            label: "文章",
            click: () => {
                //初始化默认父级目录
                if (currentNode.value) {
                    if (currentNode.value.isArticle) {
                        articleState.value.categoryId = currentNode.value.categoryId === 0 ? null : currentNode.value.categoryId
                    } else if (!currentNode.value.isArticle) {
                        articleState.value.categoryId = currentNode.value.id
                    }
                } else {
                    articleState.value.categoryId = null
                }
                ArtDialogVisible.value = true
            },
        },
    ],
}
const delOption = {
    label: "删除",
    click: () => {
        if (currentNode.value) {
            instance?.proxy?.$bus.emit("deleteNode", currentNode.value)
        }
    },
    disabled: false,
}
const renameOption = {
    label: "重命名",
    click: () => {
        if (currentNode.value) {
            currentNode.value.isEdit = true
        }
    },
    disabled: false,
}
const contextMenu = ref({
    menus: [newOption, delOption, renameOption],
})

//显示上下文菜单
function showContextMenu(event) {
    menusEvent(event, contextMenu.value)
    if (event.target.className.includes("el-scrollbar")) {
        currentNode.value = null
        delOption.disabled = true
        renameOption.disabled = true
    } else {
        //如果目录下有子节点禁用
        if (currentNode.value?.inverseParent?.length > 0) {
            delOption.disabled = true
        } else {
            delOption.disabled = false
        }
        renameOption.disabled = false
    }
}

//设置当前选中的节点
function setContextNode(node: Category) {
    currentNode.value = node
}

//新建目录前置验证
async function newCategory(form: FormInstance) {
    if (!form) return
    await form.validate((valid, fields) => {
        if (valid) {
            cateLoading.value = true
            instance?.proxy?.$bus.emit("newCategory", { category: categoryState.value, node: currentNode.value })
        } else {
            cateLoading.value = false
            return false
        }
    })
}
//创建目录成功回调
function newCategorySuccess() {
    cateDialogVisible.value = false
    cateLoading.value = false
    categoryState.value.name = ""
    categoryState.value.parentId = null
}
</script>

<style scoped>
.side-container {
    z-index: 2;
    position: sticky;
    height: 100vh;
    width: 250px;
    top: 0;
    background-color: #fff;
    -webkit-box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    box-shadow: 0 1px 14px rgb(0 21 41 / 8%);
    transition: all 0.5s;
}
.submit {
    display: flex;
    justify-content: flex-end;
}

.side-collapse {
    width: 0px;
    transform: translateX(-250px);
}
</style>
