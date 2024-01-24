type ResultFormat = {
    success: boolean,
    data: object
};

export default class ResponseApi {
    static success(payload: object): ResultFormat {
        return {
            success: true,
            data: payload
        }
    }

    static error(payload: object): ResultFormat {
        return {
            success: false,
            data: payload
        }
    }
}
