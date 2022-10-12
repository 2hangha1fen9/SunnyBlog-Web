<template>
    <div class="comment-reply">
        <div id="vditor"></div>
        <div style="display: flex; justify-content: flex-end; margin-top: 10px">
            <el-button type="success" :loading="btnLoading" @click="sendComment" style="">回复</el-button>
        </div>
    </div>
    <div class="comment-info">
        <Avatar class="user-avatar-box" :photo="photo" :showUsername="false" />
        <div class="comment-content">
            <div class="comment-meta">
                <div style="white-space: nowarp">
                    <el-link href="#">{{ comment.nick || comment.username }}</el-link>
                    在
                    <el-link :href="`/article/${comment.articleId}`" target="_blank">{{ comment.articleTitle }}</el-link>
                    发表了评论
                </div>
                <div style="white-space: nowrap">{{ format(comment?.createTime, "zh_CN") }}</div>
            </div>
            <div class="comment-words" ref="commentRef"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, reactive, nextTick, ref, getCurrentInstance, onMounted } from "vue"
import { format } from "timeago.js"
import "vditor/dist/index.css"
import Vditor from "vditor"
import { ElMessage } from "element-plus"
import Avatar from "@/components/Avatar.vue"
import { Response } from "@/interface/common/response"
import { Comment } from "@/interface/comment/comment"
import { publishComment } from "@/api/comment/comment"

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
        return `${process.env.VUE_APP_BASE_API}/user-service${props?.comment.photo}`
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
                        let imgUrl = `${process.env.VUE_APP_BASE_API}/comment-service${data.result.path}`
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

<style scoped>
#vditor >>> .vditor-toolbar {
    background-color: #fff !important;
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
