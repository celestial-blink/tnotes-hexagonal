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

const infrastructure = new NoteInfrastructure();
const application = new NoteApplication(infrastructure);
const noteController = new NoteController(application);

class NoteRouter {
    router: Router;
    noteController: NoteController;

    constructor() {
        this.router = Router();
        this.addRoutes();
    }

    private addRoutes() {
        this.router.post(
            "/insert",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new NoteInsertDto() }),
            noteController.save.bind(noteController)
        );

        this.router.get(
            "/id/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteIdDto() }),
            noteController.getById.bind(noteController)
        );

        this.router.get(
            "/title/:title/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteTitleDto() }),
            noteController.getByTitle.bind(noteController)
        );

        this.router.get(
            "/draft/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NotePageDto() }),
            noteController.getByDraft.bind(noteController)
        );

        this.router.get(
            "/deleted/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NotePageDto() }),
            noteController.getByDeletedAt.bind(noteController)
        );

        this.router.get(
            "/page/:page/:pageSize",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NotePageDto() }),
            noteController.getByPage.bind(noteController)
        );

        this.router.get(
            "/last-notes",
            AuthenticationMiddleware.canActive,
            noteController.getLastNotes.bind(noteController)
        );
    }
}

export default new NoteRouter().router;
