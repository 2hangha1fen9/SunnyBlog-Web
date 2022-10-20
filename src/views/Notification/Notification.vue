<template>
    <div class="notify-container reactive-main">
        <el-tabs>
            <el-tab-pane label="评论消息">
                <CommentTab />
            </el-tab-pane>
            <el-tab-pane label="点赞消息">
                <LikeTab />
            </el-tab-pane>
            <el-tab-pane label="关注消息">
                <FollowTab />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script setup lang="ts">
import CommentTab from "./components/CommentTab/CommentTab.vue"
import LikeTab from "./components/LikeTab/LikeTab.vue"
import FollowTab from "./components/FollowTab/FollowTab.vue"
</script>

<style scoped>
.notify-container {
    width: 700px;
    max-width: 100%;
    min-height: 500px;
    padding: 20px;
    box-sizing: border-box;
    margin: 20px auto auto;
    box-shadow: var(--el-box-shadow);
}
</style>
