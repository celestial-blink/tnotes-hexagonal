export type FilterNoteDto = {
    id: string,
    title: string,
    createdAt: Date,
    isDraft: boolean
}

export default class FilterDto {
    static fromDataToResponse(payload: Partial<FilterNoteDto>): FilterNoteDto {
        return {
            id: payload.id,
            createdAt: payload.createdAt,
            isDraft: payload.isDraft,
            title: payload.title
        };
    }
}
