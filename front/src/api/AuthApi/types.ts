export type SessionResult = {
    iat: number;
    exp: number;
    name: string;
    email: string;
    id: string;
    idToken: string;
};

export type LoginParams = {
    password: string;
    email: string;
};

export type RegisterParams = LoginParams & {
    name: string
};

export type ValidatePasswordResult = {
    password: boolean
}
