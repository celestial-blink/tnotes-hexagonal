export const previous = (current: number, data: Array<number> = []): Array<number> => {
    if (current >= 1 && data.length < 2) {
        data.unshift(current);
        return previous(current - 1, data);
    }
    return data;
};

export const next = (current: number, total: number, data: Array<number> = []): Array<number> => {
    if (current <= total && data.length < 2) {
        data.push(current);
        return next(current + 1, total, data);
    }
    return data;
};

export const generatePages = (total: number, current: number): Array<number> => {
    const previousValues = previous(current - 1);
    const nextValues = next(current + 1, total);
    const prepareResult = [...previousValues, current, ...nextValues];

    return prepareResult;
}
