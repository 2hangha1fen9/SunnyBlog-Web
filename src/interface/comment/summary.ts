export interface Summary {
    articleId: number  //文章ID
    viewCount: number   //浏览量
    likeCount: number   //点赞量
    commentCount: number    //评论数量
    collectionCount: number //收藏数量
    isUserLike: number  //该用户是否点赞
    isUserCollection: number    //该用户是否收藏
}