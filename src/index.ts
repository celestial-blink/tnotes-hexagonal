import App from "./app";
import ServerBootstrap from "./bootstrap/server.bootstrap";

const app = new App();
const server = new ServerBootstrap(app.getApp());

(async () => {
    try {
        console.log("Starting server...");
        const promises: Array<Promise<boolean | Error>> = [server.initialize()];
        await Promise.all(promises);
    } catch (error) {
        console.log(error);
        server.close();
    }
})();

