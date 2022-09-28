
import {Application} from "express";
import ApplicationResources from "../common/application-resources.interface";
import Routers from "../common/router.interface";
import WitnessReportController from "./witness-report.controller";



export default class WitnessReportRouter implements Routers {
    public setupRoutes(app: Application, resources: ApplicationResources) {
        const witnessReportControler = new WitnessReportController(resources);

        app.post("/witness-report", witnessReportControler.createWitnessReport.bind(witnessReportControler));
    }
}