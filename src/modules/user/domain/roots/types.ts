export interface UserRequired {
    id: string;
    email: string;
    password: string;
    createdAt: Date;
}

export interface UserOptional {
    name: string;
    updatedAt: Date;
    deletedAt: Date;
}

export type UserProperties = UserRequired & Partial<UserOptional>;

export type UserUpdateProperties = Partial<Omit<UserProperties, "email">>;

