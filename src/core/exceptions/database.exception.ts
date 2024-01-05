import ExceptionBase, { ExceptionCode } from "./exception-base";

export default class DataBaseException extends ExceptionBase {
    code: string;
    
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, ExceptionBase.prototype);
        this.code = ExceptionCode.dataBaseUserException;
    }
}