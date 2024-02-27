export type FilterDtoFromDataToResponse = {
    id: string,
    title: string,
    createdAt: Date,
    isDraft: boolean,
    endDate: Date,
    isComplete: boolean
}

export default class FilterDto {
    static fromDataToResponse(payload: Partial<FilterDtoFromDataToResponse>): FilterDtoFromDataToResponse {
        return {
            id: payload.id,
            createdAt: payload.createdAt,
            endDate: payload.endDate,
            isComplete: payload.isComplete,
            isDraft: payload.isDraft,
            title: payload.title
        };
    }
}
