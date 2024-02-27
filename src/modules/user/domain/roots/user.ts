import UserFactory from "./user.factory";

import { UserProperties, UserUpdateProperties } from "./types";

export default class User {
    private readonly id: string;
    private name: string;
    private readonly email: string;
    private password: string;
    private createdAt: Date;
    private updatedAt: null | Date;
    private deletedAt: null | Date;

    constructor(properties: UserProperties) {
        this.id = properties.id;
        this.name = properties.name;
        this.email = properties.email;
        this.password = properties.password;
        this.createdAt = properties.createdAt;
        this.updatedAt = properties.updatedAt;
        this.deletedAt = properties.updatedAt;
    }

    properties(): UserProperties {
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            deletedAt: this.deletedAt,
        };
    }

    delete() {
        this.deletedAt = new Date();
    }

    update(fields: UserUpdateProperties) {
        const fieldsFiltered = Object.fromEntries(
            Object.entries(fields).filter(([_, v]) => v !== null)
        );
        Object.assign(this, fieldsFiltered);
        this.updatedAt = new Date();
    }

    static reconstitute(properties: UserProperties): User {
        const result = UserFactory.create(properties);
        if (result.isErr()) throw result.error;
        return result.value;
    }
}

