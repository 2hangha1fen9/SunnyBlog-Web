<template>
    <el-table :data="state.page" border ref="tableRef" v-loading="tableLoading">
        <el-table-column type="selection" width="55" />
        <el-table-column prop="title" fixed="left" label="文章标题" d/>
        <el-table-column prop="regionName" label="分区" min-width="100" />
        <el-table-column prop="categoryName" label="目录" min-width="100" />
        <el-table-column width="130" label="操作" fixed="right">
            <template #default="scope">
                <el-button-group>
                    <el-button type="success" size="small" @click="handleSingleRestore(scope.row, scope.$index)">还原</el-button>
                    <el-popconfirm title="您确定要删除这条记录吗" @confirm="handleSingleDelete(scope.row.id, scope.$index)">
                        <template #reference>
                            <el-button type="danger" size="small">删除</el-button>
                        </template>
                    </el-popconfirm>
                </el-button-group>
            </template>
        </el-table-column>
        <template #empty>
            <el-empty description="什么也没有" />
        </template>
    </el-table>
    <footer class="footer">
        <div>
            <el-popconfirm title="您确定要删除选中的记录吗" @confirm="handleManyDelete">
                <template #reference>
                    <el-button type="danger" size="small">批量删除</el-button>
                </template>
            </el-popconfirm>
        </div>
        <el-pagination class="pageination" background layout="jumper, prev, pager, next , total ,sizes" :total="state.totalCount" v-model:currentPage="state.pageIndex" v-model:page-size="state.pageSize" />
    </footer>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, getCurrentInstance } from "vue"
import { ElMessage, ElTable } from "element-plus"
import { throttle } from "lodash" //引入防抖节流
//api
import { listMyArticle, deleteArticle, updateArticle } from "@/api/article/article"
//接口
import { Article, ArticleId } from "@/interface/article/article"
import { Response, PageBean } from "@/interface/common/response"

const instance = getCurrentInstance()
const tableLoading = ref(false) //表格加载动画
const tableRef = ref<InstanceType<typeof ElTable>>() //表格引用
const state = reactive<PageBean<Array<Article>>>({}) //表格数据

//获取数据方法
const getArticleList = throttle(function () {
    tableLoading.value = true
    listMyArticle(state.pageIndex, state.pageSize, [
        {
            key: "status",
            value: 3,
        },
    ]).then((data: Response<PageBean<Array<Article>>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        //将结果保存
        state.page = data.result.page
        state.pageSize = data.result.pageSize
        state.totalPages = data.result.totalPages
        state.totalCount = data.result.totalCount
        tableLoading.value = false
    })
}, 200)

//删除单行
function handleSingleDelete(id: number, rowIndex: number) {
    deleteArticle([{ id: id }]).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page.splice(rowIndex, 1)
            //如果当前编辑器是当前文章则清空编辑器内容
            instance?.proxy?.$bus.emit("resetArticle", id)
        } else {
            ElMessage.error(data.message)
        }
    })
}
//删除选中行
function handleManyDelete() {
    const selectRow = tableRef.value?.getSelectionRows()
    //构造id序列
    const ids: Array<ArticleId> = []
    selectRow.forEach((element) => {
        ids.unshift({
            id: element.id,
        })
    })
    deleteArticle(ids).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            state.page = state.page.filter((item: Article) => {
                //过滤已删除的id
                return ids.find((i: ArticleId) => i.id === item.id) == null
            })
        } else {
            ElMessage.error(data.message)
        }
    })
}
//单行还原
function handleSingleRestore(row: Article, rowIndex: number) {
    updateArticle({
        id: row.id,
        status: 4,
    }).then((data: Response<string>) => {
        if (data.status === 200) {
            ElMessage.success(data.message)
            row.status = 4
            instance?.proxy?.$bus.emit("newArticle", { article: row, isRestore: true })
            state.page.splice(rowIndex, 1)
        } else {
            ElMessage.error(data.message)
        }
    })
}

getArticleList()

onMounted(() => {
    //监听页码页面尺寸
    watch([() => state.pageIndex, () => state.pageSize], () => {
        getArticleList()
    })
})
</script>

<style scoped>
.footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
}
</style>
