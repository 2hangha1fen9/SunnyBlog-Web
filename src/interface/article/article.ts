import { Tag } from './tag'

export interface Article {
    id: number
    userId: number
    nick: string
    username: string
    title: string
    summary: string
    content: string
    codeStyle: string
    contentStyle: string
    photo: string
    regionName: string
    regionId: number
    tags: Array<Tag>
    categoryId: number
    categoryName: string
    meta: Meta
    status: number
    isLock: number
    commentStatus: number
    createTime: string
}
export interface Meta {
    articleId: number
    viewCount: number
    likeCount: number
    commentCount: number
    collectionCount: number
    isUserLike: number
    isUserCollection: number
}
export interface ArticleId {
    id: number
}