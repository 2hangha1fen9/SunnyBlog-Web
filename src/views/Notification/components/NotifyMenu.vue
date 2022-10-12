<template>
    <el-tabs>
        <el-tab-pane label="评论消息">
            <CommentTab />
        </el-tab-pane>
        <el-tab-pane label="点赞消息">
            <LikeTab />
        </el-tab-pane>
        <el-tab-pane label="关注消息"><FollowTab /></el-tab-pane>
    </el-tabs>
</template>

<script setup lang="ts">
import CommentTab from "./CommentTab/CommentTab.vue"
import LikeTab from "./LikeTab/LikeTab.vue"
import FollowTab from "./FollowTab/FollowTab.vue"
</script>
