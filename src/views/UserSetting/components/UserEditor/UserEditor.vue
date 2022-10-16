<template>
    <div class="user-editor">
        <el-form :rules="rules" ref="formRef" :model="user" label-width="80px">
            <div class="img-area">
                <el-form-item label="头像" prop="photo" style="height: 100px">
                    <el-upload class="avatar-uploader" :show-file-list="false" :auto-upload="false" :limit="1" :on-change="previewPhoto" name="data">
                        <el-avatar :size="100" :src="user.photo" />
                    </el-upload>
                </el-form-item>
                <el-form-item label="主页封面" prop="cover" style="height: 200px">
                    <el-upload class="cover-uploader" :show-file-list="false" :auto-upload="false" :limit="1" :on-change="previewCover" name="data">
                        <el-image :src="user.cover" fit="fill" style="height: 100%" />
                    </el-upload>
                </el-form-item>
            </div>
            <el-form-item label="登录名" required prop="username">
                <el-input v-model="user.username" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nick">
                <el-input v-model="user.nick" />
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-radio-group v-model="user.sex">
                    <el-radio :label="1">男</el-radio>
                    <el-radio :label="-1">女</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
                <el-date-picker v-model="user.birthday" value-format="YYYY-MM-DDTHH:mm:ss" format="YYYY-MM-DD" type="date" />
            </el-form-item>
            <el-form-item label="个人说明" prop="remark">
                <el-input v-model="user.remark" autosize type="textarea" />
            </el-form-item>
        </el-form>
        <div class="submit">
            <el-button type="primary" :loading="loading" @click="saveUserInfo(formRef)">保存</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue"
import { ElMessage, UploadFile } from "element-plus"
import type { FormRules, FormInstance } from "element-plus"
import { getImgUrl } from "@/utils/converter"
//api
import { updateUserInfo, getLoginInfo } from "@/api/user/user"
import { uploadImage } from "@/api/user/avatar"
//接口
import { UserDetail } from "@/interface/user/user"
import { Response, UploadResult } from "@/interface/common/response"

//表单数据
const user = ref<UserDetail>({})
const photoData = ref<FormData>(new FormData()) //用户待上传的图片数据
const coverData = ref<FormData>(new FormData()) //用户待上传的封面数据
const loading = ref(false)
const formRef = ref<FormInstance>()
//表单验证规则
const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            trigger: "blur",
            message: "用户名不能为空",
        },
    ],
    nick: [
        {
            required: true,
            trigger: "blur",
            message: "昵称不能为空",
        },
        {
            type: "string",
            min: 2,
            max: 80,
            message: "昵称长度为2~80个字符",
        },
    ],
})

//上传预览图片
function previewPhoto(file: UploadFile) {
    if (["image/jpeg", "image/png", "image/gif", "image/bmp", "image/ico"].indexOf(file.raw?.type) === -1) {
        ElMessage.warning("图片格式错误：只能为：png、jpeg、gif、bmp、ico")
        return false
    }
    if (file.size / 1024 / 1024 > 2) {
        ElMessage.warning("文件大小不能超过2M")
        return false
    }
    photoData.value.append("data", file.raw)
    user.value.photo = URL.createObjectURL(file.raw)
}
//上传预览封面
function previewCover(file: UploadFile) {
    if (["image/jpeg", "image/png", "image/gif", "image/bmp", "image/ico"].indexOf(file.raw?.type) === -1) {
        ElMessage.warning("图片格式错误：只能为：png、jpeg、gif、bmp、ico")
        return false
    }
    coverData.value.append("data", file.raw)
    user.value.cover = URL.createObjectURL(file.raw)
}

//提交用户信息
function saveUserInfo(form: FormInstance) {
    loading.value = true
    //如果上传了头像,先调用上传头像接口上传头像
    if (photoData.value.get("data")) {
        uploadImage(photoData.value, user.value.id)
            .then((data: Response<UploadResult>) => {
                if (data.status !== 200) {
                    ElMessage.warning("图片上传失败")
                    return false
                }
                user.value.photo = getImgUrl("user-service", data.result.path)
            })
            .then(() => {
                save(form)
            })
    }
    //如果上传了封面,先调用上传头像接口上传封面
    else if (coverData.value.get("data")) {
        uploadImage(coverData.value, user.value.id, "cover")
            .then((data: Response<UploadResult>) => {
                if (data.status !== 200) {
                    ElMessage.warning("图片上传失败")
                    return false
                }
                user.value.cover = getImgUrl("user-service", data.result.path)
            })
            .then(() => {
                save(form)
            })
    } else {
        save(form)
    }
}

//保存用户信息
async function save(form: FormInstance) {
    if (!form) return
    await form.validate((valid, fields) => {
        if (valid) {
            updateUserInfo(user.value).then((data: Response<string>) => {
                if (data.status !== 200) {
                    ElMessage.warning(data.message)
                } else {
                    ElMessage.success("操作成功")
                }
                loading.value = false
            })
        } else {
            return false
        }
    })
}

getLoginInfo().then((data: Response<UserDetail>) => {
    if (data.status === 200) {
        user.value = data.result
        user.value.photo = getImgUrl("user-service", user.value.photo)
        user.value.cover = getImgUrl("user-service", user.value.cover)
    } else {
        ElMessage.warning(data.message)
    }
})
</script>

<style scope>
.user-editor {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-content: space-between;
    height: 100%;
}
.cover-uploader {
    height: 100% !important;
}
.cover-uploader .el-upload {
    height: 100% !important;
}

.img-area {
    display: flex;
    justify-content: space-around;
}

.submit {
    display: flex;
    justify-content: flex-end;
}
</style>
