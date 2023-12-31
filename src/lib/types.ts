import type { Session, User } from "@auth/core/types";
export interface UserWithId extends User {
    id: string
}

export interface SessionWithId extends Session {
    user?: UserWithId
}
export interface Message {
    timestamp: number,
    content: string,
    userId: string,
    sender: {
        image?: string,
        name?: string,
    }
}