import * as express from "express";
import "reflect-metadata";
import {createConnection} from "typeorm";
import Config from "./config/config";
import Router from "./router";
import ApplicationResources from "./common/application-resources.interface";
import WitnessReportRouter from "./components/witness-report.router";
import WitnessReportService from "./components/witness-report.service";
async function main() {
    const app: express.Application = express();
    let router = express.Router();

    app.use(express.json());

    app.use(
        Config.server.static.route,
        express.static(Config.server.static.path, {
            index: Config.server.static.index,
            cacheControl: Config.server.static.cacheControl,
            maxAge: Config.server.static.maxAge,
            etag: Config.server.static.etag,
            dotfiles: Config.server.static.dotfiles,
        }),
    );
    
    const resources: ApplicationResources = {};
    resources.services = {
        witnessReportService: new WitnessReportService(),
    }

    Router.setRoutes(app, resources, [
        new WitnessReportRouter(),
    ])

    app.use((req, res) => {
        res.sendStatus(404);
    });

    app.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });

    app.listen(Config.server.port, async () => {
        console.log(`Server running on port ${Config.server.port}`)
    });
}

main();