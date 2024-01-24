export type CountPendingFromDataToResponse = {
    total: number;
    totalComplete: number;
}

export default class CountPendingDto {
    static fromDataToResponse(total: number, totalComplete: number): CountPendingFromDataToResponse {
        return {
            total,
            totalComplete
        }
    }
}
