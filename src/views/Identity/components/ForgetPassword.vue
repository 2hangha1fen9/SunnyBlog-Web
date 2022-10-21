<template>
    <section class="forget-form">
        <router-link to="/identity" :replace="true" class="login-btn">登录</router-link>
        <el-form :model="passwordState" :rules="rules" ref="passwordFormRef" status-icon @keyup.enter="chagePassword(passwordFormRef)">
            <el-form-item>
                <h3 style="width: 100%">
                    <svg-icon icon-class="sunny" />
                    修改密码
                </h3>
            </el-form-item>
            <el-form-item prop="username" required>
                <el-input class="input-box" v-model="passwordState.username" placeholder="请输入登录名" tabindex="1" min="6" max="20" />
            </el-form-item>
            <el-form-item prop="bindValue" required>
                <el-input class="input-box" v-model="passwordState.bindValue" :placeholder="`请输入${passwordBindType}`" tabindex="1" min="6" max="20">
                    <template #append>
                        <el-radio-group v-model="passwordState.bindType" size="small" style="flex-wrap: nowrap; margin: 0px -10px 0px -10px">
                            <el-radio-button label="email">邮箱</el-radio-button>
                            <el-radio-button label="phone">手机号</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verificationCode" required>
                <el-input v-model="passwordState.verificationCode" placeholder="请输入验证码" tabindex="1" type="number" :max="6">
                    <template #append>
                        <el-button @click="handleSend(passwordFormRef)" :disabled="sendButton.IsDisable">{{ sendButton.buttonState }}</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" required>
                <el-input class="input-box" v-model="passwordState.password" placeholder="请输入密码,不能少于6位" tabindex="1" min="6" type="password" />
            </el-form-item>
            <el-form-item prop="newPassword" required>
                <el-input class="input-box" v-model="passwordState.newPassword" placeholder="请确认密码" tabindex="1" min="6" type="password" />
            </el-form-item>
        </el-form>
        <el-button type="primary" style="width: 100%; margin-bottom: 30px" :loading="loading" @click="chagePassword(passwordFormRef)">提交</el-button>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { ElMessage, FormRules } from "element-plus"
import { forgetPassword } from "@/api/user/user"
import { sendVerificationCode } from "@/api/identity/vcode" //验证码api
import { ForgetPassword } from "@/interface/user/user"
import { Response } from "@/interface/common/response"
import { SendVCode } from "@/interface/identity/vcode"

const router = useRouter()
const loading = ref(false)
const passwordDialog = ref(false)
const passwordBindType = ref("邮箱")
//修改密码表单数据
const passwordFormRef = ref<FormInstance>()
const passwordState = ref<ForgetPassword>({
    username: null,
    password: null,
    newPassword: null,
    bindType: "email",
    bindValue: null,
    verificationCode: null,
})
//监视当前选择的的验证模式
watch(passwordState.value, (newVal) => {
    passwordState.value = newVal
    if (passwordState.value.bindType === "email") {
        passwordBindType.value = "邮箱"
    } else if (passwordState.value.bindType === "phone") {
        passwordBindType.value = "手机"
    }
})

//表单数据规则
//邮箱/手机号验证
function checkReceiver(rule: unknown, value: string, callback: unknown) {
    if (!value) {
        if (passwordState.value.bindType === "email") {
            return callback(new Error("请输入邮箱"))
        } else {
            return callback(new Error("请输入手机号"))
        }
    } else {
        if (passwordState.value.bindType === "email" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            return callback(new Error("邮箱格式错误"))
        }
        if (passwordState.value.bindType === "phone" && !/^1[3|4|5|7|8|9]\d{9}$/.test(value)) {
            return callback(new Error("手机号格式错误"))
        }
    }
    callback()
}
//确认密码验证码
function checkRepassword(rule: unknown, value: string, callback: unknown) {
    if (value !== passwordState.value.password) {
        return callback(new Error("两次密码输入不一致"))
    }
    callback()
}
const rules = reactive<FormRules>({
    username: [
        {
            required: true,
            message: "请输入登录名",
            trigger: "blur",
        },
    ],
    bindValue: [
        {
            validator: checkReceiver,
            trigger: "blur",
        },
    ],
    password: [
        {
            required: true,
            message: "密码不能为空",
            trigger: "blur",
        },
        {
            min: 6,
            message: "密码不能少于6位",
            trigger: "blur",
        },
    ],
    newPassword: [
        {
            required: true,
            message: "两次密码输入不一致",
            trigger: "blur",
        },
        {
            validator: checkRepassword,
            trigger: "blur",
        },
    ],
    verificationCode: [
        {
            required: true,
            message: "验证码不能为空",
            trigger: "blur",
        },
        {
            min: 6,
            max: 6,
            message: "验证码长度为6位数字",
        },
    ],
})

//用户修改密码
async function chagePassword(form: FormInstance) {
    if (!form) return
    loading.value = true
    await form.validate((valid, fields) => {
        if (valid) {
            forgetPassword(passwordState.value)
                .then((data: Response<string>) => {
                    if (data.status !== 200) {
                        ElMessage.warning(data.message)
                    } else {
                        ElMessage.success("操作成功")
                        passwordState.value = {
                            username: null,
                            password: null,
                            newPassword: null,
                            bindType: "email",
                            bindValue: null,
                            verificationCode: null,
                        }
                        router.push("/identity")
                    }
                })
                .finally(() => {
                    loading.value = false
                })
        } else {
            loading.value = false
            return false
        }
    })
}

//验证码按钮
const sendButton = reactive({
    buttonState: "发送验证码",
    IsDisable: false,
    totalTime: 30,
    handle() {
        sendButton.IsDisable = true
        sendButton.buttonState = `${sendButton.totalTime}s后重新发送`
        let timer = setInterval(() => {
            sendButton.totalTime--
            sendButton.buttonState = `${sendButton.totalTime}s后重新发送`
            if (sendButton.totalTime < 0) {
                clearInterval(timer)
                sendButton.buttonState = "发送验证码"
                sendButton.totalTime = 30
                sendButton.IsDisable = false
            }
        }, 1000)
    },
})
//发送验证码方法
async function handleSend(form: FormInstance, type = "bind") {
    //发送验证码
    await form.validateField("bindValue", (valid) => {
        if (valid) {
            sendButton.handle()
            //调用发送验证码api
            let data: SendVCode = {
                type: passwordState.value.bindType,
                receiver: passwordState.value.bindValue,
            }
            sendVerificationCode(data).then((data) => {
                if (data.status === 200) {
                    ElMessage.success("发送成功")
                } else {
                    ElMessage.warning(data.message)
                }
            })
        }
    })
}
</script>

<style scoped>
.forget-form {
    width: 350px;
    padding: 30px 20px 10px 20px;
    border-radius: 10px;
    color: var(--el-color-white);
    background-color: var(--el-mask-color-extra-light);
    box-shadow: rgb(0 0 0 / 20%) 0 0 10px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    overflow: hidden;
    position: relative;
}
.login-btn {
    font-size: 0.3em;
    color: var(--el-color-white);
    background-color: var(--el-mask-color-extra-light);
    padding: 5px 15px 5px 15px;
    backdrop-filter: blur(20px);
    border-bottom-left-radius: 10px;
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 0;
}
.login-btn:hover {
    background-color: var(--el-mask-color);
}
</style>
