type ResultFormat = {
    success: boolean,
    data: object,
    optional: object | null
};

export default class ResponseApi {
    static success(payload: object, optional: object | null = null): ResultFormat {
        return {
            success: true,
            data: payload,
            optional
        }
    }

    static error(payload: object, optional: object | null = null): ResultFormat {
        return {
            success: false,
            data: payload,
            optional
        }
    }
}
