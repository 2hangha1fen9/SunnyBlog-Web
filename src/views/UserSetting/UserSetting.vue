<template>
    <div class="usersetting-container">
        <el-tabs tabPosition="left" style="height: 100%">
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <h3 style="display: inline">个人资料</h3>
                    </span>
                </template>
                <UserEditor />
            </el-tab-pane>
            <el-tab-pane>
                <template #label>
                    <span class="custom-tabs-label">
                        <h3 style="display: inline">账号设置</h3>
                    </span>
                </template>
                <UserBind />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import UserEditor from "./components/UserEditor/UserEditor.vue"
import UserBind from "./components/UserBind/UserBind.vue"
</script>

<style scoped>
.usersetting-container {
    width: 750px;
    max-width: 100%;

    padding: 20px;
    box-sizing: border-box;
    margin: 20px auto auto;
    box-shadow: 0px 0px 13.1px rgba(0, 0, 0, 0.024), 0px 0px 44px rgba(0, 0, 0, 0.036), 0px 0px 197px rgba(0, 0, 0, 0.06);
}

.el-tabs >>> .el-tabs__content,
.el-tab-pane {
    height: 100%;
}
</style>
