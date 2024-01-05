import { Router } from "express";
import NoteController from "./note.controller";
import NoteApplication from "../application/note.application";
import NoteInfrastructure from "../infrastructure/note.infrastructure";
import Validator from "../../../core/presentation/middleware/validator";
import NoteInsertDto from "./dtos/request/note.insert.dto";
import NoteIdDto from "./dtos/request/note.id.dto";
import NoteTitleDto from "./dtos/request/note.title.dto";
import NotePageDto from "./dtos/request/note.page";
import AuthenticationMiddleware from "../../../core/presentation/middleware/authentication.middleware";

class NoteRouter {
    router: Router;
    noteController: NoteController;

    constructor() {
        this.router = Router();
        const infrastructure = new NoteInfrastructure();
        const application = new NoteApplication(infrastructure);
        this.noteController = new NoteController(application);

        this.addRoutes();
    }

    addRoutes() {
        this.router.post(
            "/insert",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new NoteInsertDto() }),
            this.noteController.save.bind(this.noteController)
        )

        this.router.get(
            "/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteIdDto() }),
            this.noteController.getById.bind(this.noteController)
        )

        this.router.get(
            "/:title/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteTitleDto() }),
            this.noteController.getByTitle.bind(this.noteController)
        )

        this.router.get(
            "/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NotePageDto() }),
            this.noteController.getByDraft.bind(this.noteController)
        )

        this.router.get(
            "/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NotePageDto() }),
            this.noteController.getByDeletedAt.bind(this.noteController)
        )

        this.router.get(
            "/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NotePageDto() }),
            this.noteController.getByPage.bind(this.noteController)
        )
    }
}

export default new NoteRouter().router;
