import { Cookie } from "@builder.io/qwik-city";

import { SessionResult, ValidatePasswordResult } from "./types";

import Fetch from "~/helpers/fetch";
import config from "~/config";

export default class AuthApi {
    static async session(signal: AbortSignal | null, cookie: Cookie) {
        const myFetch = new Fetch();
        const sessionResult = await myFetch.execute<SessionResult>({
            url: `${config.PATH_BASE_API}auth/session`,
            cookie,
            requestInit: {
                method: "GET",
                signal
            }
        });

        return sessionResult;
    }

    static async login(signal: AbortSignal | null) {
        const myFetch = new Fetch();
        const loginResult = await myFetch.execute<SessionResult>({
            url: `${config.PATH_BASE_API}auth/login`,
            cookie: null,
            requestInit: {
                method: "POST",
                signal
            }
        });

        return loginResult;
    }

    static logout(cookie: Cookie) {
        cookie.delete(config.NAME_ACCESS_TOKEN);
        cookie.delete(config.NAME_REFRESH_TOKEN);
        return true;
    }

    static async validatePassword(password: string, signal: AbortSignal | null, cookie: Cookie) {
        const myFetch = new Fetch();
        const passwordResult = await myFetch.execute<ValidatePasswordResult>({
            url: `${config.PATH_BASE_API}auth/validate-password`,
            cookie: null,
            requestInit: {
                method: "POST",
                signal,
                body: JSON.stringify({ password })
            }
        });

        return passwordResult;
    }
}
