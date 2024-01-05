import { Router } from "express";

import AuthController from "./auth.controller";
import UserApplication from "../../user/application/user.application";
import UserInfrastructure from "../../user/infrastructure/user.infrastructure";
import AuthApplication from "../application/auth.application";

class AuthRouter {
    router: Router;
    private readonly authController: AuthController;

    constructor() {
        this.router = Router();
        const repository = new UserInfrastructure();
        const application = new UserApplication(repository);
        const authApplication = new AuthApplication(application);
        this.authController = new AuthController(authApplication);

        this.addRoutes();
    }

    addRoutes() {
        this.router.post(
            "/login",
            this.authController.login.bind(this.authController)
        );

        this.router.post(
            "/logout",
            this.authController.logout.bind(this.authController)
        );
    }
}

export default new AuthRouter().router;
