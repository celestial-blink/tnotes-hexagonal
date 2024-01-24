import Task from "../roots/task.domain";
import { TaskResult, TaskDomainResult, TaskGetAndTotal, getCountPendingResult } from "../../infrastructure/task.infrastructure";

export interface TaskRepository {
    save(note: Task): Promise<TaskResult>;
    getAll(): Promise<TaskResult>;
    getById(id: string): Promise<TaskDomainResult>;
    getByTitle(title: string, page: number, pageSize: number): Promise<TaskGetAndTotal>;
    getByDraft(page: number, pageSize: number): Promise<TaskGetAndTotal>;
    getByDeletedAt(page: number, pageSize: number): Promise<TaskGetAndTotal>;
    getByComplete(page: number, pageSize: number): Promise<TaskGetAndTotal>;
    getByEndDate(page: number, pageSize: number): Promise<TaskGetAndTotal>;
    getByPage(page: number, pageSize: number): Promise<TaskGetAndTotal>;
    getCountPending(idUser: string): Promise<getCountPendingResult>;
}
