<template>
    <div class="cate-tree-container">
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
            @node-drag-end="dragEnd"
            @node-click="expandArticle"
            ref="categoryTree"
        >
            <template #default="{ data }">
                <p @click.right="nodeRightClick(data)" class="tree-item">
                    <SvgIcon :iconClass="data.isArticle ? 'markdown' : 'folder'" />
                    <input type="text" class="editorInput" v-model="data.name" v-if="data.isEdit" @keyup.enter="renameNode(data)" @blur="renameNode(data)" v-focus />
                    <span class="tree-item" v-else>{{ data.name }}</span>
                </p>
            </template>
        </el-tree>
    </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, onUnmounted, ref } from "vue"
import { ElMessage } from "element-plus"
import { listCategory, updateCategory, createCategory, deleteCategory } from "@/api/article/category"
import { deleteArticle, updateArticle, listMyArticle } from "@/api/article/article"
import { Category } from "@/interface/article/category"
import { Article } from "@/interface/article/article"
import { Response, PageBean } from "@/interface/common/response"
import type Node from "element-plus/es/components/tree/src/model/node"
import type { DropType } from "element-plus/es/components/tree/src/tree.type"
import SvgIcon from "@/components/SvgIcon.vue"
import { debounce } from "lodash-es"

const instance = getCurrentInstance()
const state = ref<Array<Category>>()
const categoryTree = ref()
const emits = defineEmits<{
    (event: "getContextNode", node: Category): Node
    (event: "newCategorySuccess"): void
}>()

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
                        categoryId: item.categoryId,
                    })
                }
            })
        } else {
            //拷贝所有数据
            let _state = JSON.parse(JSON.stringify(state.value))
            //获取需要更新的节点
            let node = getCategoryNode(categoryNode.id, _state)

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
                        categoryId: item.categoryId,
                    })
                }
            })

            categoryTree.value.updateKeyChildren(categoryNode.id, JSON.parse(JSON.stringify(node.inverseParent)))
        }
    })
}

//展开节点
const expandArticle = debounce(function (categoryNode: Category, node: Node) {
    if (!categoryNode.isArticle && !node.expanded) {
        getArticleByCategory(categoryNode.id, categoryNode).then(() => {
            node.expanded = true
        })
    } else {
        node.expanded = false
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
    if ((draggingNode.data.isArticle && dropNode.data.isArticle && type === "inner") || (!draggingNode.data.isArticle && dropNode.data.isArticle && type === "inner")) {
        return false
    } else {
        return true
    }
}

//拖入结束事件
const dragEnd = debounce(function (draggingNode: Node, dropNode: Node, dropType: DropType) {
    //当被拖拽节点为文档,并且进入节点为分类时触发文章分类修改
    if (draggingNode.data?.isArticle) {
        let cid = null
        if (dropType === "inner") {
            //拖到目录上分类id为目标节点id
            cid = dropNode.data.id
        } else if (dropNode.data.isArticle) {
            //拖动到某个目录同级元素目标为同级的分类id
            cid = dropNode.data.categoryId
        }

        if (cid !== null) {
            updateArticle({
                id: draggingNode.data.id.replace("a-", ""),
                categoryId: cid,
            }).then((data: Response<string>) => {
                if (data.status !== 200) {
                    ElMessage.warning(data.message)
                }
            })
        }
    }
    //当拖拽节点为文件夹时触发分类修改操作
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
function deleteNode(node: Category) {
    debugger
    if (!node.isArticle) {
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
    } else if (node.isArticle) {
        deleteArticle([
            {
                id: node.id.replace("a-", ""),
            },
        ]).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success(data.message)
                categoryTree.value.remove(node)
            } else {
                ElMessage.warning(data.message)
            }
        })
    }
}

//新建分区
instance?.proxy?.$bus.on("newCategory", newCategory)
function newCategory({ category, node }) {
    createCategory(category).then((data: Response<string>) => {
        if (data.status === 200) {
            //添加到相应节点
            category.id = data.result
            category.inverseParent = []
            categoryTree.value.append(JSON.parse(JSON.stringify(category)), node)
        } else {
            ElMessage.warning(data.message)
        }
        emits("newCategorySuccess")
    })
}

getCategory()

onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("deleteNode")
    instance?.proxy?.$bus.all.delete("newCategory")
})
</script>

<style scoped>
.cate-tree-container {
    height: 100%;
}
.el-tree >>> .el-tree-node__content {
    height: 40px;
    line-height: 40px;
}
.el-tree >>> .el-tree-node__label {
    width: 100%;
}
.editorInput {
    outline-color: #40a0ffb3;
}
</style>
