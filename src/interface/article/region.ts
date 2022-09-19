export interface Region {
    id: number
    name: string
    description: string
    parentId: number
    status:number
    inverseParent: Array<Region>
}