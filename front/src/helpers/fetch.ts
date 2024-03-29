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
    private url: string = "";
    private requestInit: RequestInit = {};
    private cookie: Cookie | null = null;

    async execute<T = any>(payload: FetchInit) {
        this.url = payload.url;
        this.requestInit = payload.requestInit;
        this.cookie = payload.cookie;

        return await this.run<FetchResult<T>>();
    }

    private async run<T = any>(): Promise<T> {
        try {
            console.log("url inrun", this.url);

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

            return json as T;
        } catch (error: Error | any) {
            console.error(error);

            if (error.message === "Refresh token") {
                return await this.callRefreshToken<T>();
            }

            const json = {
                success: false,
                data: {},
            }

            return json as T;
        }
    }

    private async callRefreshToken<T = any>(): Promise<T> {
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

            if (json?.success) {

                if (this.cookie) {
                    const expires = format(addDays(Date.now(), 2), "PPpp");
                    this.cookie?.set("accessToken", json?.data?.accessToken, { expires: expires, secure: true, httpOnly: true, maxAge: [2, "days"], path: "/" });
                    this.cookie?.set("refreshToken", json?.data?.refreshToken, { expires: expires, secure: true, httpOnly: true, maxAge: [2, "days"], path: "/" });
                }
                console.log("hrl",this.url);

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

                return jsonResult as T;
            }

            return json as T;
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
