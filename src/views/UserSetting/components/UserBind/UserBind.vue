<template>
    <ul class="user-bind-container">
        <li class="bind-item">
            <div>
                <h3 class="bind-key">邮箱</h3>
                <span class="bind-value">{{ user.email || "未绑定" }}</span>
            </div>
            <div>
                <el-popover v-if="user.email && user.phone" title="邮箱解绑" width="300px">
                    <template #reference>
                        <el-link class="bind-btn">解绑</el-link>
                    </template>
                    <el-input type="password" placeholder="请输入密码" v-model="ubindState.password">
                        <template #append>
                            <el-button size="small" @click="ubindAccount('email')">确定</el-button>
                        </template>
                    </el-input>
                </el-popover>
                <el-divider v-if="user.email && user.phone" direction="vertical" />
                <el-link class="bind-btn" @click="showBindDialog('email')">{{ user.email ? "修改" : "绑定" }}</el-link>
            </div>
        </li>
        <li class="bind-item">
            <div>
                <h3 class="bind-key">手机</h3>
                <span class="bind-value">{{ user.phone || "未绑定" }}</span>
            </div>
            <div>
                <el-popover v-if="user.phone && user.email" title="手机解绑" width="300px">
                    <template #reference>
                        <el-link class="bind-btn">解绑</el-link>
                    </template>
                    <el-input type="password" placeholder="请输入密码" v-model="ubindState.password">
                        <template #append>
                            <el-button size="small" @click="ubindAccount('phone')">确定</el-button>
                        </template>
                    </el-input>
                </el-popover>
                <el-divider v-if="user.phone && user.email" direction="vertical" />
                <el-link class="bind-btn" @click="showBindDialog('phone')">{{ user.phone ? "修改" : "绑定" }}</el-link>
            </div>
        </li>
        <li class="bind-item">
            <div>
                <h3 class="bind-key">修改密码</h3>
            </div>
            <el-link class="bind-btn" @click="showPasswordDialog">修改</el-link>
        </li>
    </ul>
    <!-- 用户账号绑定表单 -->
    <el-dialog align-center v-model="bindDialog" v-if="bindDialog" :title="`${bindDialogTitle}绑定`">
        <el-form :rules="rules.bindRules" ref="bindFormRef" :model="bindState" label-width="80px">
            <el-form-item prop="bind" required :label="`${bindDialogTitle}`">
                <el-input class="input-box" v-model="bindState.bind" tabindex="0" :placeholder="`请输入${bindDialogTitle}`" />
            </el-form-item>
            <el-form-item prop="verificationCode" required label="验证码">
                <el-input v-model="bindState.verificationCode" placeholder="请输入验证码" tabindex="2" type="number" :max="6">
                    <template #append>
                        <el-button @click="handleSend(bindFormRef)" :disabled="sendButton.IsDisable">{{ sendButton.buttonState }}</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" required label="密码">
                <el-input class="input-box" v-model="bindState.password" placeholder="请输入密码" tabindex="1" min="6" type="password" />
            </el-form-item>
        </el-form>
        <div class="submit">
            <el-button type="primary" :loading="loading" @click="bindAccount(bindFormRef)">保存</el-button>
        </div>
    </el-dialog>
    <!-- 用户修改密码表单 -->
    <el-dialog align-center v-model="passwordDialog" v-if="passwordDialog" title="修改密码">
        <el-form :model="passwordState" :rules="rules.passwordRules" ref="passwordFormRef" label-width="80px">
            <el-form-item prop="bindValue" required :label="`${passwordBindType}`">
                <el-input class="input-box" readonly disabled v-model="passwordState.bindValue" :placeholder="`该账号没有绑定${passwordBindType}`" tabindex="1" min="6" max="20">
                    <template #append>
                        <el-radio-group v-model="passwordState.bindType" size="small" style="flex-wrap: nowrap; margin: 0px -10px 0px -10px">
                            <el-radio-button label="email">邮箱</el-radio-button>
                            <el-radio-button label="phone">手机号</el-radio-button>
                        </el-radio-group>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="verificationCode" required label="验证码">
                <el-input v-model="passwordState.verificationCode" placeholder="请输入验证码" tabindex="1" type="number" :max="6">
                    <template #append>
                        <el-button @click="handleSend(passwordFormRef, 'password')" :disabled="sendButton.IsDisable">{{ sendButton.buttonState }}</el-button>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item prop="password" required label="新密码">
                <el-input class="input-box" v-model="passwordState.password" placeholder="请输入密码,不能少于6位" tabindex="1" min="6" type="password" />
            </el-form-item>
            <el-form-item prop="newPassword" required label="确认密码">
                <el-input class="input-box" v-model="passwordState.newPassword" placeholder="请确认密码" tabindex="1" min="6" type="password" />
            </el-form-item>
        </el-form>
        <div class="submit">
            <el-button type="primary" :loading="loading" @click="chagePassword(passwordFormRef)">保存</el-button>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { reactive, ref, watch } from "vue"
import { useStore } from "vuex"
import { useRouter } from "vue-router"
import { ElMessage, FormRules, UploadFile } from "element-plus"
import { getLoginInfo, forgetPassword } from "@/api/user/user"
import { bind, ubind } from "@/api/user/bind"
import { sendVerificationCode } from "@/api/identity/vcode" //验证码api
//接口
import { UserDetail, ForgetPassword } from "@/interface/user/user"
import { BindAccount, UBindAccount } from "@/interface/user/bind"
import { Response } from "@/interface/common/response"
import { SendVCode } from "@/interface/identity/vcode"

const router = useRouter()
const store = useStore()
const username = store.getters["identity/username"]
const loading = ref(false)
//用户数据
const user = ref<UserDetail>({})
//用户绑定对话框
const bindDialogTitle = ref("邮箱")
const bindDialog = ref(false)
//修改密码对话框
const passwordDialog = ref(false)
const passwordBindType = ref("邮箱")
//绑定相关表单数据
const bindFormRef = ref<FormInstance>()
const bindState = reactive<BindAccount>({})
const ubindState = reactive<UBindAccount>({})
//修改密码表单数据
const passwordFormRef = ref<FormInstance>()
const passwordState = ref<ForgetPassword>({
    username: username,
    password: null,
    newPassword: null,
    bindType: "email",
    bindValue: user.value.email,
    verificationCode: null,
})
//监视当前选择的的验证模式
watch(passwordState.value, (newVal) => {
    passwordState.value = newVal
    if (passwordState.value.bindType === "email") {
        passwordState.value.bindValue = user.value.email
        passwordBindType.value = "邮箱"
    } else if (passwordState.value.bindType === "phone") {
        passwordState.value.bindValue = user.value.phone
        passwordBindType.value = "手机"
    }
})

//表单数据规则
//邮箱/手机号验证
function checkBind(rule: unknown, value: string, callback: unknown) {
    if (!value) {
        if (bindState.type === "email") {
            return callback(new Error("请输入邮箱"))
        } else if (bindState.type === "phone") {
            return callback(new Error("请输入手机号"))
        }
    } else {
        if (bindState.type === "email" && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value)) {
            return callback(new Error("邮箱格式错误"))
        }
        if (bindState.type === "phone" && !/^1[3|4|5|7|8|9]\d{9}$/.test(value)) {
            return callback(new Error("手机号格式错误"))
        }
    }
    callback()
}
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
    bindRules: {
        bind: [
            {
                validator: checkBind,
                trigger: "blur",
            },
        ],
        password: [
            {
                required: true,
                message: "密码不能为空",
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
    },
    passwordRules: {
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
    },
})

//获取登录者信息
getLoginInfo().then((data: Response<UserDetail>) => {
    if (data.status === 200) {
        user.value = data.result
    } else {
        ElMessage.warning(data.message)
    }
})

//对话框显示
function showBindDialog(type: string) {
    bindDialog.value = true
    bindState.type = type
    if (type === "email") {
        bindDialogTitle.value = "邮箱"
    } else if (type === "phone") {
        bindDialogTitle.value = "手机"
    }
}
function showUbindPop(type: string) {
    ubindState.type = type
}
function showPasswordDialog() {
    if (passwordState.value.bindType === "email") {
        passwordState.value.bindValue = user.value.email
        passwordBindType.value = "邮箱"
    } else if (passwordState.value.bindType === "phone") {
        passwordState.value.bindValue = user.value.phone
        passwordBindType.value = "手机"
    }
    passwordDialog.value = true
}

//用户账号绑定方法
async function bindAccount(form: FormInstance) {
    if (!form) return
    loading.value = true
    await form.validate((valid, fields) => {
        if (valid) {
            bind(bindState)
                .then((data: Response<string>) => {
                    if (data.status !== 200) {
                        ElMessage.warning(data.message)
                    } else {
                        user.value[bindState.type] = bindState.bind
                        bindDialog.value = false
                        ElMessage.success("操作成功")
                    }
                })
                .finally(() => {
                    bindState.type = bindState.bind = bindState.password = bindState.verificationCode = null
                    loading.value = false
                })
        } else {
            return false
            loading.value = false
        }
    })
}
//用户账号解绑方法
function ubindAccount(type: string) {
    ubindState.type = type
    if (ubindState.type && ubindState.password) {
        ubind(ubindState)
            .then((data: Response<string>) => {
                if (data.status !== 200) {
                    ElMessage.warning(data.message)
                } else {
                    ElMessage.success("操作成功")
                }
            })
            .finally(() => {
                user.value[type] = null
                ubindState.password = null
                ubindState.type = null
            })
    }
}
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
                        passwordDialog.value = false
                        ElMessage.success("操作成功")
                        //密码修改完毕后要求用户重新登录
                        store.dispatch["identity/logout"]
                        router.replace("/identity")
                    }
                })
                .finally(() => {
                    passwordState.value.newPassword = passwordState.value.verificationCode = null
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
    await form.validateField(type, (valid) => {
        if (valid) {
            sendButton.handle()
            //调用发送验证码api
            let data: SendVCode = {
                type: type === "bind" ? bindState.type : passwordState.value.bindType,
                receiver: type === "bind" ? bindState.bind : passwordState.value.bindValue,
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
.user-bind-container {
    list-style-type: none;
    padding-inline-start: 20px;
}
.bind-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 0.5px solid lightgray;
    min-height: 80px;
}
.bind-value {
    color: gray;
    display: inline-block;
    padding-top: 5px;
}
.bind-btn {
    font-size: 16px;
}

.submit {
    display: flex;
    justify-content: flex-end;
}
</style>
