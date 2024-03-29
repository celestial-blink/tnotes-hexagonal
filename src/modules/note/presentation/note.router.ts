import { Router } from "express";
import NoteController from "./note.controller";
import NoteApplication from "../application/note.application";
import NoteInfrastructure from "../infrastructure/note.infrastructure";
import Validator from "../../../core/presentation/middleware/validator";
import NoteInsertDto from "./dtos/request/note.insert.dto";
import NoteIdDto from "./dtos/request/note.id.dto";
import AuthenticationMiddleware from "../../../core/presentation/middleware/authentication.middleware";
import NoteFilterDto from "./dtos/request/note-filter.dto";
import NoteUpdateDto from "./dtos/request/note-update.dto";

class NoteRouter {
    private router: Router;
    private readonly noteController: NoteController;

    constructor() {
        this.router = Router();
        const repository = new NoteInfrastructure();
        const application = new NoteApplication(repository);
        this.noteController = new NoteController(application);

        this.addRoutes();
    }

    private addRoutes() {
        this.router.post(
            "/insert",
            AuthenticationMiddleware.canActive,
            Validator.execute({ body: new NoteInsertDto() }),
            this.noteController.save.bind(this.noteController)
        );

        this.router.get(
            "/id/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteIdDto() }),
            this.noteController.getById.bind(this.noteController)
        );

        this.router.get(
            "/last-notes",
            AuthenticationMiddleware.canActive,
            this.noteController.getLastNotes.bind(this.noteController)
        );

        this.router.get(
            "/filter",
            AuthenticationMiddleware.canActive,
            Validator.execute({ query: new NoteFilterDto() }),
            this.noteController.getFilter.bind(this.noteController)
        )

        this.router.delete(
            "/remove/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteIdDto() }),
            this.noteController.remove.bind(this.noteController)
        )

        this.router.put(
            "/update/:id",
            AuthenticationMiddleware.canActive,
            Validator.execute({ params: new NoteIdDto(), body: new NoteUpdateDto() }),
            this.noteController.update.bind(this.noteController)
        )
    }

    getRouter(): Router {
        return this.router;
    }
}

export default new NoteRouter().getRouter();
