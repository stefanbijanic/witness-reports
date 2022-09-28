import {Application} from "express";
import ApplicationResources from "./common/application-resources.interface";
import Routers from "./common/router.interface";

export default class Router {
    static setRoutes(application: Application, resources: ApplicationResources, routers: Routers[]) {
        for (const router of routers) {
            router.setupRoutes(application, resources);
        }
    }
}