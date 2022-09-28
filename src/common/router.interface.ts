import {Application} from "express";
import ApplicationResources from "./application-resources.interface";

export default interface Routers {
    setupRoutes(application: Application, resources: ApplicationResources);
}