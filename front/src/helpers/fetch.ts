import { Cookie } from "@builder.io/qwik-city";
import { addDays } from "date-fns";
import format from "date-fns/format";

export type FetchInit = {
    url: string,
    requestInit: RequestInit,
    cookie: Cookie | null
};

type FetchResult<T> = {
    success: boolean,
    data: T
};


export default class Fetch {
    private static url: string = "";
    private static requestInit: RequestInit = {};
    private static cookie: Cookie | null;

    static async execute<T = any>(payload: FetchInit) {
        Fetch.url = payload.url;
        Fetch.requestInit = payload.requestInit;
        Fetch.cookie = payload.cookie;

        return await Fetch.run<FetchResult<T>>();
    }

    private static async run<T = any>(): Promise<T> {
        try {
            const api = await fetch(this.url, {
                ...this.requestInit,
                headers: {
                    "Content-Type": "application/json",
                    ...this.cookie ? {
                        "Authorization": `Bearer ${this.cookie.get("accessToken")?.value ?? ""}`,
                        "refreshToken": `${this.cookie.get("refreshToken")?.value ?? ""}`,
                    } : {}

                },
                credentials: "same-origin"
            });

            const json = await api.json();
            if (api.status === 401 && !json?.success && json?.data?.name === "User unauthenticated") {
                throw new Error("Refresh token");
            }
            const prepareResponse = { ...json };

            return prepareResponse as T;
        } catch (error: Error | any) {
            console.error(error);

            if (error.message === "Refresh token") {
                return await Fetch.callRefreshToken();
            }

            const json = {
                success: false,
                data: {},
            }

            return json as T;
        }
    }

    private static async callRefreshToken<T = any>(): Promise<T> {
        try {
            const api = await fetch("http://127.0.0.1:1112/api/auth/refreshToken", {
                method: "POST",
                headers: {
                    ...this.requestInit.headers,
                    "Content-Type": "application/json",
                    ...this.cookie ? {
                        "Authorization": `Bearer ${this.cookie.get("accessToken")?.value ?? ""}`,
                        "refreshToken": `${this.cookie.get("refreshToken")?.value ?? ""}`,
                    } : {}
                },
                credentials: "same-origin"
            });
            const json = await api.json();
            const prepareResponse = { ...json };

            if (json?.success) {

                if (this.cookie) {
                    const expires = format(addDays(Date.now(), 2), "PPpp");
                    this.cookie?.set("accessToken", json?.data?.accessToken, { expires: expires, secure: true, httpOnly: true, maxAge: [2, "days"], path: "/" });
                    this.cookie?.set("refreshToken", json?.data?.refreshToken, { expires: expires, secure: true, httpOnly: true, maxAge: [2, "days"], path: "/" });
                }

                const apiResult = await fetch(this.url, {
                    ...this.requestInit,
                    headers: {
                        "Content-Type": "application/json",
                        ...this.cookie ? {
                            "Authorization": `Bearer ${this.cookie.get("accessToken")?.value ?? ""}`,
                            "refreshToken": `${this.cookie.get("refreshToken")?.value ?? ""}`,
                        } : {}
                    },
                    credentials: "same-origin"
                });
                const jsonResult = await apiResult.json();
                const prepareResponse = { ...jsonResult };

                return prepareResponse as T;
            }

            return prepareResponse as T;
        } catch (error: Error | any) {
            console.error(error);

            const json = {
                success: false,
                data: {}
            }

            return json as T;
        }
    }
}
