import Crypt from "../../../core/helpers/crypt";
import UserApplication from "../../user/application/user.application";
import User from "../../user/domain/roots/user";
import { UserResult } from "../../user/infrastructure/user.infrastructure";

export default class AuthApplication {
    private readonly application: UserApplication;
    constructor(application: UserApplication) {
        this.application = application;
    }

    async existingUser(email: string, password: string): Promise<User> {
        const userFound = await this.application.getByEmail(email);

        if (userFound.isErr()) return null;

        const userMatch = await Crypt.compare(
            password,
            userFound.value.properties().password
        );

        if (!userMatch) return null;

        return userFound.value;
    }

    async getById(id: string): Promise<User> {
        const userFound = await this.application.getById(id);
        if (userFound.isErr()) return null;

        return userFound.value;
    }

    async logout(user: User): Promise<UserResult> {
        return await this.application.create(user);
    }

    async validatePassword(userId: string, password: string): Promise<boolean> {
        const userFound = await this.application.getById(userId);

        if (userFound.isErr()) return null;

        const userMatch = await Crypt.compare(
            password,
            userFound.value.properties().password
        );

        return userMatch
    }
}
