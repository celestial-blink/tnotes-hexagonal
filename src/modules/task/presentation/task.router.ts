import { Router } from "express";

import TaskApplication from "../application/task.application";
import TaskInfrastructure from "../infrastructure/task.infrastructure";
import TaskController from "./task.controller";
import Validator from "../../../core/presentation/middleware/validator";
import TaskSaveDto from "./dto/request/task-save.dto";
import TaskIdDto from "./dto/request/task-id.dto";
import TaskPageDto from "./dto/request/task-page.dto";
import TaskTitleDto from "./dto/request/task-title.dto";
import AuthenticationMiddleware from "../../../core/presentation/middleware/authentication.middleware";

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
            "/eliminated/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new TaskPageDto() }),
            this.taskController.getByDeletedAt.bind(this.taskController)
        );

        this.router.get(
            "/drafts/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new TaskPageDto() }),
            this.taskController.getByDraft.bind(this.taskController)
        );

        this.router.get(
            "/drafts/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new TaskTitleDto() }),
            this.taskController.getByTitle.bind(this.taskController)
        );

        this.router.get(
            "/page/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new TaskPageDto() }),
            this.taskController.getByPage.bind(this.taskController)
        );

        this.router.get(
            "/count-pending",
            AuthenticationMiddleware.canActive,
            this.taskController.getCountPending.bind(this.taskController)
        );
    }

    getRouter(): Router {
        return this.router;
    }
}

export default new TaskRouter().getRouter();
