import User, { UserProperties } from "../../domain/roots/user";
import { User as UserEntity } from "@prisma/client";

export interface FromDataToResponse {
    readonly id: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
}

export default class UserModelDto {
    static fromDomainToData(user: User): UserEntity {
        const properties = user.properties();

        const userEntity: UserEntity = {
            id: properties.id,
            name: properties.name,
            email: properties.email,
            password: properties.password,
            createdAt: properties.deletedAt,
            updatedAt: properties.updatedAt,
            deletedAt: properties.deletedAt
        };

        return userEntity;
    }

    static fromDataToResponse(
        userEntity: UserEntity | UserEntity[]
    ): FromDataToResponse | FromDataToResponse[] {
        if (Array.isArray(userEntity)) {
            return userEntity.map((user) => {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                };
            });
        }

        return {
            id: userEntity.id,
            name: userEntity.name,
            email: userEntity.email,
            password: userEntity.password,
        };
    }

    static fromDataToDomain(userEntity: UserEntity): User {
        const properties: UserProperties = {
            id: userEntity.id,
            name: userEntity.name,
            email: userEntity.email,
            password: userEntity.password,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
            deletedAt: userEntity.deletedAt,
        };

        return User.reconstitute(properties);
    }
}
