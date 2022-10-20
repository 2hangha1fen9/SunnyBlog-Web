<template>
    <div class="comment-editor reactive-main">
        <div id="vditor" class="reactive-main"></div>
        <div class="comment-bar">
            <div class="comment-toreply">
                <Avatar v-if="reply" :photo="photo" :username="username" :showUsername="false"></Avatar>

                <div class="comment-toreply-content">
                    <p v-if="reply">
                        回复: @{{ reply.nick || reply.username }}
                        <el-link type="primary" @click="cleanToReply">取消</el-link>
                    </p>
                    <div ref="toReplyContent" class="toreply-content"></div>
                </div>
            </div>
            <el-button type="success" :loading="btnLoading" @click="sendComment">发表评论</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive, getCurrentInstance, onUnmounted, nextTick } from "vue"
import { useStore } from "vuex"
import { useDark } from "@vueuse/core"
import Vditor from "vditor"
import Avatar from "@/components/Avatar.vue"
import "vditor/dist/index.css"
import { ElMessage } from "element-plus"
import { Response } from "@/interface/common/response"
import { Comment } from "@/interface/comment/comment"
import { uploadPicture } from "@/api/comment/drawing-bed"
import { publishComment } from "@/api/comment/comment"
import { getImgUrl } from "@/utils/converter"


//判断是否是黑暗模式
const isDark = useDark()
const store = useStore()
const instance = getCurrentInstance()
const username = computed(() => store.getters["identity/username"])
const photo = computed(() => store.getters["identity/photo"])
const isLogin = computed(() => store.getters["identity/isValid"])
const reply = ref<Comment>()
const btnLoading = ref(false)
const toReplyContent = ref()

const props = defineProps<{
    aid: string
}>()
const state = reactive<Comment>({
    articleId: props?.aid,
    parentId: null,
    content: null,
})

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
                setTimeout(() => {
                    instance?.proxy?.$bus.emit("listComment", true)
                }, 1000)
            }
        })
        .finally(() => {
            btnLoading.value = false
        })
}

//展示回复人的信息
function replyComment(comment: Comment) {
    reply.value = comment
    state.parentId = reply.value?.id
    nextTick(() => {
        Vditor.preview(toReplyContent.value, reply?.value.content, {
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
}
instance?.proxy?.$bus.on("replyComment", replyComment)

//清空回复者信息
function cleanToReply() {
    reply.value = null
    state.parentId = null
    vditor.value?.setValue("")
    toReplyContent.value.innerHTML = ""
}

//markdown编辑器
const vditor = ref<Vditor | null>(null)
onMounted(() => {
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
        placeholder: "善语善人心,恶言伤人心~",
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
    instance?.proxy?.$bus.all.delete("replyComment")
    instance?.proxy?.$bus.all.delete("switchStyle")
})
</script>

<style scoped>
#vditor {
    border: none;
    border-bottom: 1px solid var(--border-color);
}
#vditor >>> .vditor-toolbar {
    background-color: var(--el-bg-color) !important;
}
</style>
