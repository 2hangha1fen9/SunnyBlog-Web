<template>
    <div class="comment-reply">
        <div id="vditor"></div>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px">
            <el-button type="success" :loading="btnLoading" @click="sendComment" style="">回复</el-button>
        </div>
    </div>
    <div class="comment-info">
        <CommentListItem :comment="comment" :showUsername="true" />
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, nextTick, ref, getCurrentInstance, onMounted, onUnmounted } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import { useDark } from "@vueuse/core"
import Vditor from "vditor"
import CommentListItem from "@/components/CommentListItem.vue"
import { ElMessage } from "element-plus"
import Avatar from "@/components/Avatar.vue"
import { Response } from "@/interface/common/response"
import { Comment } from "@/interface/comment/comment"
import { publishComment } from "@/api/comment/comment"
import { getImgUrl } from "@/utils/converter"

//判断是否是黑暗模式
const instance = getCurrentInstance()
const isDark = useDark()
const commentRef = ref()
const btnLoading = ref(false)
const props = defineProps<{
    comment: Comment
}>()
const emits = defineEmits<{
    (event: "closeDialog"): void
    (event: "deleteMessage", cid: number): void
}>()
const state = reactive<Comment>({
    articleId: props?.comment.articleId,
    parentId: props?.comment.id,
    content: null,
})

//获取照片真实路径
const photo = computed(() => {
    if (props?.comment.photo) {
        return getImgUrl("user-service", props?.comment.photo)
    }
    return null
})

//发送评论
function sendComment() {
    //获取编辑框内容
    state.content = vditor.value?.getValue()

    if (!state.content.trim()) {
        return ElMessage.warning("请输入评论内容")
    }

    btnLoading.value = true
    publishComment(state)
        .then((data: Response<string>) => {
            if (data.status === 200) {
                ElMessage.success(data.result)
                vditor.value?.setValue("")
                emits("closeDialog")
                emits("deleteMessage", props.comment.id)
            }
        })
        .finally(() => {
            btnLoading.value = false
        })
}

nextTick(() => {
    Vditor.preview(commentRef.value, props?.comment.content, {
        markdown: {
            mark: true,
        },
        theme: {
            current: isDark.value ? "dark" : "light",
        },
        hljs: {
            lineNumber: true,
            style: isDark.value ? "native" : "github",
        },
    })
})

//markdown编辑器
const vditor = ref<Vditor | null>(null)
onMounted(() => {
    //markdown编辑器配置
    vditor.value = new Vditor("vditor", {
        preview: {
            markdown: {
                mark: true,
            },
        },
        cache: {
            enable: false,
        },
        theme: isDark.value ? "dark" : "classic",
        toolbar: ["emoji", "undo", "redo", "upload"],
        upload: {
            //自定义上传逻辑
            accept: "image/*",
            handler(files) {
                let formData = new FormData()
                formData.append("data", files[0])
                uploadPicture(formData).then((data: Response<string>) => {
                    if (data.status === 200) {
                        debugger
                        let imgUrl = getImgUrl("comment-service", data.result.path, false)
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

//切换黑暗模式事件
instance?.proxy?.$bus.on("switchStyle", switchStyle)
function switchStyle(status: boolean) {
    vditor.value?.setTheme(status ? "dark" : "classic")
}
onUnmounted(() => {
    instance?.proxy?.$bus.all.delete("switchStyle")
})
</script>

<style scoped>
#vditor >>> .vditor-toolbar {
    background-color: var(--el-bg-color) !important;
}

.comment-info {
    display: flex;
    flex-direction: row;
    margin-top: 15px;
}
.comment-content {
    width: 100%;
    padding-inline-start: 20px;
    padding-inline-end: 20px;
}
.comment-meta {
    display: flex;
    width: 100%;
    justify-content: space-between;
}
.comment-words {
    padding-top: 10px;
    padding-bottom: 10px;
}
</style>
