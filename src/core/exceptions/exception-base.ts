export enum ExceptionCode {
    /* ----------------------------- infrastructure ----------------------------- */
    dataBaseUserException = "DATABASE_USER_EXCEPTION",
}

export default class ExceptionBase extends Error {
    constructor(message?: string) {
        super(message);
        Object.setPrototypeOf(this, ExceptionBase.prototype);
    }
}
