<template>
    <el-scrollbar max-height="100%" style="width: inherit">
        <el-input v-model="filterText" placeholder="过滤关键字" clearable class="filter-input" />
        <el-tree
            :data="state"
            node-key="id"
            :props="{
                label: 'name',
                children: 'inverseParent',
            }"
            clearable
            draggable
            :render-after-expand="false"
            :allow-drop="dropCheck"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            @node-drag-end="dragEnd"
            @node-click="expandArticle"
            ref="categoryTree"
        >
            <template #default="{ data }">
                <p @click.right="nodeRightClick(data)" class="tree-item">
                    <SvgIcon :iconClass="data.isArticle ? 'markdown' : 'folder'" :style="data.isArticle && data.status === 1 ? 'color:#409eff' : ''" />
                    <input type="text" class="editorInput" v-model="data.name" v-if="data.isEdit" @keyup.enter="renameNode(data)" @blur="renameNode(data)" v-focus />
                    <span class="tree-item" v-else>{{ data.status === 4 ? `${data.name} [草稿]` : data.name }}</span>
                </p>
            </template>
        </el-tree>
    </el-scrollbar>
</template>

<script setup lang="ts">
import { getCurrentInstance, onUnmounted, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, ElTree } from "element-plus"
import { listCategory, updateCategory, createCategory, deleteCategory } from "@/api/article/category"
import { deleteArticle, updateArticle, listMyArticle } from "@/api/article/article"
import { Category } from "@/interface/article/category"
import { Article } from "@/interface/article/article"
import { Response, PageBean } from "@/interface/common/response"
import type Node from "element-plus/es/components/tree/src/model/node"
import type { DropType } from "element-plus/es/components/tree/src/tree.type"
import SvgIcon from "@/components/SvgIcon.vue"
import { debounce } from "lodash-es"
import { Tree } from "element-plus/es/components/tree-v2/src/types"

const router = useRouter()
const instance = getCurrentInstance()
const state = ref<Array<Category>>()
const categoryTree = ref()
const emits = defineEmits<{
    (event: "getContextNode", node: Category): Node
    (event: "newCategorySuccess"): void
}>()

//搜索关键字
const filterText = ref("")
function filterNode(value: string, data: Tree) {
    if (!value) return true
    return data.name.includes(value)
}
//监听关键字变化
watch(filterText, (val) => {
    categoryTree.value!.filter(val)
})

//获取分类信息
function getCategory() {
    listCategory()
        .then((data: Response<Array<Category>>) => {
            if (data.status === 200) {
                state.value = data.result
            } else {
                ElMessage.warning("信息获取失败")
            }
        })
        .then(() => {
            getArticleByCategory(null, null)
        })
}

// 根据分类id获取文章列表
function getArticleByCategory(cid: number, categoryNode: Category) {
    return listMyArticle(1, -1, [
        {
            key: "CategoryId",
            value: cid,
        },
    ]).then((data: Response<PageBean<Array<Article>>>) => {
        if (categoryNode === null) {
            //不为子节点,添加到当前节点数据
            data.result.page.forEach((item: Article) => {
                if (item.status !== 3) {
                    state.value?.push({
                        id: `a-${item.id}`,
                        name: item.title,
                        userId: item.userId,
                        isArticle: true,
                        categoryId: item.categoryId === 0 ? null : item.categoryId,
                        status: item.status,
                    })
                }
            })
        } else {
            //拷贝所有数据,防止响应式数据造成重复数据
            //获取需要更新的节点
            let node = getCategoryNode(categoryNode.id, JSON.parse(JSON.stringify(state.value)))

            node.inverseParent = node.inverseParent.filter((item: Category) => {
                return !item.isArticle
            })
            //根节点直接添加
            data.result.page.forEach((item: Article) => {
                if (item.status !== 3) {
                    node.inverseParent.push({
                        id: `a-${item.id}`,
                        name: item.title,
                        userId: item.userId,
                        isArticle: true,
                        categoryId: item.categoryId === 0 ? null : item.categoryId,
                        status: item.status,
                    })
                }
            })
            //更新目录树
            categoryTree.value.updateKeyChildren(categoryNode.id, JSON.parse(JSON.stringify(node.inverseParent)))
        }
    })
}

//展开节点
const expandArticle = debounce(function (categoryNode: Category, node: Node) {
    if (!categoryNode.isArticle && !node.expanded) {
        node.expanded = true
        getArticleByCategory(categoryNode.id, categoryNode)
    } else {
        node.expanded = false
    }

    //如果点击为文章展示文章编辑
    if (categoryNode.isArticle) {
        router.replace({
            query: {
                articleId: categoryNode.id.replace("a-", ""),
                isEdit: 1,
            },
        })
    }
}, 100)

//根据id获取节点
function getCategoryNode(cid: string, categorys: Array<Category>): Category {
    let result = null
    function query(cid: string, category: Category) {
        if (cid === category.id) {
            result = category
        } else if (category.inverseParent && category.inverseParent.length > 0) {
            category.inverseParent.forEach((item: Category) => {
                query(cid, item)
            })
        }
    }
    categorys.forEach((item: Category) => {
        query(cid, item)
    })

    return result
}

//检测节点是否可以拖拽
function dropCheck(draggingNode, dropNode, type) {
    if ((draggingNode.data.isArticle && dropNode.data.isArticle && type === "inner") || (!draggingNode.data.isArticle && dropNode.data.isArticle && type === "inner") || draggingNode.data.id === dropNode.data.id) {
        return false
    } else {
        return true
    }
}

//拖入结束事件
const dragEnd = debounce(function (draggingNode: Node, dropNode: Node, dropType: DropType) {
    //当被拖拽节点为文档,并且进入节点为目录时触发文章目录修改
    if (draggingNode.data?.isArticle) {
        let cid = null
        if (dropType === "inner") {
            //拖到目录上id为目标节点id
            cid = dropNode.data.id
        } else if (dropNode.data.isArticle) {
            //拖动到某个目录同级元素目标为同级的文章目录id
            cid = dropNode.data.categoryId
        } else if (!dropNode.data.isArticle) {
            //拖动到某个目录同级元素目标为同级的目录id
            cid = dropNode.data.parentId
        }

        updateArticle({
            id: draggingNode.data.id.replace("a-", ""),
            categoryId: cid,
        }).then((data: Response<string>) => {
            if (data.status !== 200) {
                ElMessage.warning(data.message)
            }
            instance?.proxy?.$bus.emit("updateCategory", cid)
        })
    }
    //当拖拽节点为文件夹时触发目录修改操作
    else {
        let pid = null
        if (dropType === "inner") {
            //拖到目录内部id为目标节点id
            pid = dropNode.data.id
        } else if (dropNode.data.isArticle) {
            //拖动到某个目录同级元素目标为同级的分类id
            pid = dropNode.data.categoryId
        } else if (!dropNode.data.isArticle) {
            pid = dropNode.data.parentId
        }

        updateCategory({
            id: draggingNode.data.id,
            parentId: pid,
        }).then((data: Response<string>) => {
            if (data.status !== 200) {
                ElMessage.warning(data.message)
            }
        })
    }
}, 200)

//获取当前节点
function nodeRightClick(node) {
    emits("getContextNode", node)
}

//重命名保存
function renameNode(node: Category) {
    if (node.isArticle) {
        updateArticle({
            id: node.id.replace("a-", ""),
            title: node.name,
        }).then((data: Response<string>) => {
            if (data.status !== 200) {
                ElMessage.warning(data.message)
            } else {
                //如果编辑器上为当前修改的文章则同步修改
                instance?.proxy?.$bus.emit("updateArticleName", { aid: node.id.replace("a-", ""), name: node.name })
            }
        })
    } else if (!node.isArticle) {
        updateCategory({
            id: node.id,
            name: node.name,
        }).then((data: Response<string>) => {
            if (data.status !== 200) {
                ElMessage.warning(data.message)
            }
        })
    }
    node.isEdit = false
}

//删除节点
instance?.proxy?.$bus.on("deleteNode", deleteNode)
function deleteNode({ node, id }) {
    //如果传入为id先查询出node
    if (id) {
        node = getCategoryNode(`a-${id}`, state.value)
        //有id仅做前端删除
        node && categoryTree.value.remove(node)
    } else if (!node?.isArticle) {
        if (node.inverseParent.length <= 0) {
            deleteCategory(node.id).then((data: Response<string>) => {
                if (data.status === 200) {
                    ElMessage.success(data.message)
                    categoryTree.value.remove(node)
                } else {
                    ElMessage.warning(data.message)
                }
            })
        } else {
            ElMessage.warning("该目录下还有子元素")
        }
    } else if (node?.isArticle) {
        //没有id则调用api删除
        deleteArticle([
            {
                id: node.id.replace("a-", ""),
            },
        ]).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success("删除成功,需要恢复请查看回收站")
                categoryTree.value.remove(node)
                //如果当前编辑器是当前文章则清空编辑器内容
                instance?.proxy?.$bus.emit("resetArticle", node.id.replace("a-", ""))
            } else {
                ElMessage.warning(data.message)
            }
        })
    }
}

//新建目录节点
instance?.proxy?.$bus.on("newCategory", newCategory)
function newCategory({ category, node }) {
    createCategory(category).then((data: Response<string>) => {
        if (data.status === 200) {
            //添加到相应节点
            category.id = parseInt(data.result)
            category.inverseParent = []
            categoryTree.value.append(JSON.parse(JSON.stringify(category)), node)
        } else {
            ElMessage.warning(data.message)
        }
        emits("newCategorySuccess")
    })
}

//新建文章节点
instance?.proxy?.$bus.on("newArticle", newArticle)
function newArticle({ article, isRestore }) {
    let node = null
    //如果文章有分类id则添加到相应的目录下
    if (article.categoryId && article.categoryId !== 0) {
        //获取当前目录节点
        node = getCategoryNode(article.categoryId, JSON.parse(JSON.stringify(state.value)))
        //添加到当前节点的子节点
        node.inverseParent.push({
            id: `a-${article.id}`,
            name: article.title,
            userId: article.userId,
            isArticle: true,
            categoryId: article.categoryId === 0 ? null : article.categoryId,
            status: article.status,
        })
        //更新目录树
        categoryTree.value.updateKeyChildren(article.categoryId, JSON.parse(JSON.stringify(node.inverseParent)))
    } else {
        //添加到根目录
        state.value?.push({
            id: `a-${article.id}`,
            name: article.title,
            userId: article.userId,
            isArticle: true,
            categoryId: article.categoryId === 0 ? null : article.categoryId,
            status: article.status,
        })
    }

    if (isRestore === null || !isRestore) {
        //展示新建的文章编辑区
        router.replace({
            query: {
                articleId: article.id,
                isEdit: 1,
            },
        })
    }
}

//更新文章节点
instance?.proxy?.$bus.on("updateArticleNode", updateArticleNode)
function updateArticleNode(article: Article) {
    let currentArticleNode = getCategoryNode(`a-${article.id}`, state.value)
    //目录没有更改只修改文章名称和状态
    if (currentArticleNode?.categoryId === article?.categoryId) {
        currentArticleNode.name = article.title
        currentArticleNode.status = article.status
    } else {
        //修改目录信息
        //删除当前节点
        categoryTree.value.remove(currentArticleNode)
        //添加到新的节点上
        if (article?.categoryId) {
            //获取新的目录节点
            let parentNode = getCategoryNode(article.categoryId, state.value)
            //添加数据到新的节点
            parentNode.inverseParent.push({
                id: `a-${article.id}`,
                name: article.title,
                userId: article.userId,
                isArticle: true,
                categoryId: article.categoryId === 0 ? null : article.categoryId,
                status: article.status,
            })
            //更新目录树
            categoryTree.value.updateKeyChildren(parentNode.id, JSON.parse(JSON.stringify(parentNode.inverseParent)))
        }
        //没有目录信息添加到根目录
        else {
            //添加到根目录
            state.value?.push({
                id: `a-${article.id}`,
                name: article.title,
                userId: article.userId,
                isArticle: true,
                categoryId: article.categoryId === 0 ? null : article.categoryId,
                status: article.status,
            })
        }
    }
}
getCategory()

onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("deleteNode")
    instance?.proxy?.$bus.all.delete("newCategory")
    instance?.proxy?.$bus.all.delete("newArticle")
    instance?.proxy?.$bus.all.delete("updateArticleNode")
})
</script>

<style scoped>
.el-tree {
    display: inline-block;
    min-width: 100%;
}
.el-tree >>> .el-tree-node__content {
    height: 40px;
    line-height: 40px;
}
.el-tree >>> .el-tree-node__label {
    width: 100%;
}
.editorInput {
    outline-color: var(--el-color-primary);
}
.filter-input >>> .el-input__wrapper {
    width: 100%;
    margin: 5px;
}
</style>
