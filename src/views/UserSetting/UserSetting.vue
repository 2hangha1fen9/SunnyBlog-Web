<template>
    <div class="usersetting-container">
        <el-tabs tabPosition="left" style="height: 100%">
            <el-tab-pane label="个人资料">
                <UserEditor />
            </el-tab-pane>
            <el-tab-pane label="账号设置">账号设置</el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import UserEditor from "./components/UserEditor/UserEditor.vue"
</script>

<style scoped>
.usersetting-container {
    width: 700px;
    max-width: 100%;
    height: 600px;
    padding: 20px;
    margin: 20px auto auto;
    box-shadow: 0px 0px 13.1px rgba(0, 0, 0, 0.024), 0px 0px 44px rgba(0, 0, 0, 0.036), 0px 0px 197px rgba(0, 0, 0, 0.06);
}

.el-tabs >>> .el-tabs__content,
.el-tab-pane {
    height: 100%;
}
</style>
