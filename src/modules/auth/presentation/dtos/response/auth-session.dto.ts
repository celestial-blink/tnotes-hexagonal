import User, { UserProperties } from "../../../../user/domain/roots/user";

type ResultFromDataToResponse = {
    id: string,
    name: string
}

export default class AuthSessionDto {
    static fromDataToResponse(user: UserProperties): ResultFromDataToResponse {
        return {
            id: user.id,
            name: user.name
        }
    }
}
