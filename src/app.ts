import cors from "cors";
import express, { Application } from "express";
import helmet from "helmet";
import userRouter from "./modules/user/presentation/user.router";
import HandleErrors from "./core/helpers/handle-errors";
import noteRouter from "./modules/note/presentation/note.router";
import TaskRouter from "./modules/task/presentation/task.router";
import authRouter from "./modules/auth/presentation/auth.router";

export default class App {
    private readonly app: Application;
    constructor() {
        this.app = express();
        this.mountMiddlewares();
        this.mountRoutes();
        this.mountHandleErrors();
    }

    mountMiddlewares(): void {
        this.app.use(cors());
        this.app.use(helmet());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    mountRoutes(): void {
        this.app.use("/auth", authRouter);
        this.app.use("/user", userRouter);
        this.app.use("/note", noteRouter);
        this.app.use("/task", TaskRouter);
    }

    mountHandleErrors(): void {
        this.app.use(HandleErrors.notFound);
        this.app.use(HandleErrors.generic);
    }

    getApp(): Application {
        return this.app
    }
}
