import {
    UserDomainResult,
    UserGetByPage,
    UserResult,
} from "../../infrastructure/user.infrastructure";
import User from "../roots/user";

export interface UserRepository {
    save(user: User): Promise<UserResult>;
    getAll(): Promise<UserResult>;
    getById(id: string): Promise<UserDomainResult>;
    getByEmail(email: string): Promise<UserDomainResult>;
    getByPage(page: number, pageSize: number): Promise<UserGetByPage>;
}

