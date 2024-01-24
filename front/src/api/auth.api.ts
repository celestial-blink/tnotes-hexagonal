import Fetch, { FetchInit } from "~/helpers/fetch"

export default class AuthApi {
    static async session(signal: AbortController | null = null) {
        const payload: FetchInit = {
            url: "/api/auth/session",
            requestInit: {
                method: "GET",
                signal: signal?.signal
            }
        };
        return await Fetch.execute(payload)
    }
}
