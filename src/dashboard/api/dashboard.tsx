export type Todo = {
    id: number,
    owner: string,
    title: string,
    status: 'NONE' | 'IN_PROGRESS' | 'DONE',
    createdAt: string
}