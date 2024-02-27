import { TaskRepository } from "../domain/repositories/task.repository";
import Task from "../domain/roots/task.domain";
import { FilterDtoFromDataToResponse } from "./response/filter.dto";
import { TypePagination } from "../../../core/application/dto/TypePagination";

export default class TaskApplication {
    private readonly taskRepository;

    constructor(repository: TaskRepository) {
        this.taskRepository = repository;
    }

    async save(task: Task) {
        return await this.taskRepository.save(task);
    }

    async getById(id: string) {
        return await this.taskRepository.getById(id);
    }

    async getCountPending(userId: string) {
        return await this.taskRepository.getCountPending(userId);
    }

    async filter(userId: string, filter: Partial<FilterDtoFromDataToResponse>, pagination: TypePagination, sort: "asc" | "desc") {
        return await this.taskRepository.getFilter(userId, filter, pagination, sort);
    }

    async onlyFilter(userId: string, filter: Partial<FilterDtoFromDataToResponse>, pagination: TypePagination, sort: "asc" | "desc") {
        return await this.taskRepository.getOnlyFilter(userId, filter, pagination, sort);
    }

    async remove(task: Task) {
        return await this.taskRepository.save(task);
    }

    async update(task: Task) {
        return await this.taskRepository.save(task);
    }
}
