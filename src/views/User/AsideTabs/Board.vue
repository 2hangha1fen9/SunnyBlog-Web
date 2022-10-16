<template>
    <div v-show="user.id != userId" ref="preview" class="vditor board-card board-preview"></div>
    <div v-show="user.id == userId" id="board" class="board-card"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, nextTick, watch } from "vue"
import { useStore } from "vuex"
import Vditor from "vditor"
import "vditor/dist/index.css"
import { User } from "@/interface/user/user"
import { Response } from "@/interface/common/response"
import { uploadPicture } from "@/api/article/drawing-bed"
import { updateUserInfo } from "@/api/user/user"
import { ElMessage } from "element-plus"
import { getImgUrl } from "@/utils/converter"


const store = useStore()
const userId = store.getters["identity/userId"]
//markdown编辑器
const vditor = ref<Vditor | null>(null)
//预览模式
const preview = ref()
const props = defineProps<{
    user: User
}>()

onMounted(() => {
    if (props.user.id != userId) {
        //markdown编辑器配置
        vditor.value = new Vditor("board", {
            preview: {
                markdown: {
                    mark: true,
                },
            },
            cache: {
                enable: false,
            },
            minHeight: 200,
            toolbar: [],
            placeholder: "小黑板",
            toolbarConfig: {
                hide: true,
            },
            upload: {
                //自定义上传逻辑
                accept: "image/*",
                handler(files) {
                    let formData = new FormData()
                    formData.append("data", files[0])
                    uploadPicture(formData).then((data: Response<string>) => {
                        if (data.status === 200) {
                            let imgUrl = getImgUrl("article-service",data.result.path,false)
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
                    vditor.value?.setValue(props.user.message?.trim() || "")
                })
            },
            blur(value: string) {
                updateUserInfo({
                    id: props.user.id,
                    message: value,
                }).then((data: Response<string>) => {
                    if (data.status !== 200) {
                        ElMessage.warning(data.message)
                    }
                })
            },
        })
    }
})

watch(
    props,
    (newVal) => {
        nextTick(() => {
            if (props.user.id == userId) {
                vditor.value?.setValue(newVal.user.message?.trim() || "")
            } else {
                Vditor.preview(preview.value, newVal.user.message?.trim() || "小黑板", {
                    markdown: {
                        toc: true,
                    },
                })
            }
        })
    },
    {
        immediate: true,
    }
)
</script>
