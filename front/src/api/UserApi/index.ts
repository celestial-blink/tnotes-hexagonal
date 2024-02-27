import { Cookie } from "@builder.io/qwik-city";

import Fetch from "~/helpers/fetch";
import config from "~/config";

import { UserProperties } from "./types";

export default class UserApi {
    static async update(user: Partial<UserProperties>, signal: AbortSignal | null, cookie: Cookie) {
        const updatedResult = await Fetch.execute<UserProperties>({
            url: `${config.PATH_BASE_API}user/update`,
            cookie,
            requestInit: {
                method: "PUT",
                signal,
                body: JSON.stringify(user),
            }
        });

        return updatedResult;
    }
}
