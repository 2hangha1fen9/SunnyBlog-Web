export interface Comment {
    id: number
    articleId: number
    articleTitle: string
    userId: number
    photo: string
    nick: string
    username: string
    content: string
    createTime: string
    parentId: number
    status: number
    inverseParent: Array<Comment>
}