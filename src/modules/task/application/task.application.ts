import { TaskRepository } from "../domain/repositories/task.repository";
import Task from "../domain/roots/task.domain";

export default class TaskApplication {
    private readonly taskRepository;

    constructor(repository: TaskRepository) {
        this.taskRepository = repository;
    }

    save(task: Task) {
        return this.taskRepository.save(task);
    }

    getAll() {
        return this.taskRepository.getAll();
    }

    getById(id: string) {
        return this.taskRepository.getById(id);
    }

    getByTitle(title: string, page: number, pageSize: number) {
        return this.taskRepository.getByTitle(title, page, pageSize);
    }

    getByDraft(page: number, pageSize: number) {
        return this.taskRepository.getByDraft(page, pageSize);
    }

    getByDeletedAt(page: number, pageSize: number) {
        return this.taskRepository.getByDeletedAt(page, pageSize);
    }

    getByPage(page: number, pageSize: number) {
        return this.taskRepository.getByPage(page, pageSize);
    }

    getCountPending(idUser: string) {
        return this.taskRepository.getCountPending(idUser);
    }
}
