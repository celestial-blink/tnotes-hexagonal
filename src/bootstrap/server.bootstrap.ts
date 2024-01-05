import { Application } from "express";
import http from "http";

import Parameters from "../core/helpers/parameters";
import { Bootstrap } from "./bootstrap";

export default class ServerBootstrap implements Bootstrap {
    private readonly app: Application;

    constructor(app: Application) {
        this.app = app;
    }

    initialize(): Promise<boolean | Error> {
        return new Promise((resolve, reject) => {
            const server = http.createServer(this.app);
            server.listen(Parameters.PORT)
            .on('listening', () => {
              console.log(`Server is running on port ${Parameters.PORT}`);
              resolve(true);
            })
            .on('error', (error: Error) => {
              reject(error);
            });
        });
    }
    close(): void {
        process.exit(1);
    }
    
}