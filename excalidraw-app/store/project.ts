import { atom } from "jotai";

type Project = {
        id: number
        created_at: string
        data: any
        is_deleted: boolean
        user: string
        thumbnail: string
        title: string
        updated_at: string
}

export const projectAtom = atom<Project | null>(null);

