import { err, ok, Result } from "neverthrow";
import User, { UserProperties } from "./user";
import ErrorInterface from "../../../../core/error/error.interface";


export type UserFactoryResult = Result<User, Error>

export default class UserFactory {
    static create(properties: UserProperties): UserFactoryResult {
        const userProperties: UserProperties = {
            ...properties,
            id: properties.id ?? crypto.randomUUID(),
            createdAt: properties.createdAt ?? new Date()
        }

        const error:ErrorInterface = new Error();
        if (userProperties.name.length > 40) {
            error.name = "Invalid user.name";
            error.message = "String max 40 characters";
            error.status = 412;
            return err(error);
        }

        const patternEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        if(!patternEmail.test(properties.email)) {
            error.name = "Invalid user.email";
            error.message = "Email is invalid";
            error.status = 412;
            return err(error);
        }

        return ok(new User(userProperties));
    }
}