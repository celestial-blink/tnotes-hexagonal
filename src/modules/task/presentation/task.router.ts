import { Router } from "express";

import TaskApplication from "../application/task.application";
import TaskInfrastructure from "../infrastructure/task.infrastructure";
import TaskController from "./task.controller";
import Validator from "../../../core/presentation/middleware/validator";
import TaskSaveDto from "./dto/request/task-save.dto";
import TaskIdDto from "./dto/request/task-id.dto";
import AuthenticationMiddleware from "../../../core/presentation/middleware/authentication.middleware";
import TaskFilterDto from "./dto/request/task-filter.dto";
import TaskUpdateDto from "./dto/request/task-update.dto";

class TaskRouter {
    private router: Router;
    private readonly taskController: TaskController;

    constructor() {
        this.router = Router();

        const repository = new TaskInfrastructure();
        const application = new TaskApplication(repository);
        this.taskController = new TaskController(application);

        this.addRoutes();

    }

    addRoutes() {
        this.router.post(
            "/insert",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new TaskSaveDto() }),
            this.taskController.save.bind(this.taskController)
        );

        this.router.get(
            "/id/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new TaskIdDto() }),
            this.taskController.getById.bind(this.taskController)
        );

        this.router.get(
            "/count-pending",
            AuthenticationMiddleware.canActive,
            this.taskController.getCountPending.bind(this.taskController)
        );

        this.router.get(
            "/filter",
            AuthenticationMiddleware.canActive,
            Validator.execute({ query: new TaskFilterDto() }),
            this.taskController.getFilter.bind(this.taskController)
        )

        this.router.get(
            "/only-filter",
            AuthenticationMiddleware.canActive,
            Validator.execute({ query: new TaskFilterDto() }),
            this.taskController.getOnlyFilter.bind(this.taskController)
        )

        this.router.delete(
            "/remove/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new TaskIdDto() }),
            this.taskController.remove.bind(this.taskController)
        )

        this.router.put(
            "/update/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new TaskIdDto(), body: new TaskUpdateDto() }),
            this.taskController.update.bind(this.taskController)
        )
    }

    getRouter(): Router {
        return this.router;
    }
}

export default new TaskRouter().getRouter();
