<template>
    <section class="tag-container">
        <el-card class="left-card" shadow="never">
            <template #header>
                <span>添加标签</span>
            </template>
            <el-form label-width="80px" :rules="rules" :inline="true" :model="state" ref="formRef">
                <el-form-item prop="name" required label="标签名称">
                    <el-input v-model="state.name"></el-input>
                </el-form-item>
                <el-form-item prop="color" label="标签颜色">
                    <p style="display: flex">
                        <el-input v-model="state.color" style="margin-right: 5px"></el-input>
                        <el-color-picker v-model="state.color" style="margin: -17px" />
                    </p>
                </el-form-item>
                <el-form-item prop="isPrivate" label="私有标签" v-if="state.userId == userId || !state.userId ? true : false">
                    <el-switch v-model="state.isPrivate" :active-value="-1" :inactive-value="1" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="clearForm">重置</el-button>
                    <el-button type="success" :loading="loading" v-if="state.userId == userId || !state.userId ? true : false" @keyup.enter="saveTag(formRef, state.id ? true : false)" @click="saveTag(formRef, state.id ? true : false)">{{ state.id ? "修改" : "添加" }}</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card class="right-card" shadow="never">
            <template #header>
                <span>可用标签</span>
            </template>
            <fieldset class="tag-fieldset" v-if="myTags.length">
                <legend>我的标签</legend>
                <el-tooltip v-for="tag in myTags" :key="tag.name" effect="dark" :content="` ${tag.articleCount || 0} 篇文章`" placement="top-start">
                    <el-tag class="tag-item" :color="tag.color" closable effect="dark" @click="preEditTag(tag)" @close="deleteSingleTag(tag.id)">
                        {{ tag.name }}
                    </el-tag>
                </el-tooltip>
            </fieldset>
            <fieldset class="tag-fieldset" v-if="publicTags.length">
                <legend>公共标签</legend>
                <el-tooltip v-for="tag in publicTags" :key="tag.name" effect="dark" :content="` ${tag.articleCount || 0} 篇文章`" placement="top-start">
                    <el-tag class="tag-item" :color="tag.color" effect="dark">
                        {{ tag.name }}
                    </el-tag>
                </el-tooltip>
            </fieldset>
        </el-card>
    </section>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from "vue"
import { useStore } from "vuex"
import { ElMessage, FormRules, FormInstance } from "element-plus"
//接口
import { Response } from "@/interface/common/response"
import { Tag } from "@/interface/article/tag"
//api
import { listMyTag, updateTag, addTag, delTag } from "@/api/article/tag"

const emits = defineEmits<{
    (event: "updateTag", tags: Array<Tag>): void
}>()
const store = useStore()
const userId = store.getters["identity/userId"]
//表单数据
const rules = reactive<FormRules>({
    name: [
        {
            required: true,
            trigger: "blur",
            message: "名称不能为空",
        },
    ],
})
const formRef = ref<FormInstance>()
const state = reactive<Tag>({
    id: null,
    userId: userId,
    name: "",
    color: "",
    isPrivate: 1,
})
const loading = ref(false)
//展示数据
const tags = ref<Array<Tag>>([])
const myTags = ref<Array<Tag>>([])
const publicTags = ref<Array<Tag>>([])

//监听tag数据,更新我的标签和公共标签
watch(
    tags,
    (newVal) => {
        tags.value = newVal
        myTags.value = tags.value.filter((tag: Tag) => {
            return tag.userId == userId
        })
        publicTags.value = tags.value.filter((tag: Tag) => {
            return tag.userId != userId
        })
    },
    {
        deep: true,
    }
)

//获取标签
function getAllTag() {
    //获取公共标签
    listMyTag().then((data: Response<Array<Tag>>) => {
        if (data.status !== 200) {
            ElMessage.warning("数据拉取失败")
        }
        tags.value = data.result
        emits("updateTag", tags.value)
    })
}
//显示编辑信息
function preEditTag(tag: Tag) {
    state.id = tag.id
    state.userId = userId
    state.name = tag.name
    state.color = tag.color
    state.isPrivate = tag.isPrivate
}
function deleteSingleTag(tid: number) {
    if (tid) {
        delTag([{ id: tid }]).then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success("删除成功")
                tags.value = tags.value.filter((tag: Tag) => {
                    return tag.id !== tid
                })
                emits("updateTag", tags.value)
            } else {
                ElMessage.error(data.message)
            }
        })
    }
}
//保存标签信息
async function saveTag(form: FormInstance, idEdit: boolean) {
    if (!form) return
    loading.value = true
    await form.validate((valid, fields) => {
        if (valid) {
            if (idEdit) {
                updateTag(state).then((data: Response<string>) => {
                    if (data.status === 200) {
                        ElMessage.success("修改成功")
                        //更新列表数据
                        let t = tags.value.find((item) => item.id === state.id)
                        if (t) {
                            t.id = state.id
                            t.userId = userId
                            t.name = state.name
                            t.color = state.color
                            t.isPrivate = state.isPrivate
                        }
                        clearForm()
                        emits("updateTag", tags.value)
                    }
                })
            } else {
                addTag(state).then((data: Response<string>) => {
                    if (data.status === 200) {
                        ElMessage.success("添加成功")
                        tags.value.push({
                            id: data.result,
                            userId: userId,
                            name: state.name,
                            color: state.color,
                            isPrivate: state.isPrivate,
                        })
                        clearForm()
                    }
                })
            }
        } else {
            loading.value = false
        }
    })
}

//清空表单
function clearForm() {
    state.id = null
    state.userId = userId
    state.name = ""
    state.color = ""
    state.isPrivate = 1
    loading.value = false
}

getAllTag()
</script>

<style scoped>
.tag-container {
    width: 100%;
}
.left-card {
    width: 100%;
    margin: 5px;
}
.right-card {
    width: 100%;
    margin: 5px;
}
.color-pick {
    width: 100px;
}
.tag-item {
    cursor: pointer;
    margin: 5px;
    border: none;
    box-shadow: 3px 0px 7px rgb(0 0 0 / 12%);
}
.tag-fieldset {
    color: lightgray;
    border: 2px dashed lightgray;
}
</style>
