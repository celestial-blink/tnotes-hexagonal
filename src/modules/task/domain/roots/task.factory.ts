import { err, ok, Result } from "neverthrow";
import Task, { TaskProperties } from "./task.domain";
import ErrorInterface from "../../../../core/error/error.interface";


export type TaskFactoryResult = Result<Task, Error>

export default class TaskFactory {
    static create(properties: TaskProperties): TaskFactoryResult {
        const noteProperties: TaskProperties = {
            ...properties,
            id: properties.id ?? crypto.randomUUID(),
            createdAt: properties.createdAt ?? new Date(),
            isDraft: false,
            isComplete: false
        }

        let error: ErrorInterface;
        if (noteProperties.title.length > 120) {
            error ??= new Error();
            error.name = "Invalid note.title";
            error.message = "String max 120 characters";
            error.status = 412;
            return err(error);
        }

        if (noteProperties.description.length > 500) {
            error ??= new Error();
            error.name = "Invalid note.description";
            error.message = "String max 500 characters";
            error.status = 412;
            return err(error);
        }

        return ok(new Task(noteProperties));
    }
}
