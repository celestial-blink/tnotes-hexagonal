import Task from "../roots/task.domain";
import { TaskResult, TaskDomainResult, getCountPendingResult, TaskFilterResult, TaskOnlyFilterResult } from "../../infrastructure/task.infrastructure";
import { FilterDtoFromDataToResponse } from "../../application/response/filter.dto";
import { TypePagination } from "../../../../core/application/dto/TypePagination";

export interface TaskRepository {
    save(note: Task): Promise<TaskResult>;
    getById(id: string): Promise<TaskDomainResult>;
    getCountPending(userId: string): Promise<getCountPendingResult>;
    getFilter(userId: string, filters: Partial<FilterDtoFromDataToResponse>, pagination: TypePagination, sort: "asc" | "desc"): Promise<TaskFilterResult>
    getOnlyFilter(userId: string, filters: Partial<FilterDtoFromDataToResponse>, pagination: TypePagination, sort: "asc" | "desc"): Promise<TaskOnlyFilterResult>
}
