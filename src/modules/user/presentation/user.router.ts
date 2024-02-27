import { Router } from "express";
import UserController from "./user.controller";
import UserApplication from "../application/user.application";
import UserInfrastructure from "../infrastructure/user.infrastructure";
import Validator from "../../../core/presentation/middleware/validator";
import UserCreateDto from "./dtos/request/user-create.dto";
import AuthenticationMiddleware from "../../../core/presentation/middleware/authentication.middleware";
import UserByPageDto from "./dtos/request/user-by-page.dto";
import UserUpdateDto from "./dtos/request/user-update.dto";

class UserRouter {
    router: Router;
    userController: UserController;

    constructor() {
        this.router = Router();
        const repository = new UserInfrastructure();
        const application = new UserApplication(repository);
        this.userController = new UserController(application);

        this.addRoutes();
    }

    addRoutes() {
        this.router.post(
            "/insert",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new UserCreateDto() }),
            this.userController.insert.bind(this.userController)
        );

        this.router.put(
            "/update",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new UserUpdateDto() }),
            this.userController.update.bind(this.userController)
        );

        this.router.get(
            "/",
            AuthenticationMiddleware.canActive,
            this.userController.getAll.bind(this.userController)
        );

        this.router.get(
            "/page/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new UserByPageDto() }),
            this.userController.getByPage.bind(this.userController)
        );
    }
}

export default new UserRouter().router;
