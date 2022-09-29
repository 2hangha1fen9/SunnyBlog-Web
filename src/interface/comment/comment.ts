export interface Comment {
    id: number
    articleId: number
    userId: number
    photo: string
    nick: string
    username: string
    content: string
    createTime: string
    parentId: number
    inverseParent: Array<Comment>
}