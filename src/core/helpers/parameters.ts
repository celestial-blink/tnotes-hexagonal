import { addMinutes } from "date-fns";

export default class Parameters {
    static get ENVIRONMENT() {
        return process.env.NODE_ENV || "development";
    }

    static get PORT() {
        return process.env.PORT || "1112";
    }

    static get TOKEN_SECRET_KEY() {
        return process.env.TOKEN_SECRET_KEY || "vGPQ13s=<j2F";
    }

    static get REFRESH_TOKEN_SECRET_KEY() {
        return process.env.REFRESH_TOKEN_SECRET_KEY || "jK?l1*45OW8:";
    }

    static get TOKEN_EXPIRES_TIME() {
        return addMinutes(Date.now(), (Number(process.env.TIME_EXPIRES_TIME) || 3)).getTime();
    }

    static get REFRESH_TOKEN_EXPIRES_TIME() {
        return Date.now() + (Number(process.env.TIME_EXPIRES_TIME) || (2 * 24 * 60 * 60 * 1000));
    }

    static get REFRESH_TOKEN_COOKIE_OPTIONS() {
        return { maxAge: Date.now() + (2 * 24 * 60 * 60 * 1000), httpOnly: true, secure: true };
    }

    static get FILTER_PER_PAGE() {
        return 8;
    }
}
