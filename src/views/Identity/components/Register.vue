<template>
    <section class="register-form">
        <router-link to="/identity/login" :replace="true" class="login-btn">登录</router-link>
        <el-form :model="registerData" size="large" :rules="rules" ref="registerForm" status-icon @keyup.enter="handleRegister(registerForm)">
            <el-form-item>
                <h3 style="width: 100%">
                    <svg-icon icon-class="sunny" />
                    用户注册
                </h3>
            </el-form-item>
            <el-form-item prop="username" required>
                <el-input class="input-box" v-model="registerData.username" placeholder="请输入登录名,长度为6~20" tabindex="1" min="6" max="20" />
            </el-form-item>
            <el-form-item prop="password" required>
                <el-input class="input-box" v-model="registerData.password" placeholder="请输入密码,不能少于6位" tabindex="1" min="6" type="password" />
            </el-form-item>
            <el-form-item prop="repassword" required>
                <el-input class="input-box" v-model="registerData.repassword" placeholder="请确认密码" tabindex="1" min="6" type="password" />
            </el-form-item>
            <el-form-item prop="receiver" required>
                <el-input class="input-box" v-model="vcData.receiver" :placeholder="vcDataPlaceHolder" tabindex="1" min="6" max="20">
                    <template #append>
                        <el-radio-group v-model="vcData.type" size="small" style="flex-wrap: nowrap; margin: 0px -10px 0px -10px">
                            <el-radio-button label="email">邮箱</el-radio-button>
                            <el-radio-button label="phone">手机号</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verificationCode" required>
                <el-input v-model="registerData.verificationCode" placeholder="请输入验证码" tabindex="1" type="number" :max="6">
                    <template #append>
                        <el-button @click="handleSend(registerForm)" :disabled="sendButton.IsDisable">{{ sendButton.buttonState }}</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-button :loading="loading" type="primary" style="width: 100%; margin-bottom: 30px" @click="handleRegister(registerForm)">注册</el-button>
        </el-form>
    </section>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { FormRules, FormInstance, ElMessage } from "element-plus"
//api
import { register } from "@/api/user/register" //登录api
import { sendVerificationCode } from "@/api/identity/vcode" //验证码api
//接口
import { Response } from "@/interface/common/response"
import { RegisterPayload } from "@/interface/user/register"
import { SendVCode } from "@/interface/identity/vcode"
import { da } from "element-plus/es/locale"

const router = useRouter()

//ui显示数据
const loading = ref(false)

//表单数据
const registerForm = ref<FormInstance>()
//发送验证码请求数据
const vcData = reactive<SendVCode>({
    type: "email",
    receiver: "",
})
//注册请求数据
const registerData = reactive<RegisterPayload>({
    username: "",
    password: "",
    repassword: "",
    email: "",
    phone: "",
    receiver: "", //方便做表单验证
    verificationCode: "",
})

//确认密码验证码
function checkRepassword(rule: unknown, value: string, callback: unknown) {
    if (value !== registerData.password) {
        return callback(new Error("两次密码输入不一致"))
    }
    callback()
}
//邮箱/手机号验证
function checkReceiver(rule: unknown, value: string, callback: unknown) {
    if (!value) {
        if (vcData.type === "email") {
            return callback(new Error("请输入邮箱"))
        } else {
            return callback(new Error("请输入手机号"))
        }
    } else {
        if (vcData.type === "email" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            return callback(new Error("邮箱格式错误"))
        }
        if (vcData.type === "phone" && !/^1[3|4|5|7|8|9]\d{9}$/.test(value)) {
            return callback(new Error("手机号格式错误"))
        }
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
        {
            min: 6,
            max: 20,
            message: "登录名长度为6~20",
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
    repassword: [
        {
            required: true,
            message: "请再输入一次密码",
            trigger: "blur",
        },
        {
            validator: checkRepassword,
            trigger: "blur",
        },
    ],
    receiver: [
        {
            validator: checkReceiver,
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

const vcDataPlaceHolder = ref("请输入邮箱")
watch(vcData, (newVal) => {
    vcDataPlaceHolder.value = newVal.type === "phone" ? "请输入手机号" : "请输入邮箱"
    //同步到注册信息
    if (newVal.type === "email") {
        registerData.email = newVal.receiver
        registerData.phone = ""
    } else if (newVal.type === "phone") {
        registerData.phone = newVal.receiver
        registerData.email = ""
    }
    registerData.receiver = newVal.receiver
})

//验证码请求体
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

//注册方法
async function handleRegister(form: FormInstance) {
    if (!form) return
    await form.validate((valid, fields) => {
        if (valid) {
            loading.value = true
            //调用登录api
            register(registerData)
                .then((data: Response<string>) => {
                    //存入token
                    if (data.status === 200) {
                        ElMessage.success(data.result)
                        router.push("/identity/login")
                    } else {
                        ElMessage.warning(data.result)
                    }
                    loading.value = false
                })
                .catch((error) => {
                    ElMessage.warning(`未知错误${error}`)
                    loading.value = false
                })
        } else {
            return false
        }
    })
}
//发送验证码方法
async function handleSend(form: FormInstance) {
    //发送验证码
    await form.validateField("receiver", (valid) => {
        if (valid) {
            sendButton.handle()
            //调用发送验证码api
            sendVerificationCode(vcData).then((data: Response<string>) => {
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
.register-form {
    width: 350px;
    padding: 30px 20px 10px 20px;
    border-radius: 10px;
    color: #fff;
    background-color: rgba(255, 255, 255, 0.25);
    box-shadow: rgb(0 0 0 / 20%) 0 0 10px;
    -webkit-backdrop-filter: blur(10px);
    backdrop-filter: blur(10px);
    overflow: hidden;
    position: relative;
}
.login-btn {
    font-size: 0.3em;
    color: white;
    background-color: rgba(255, 255, 255, 0.074);
    padding: 5px 15px 5px 15px;
    backdrop-filter: blur(20px);
    border-bottom-left-radius: 10px;
    text-decoration: none;
    position: absolute;
    top: 0;
    right: 0;
}
.login-btn:hover {
    background-color: rgba(255, 255, 255, 0.25);
}
</style>
