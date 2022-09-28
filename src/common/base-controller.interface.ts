import ApplicationResources from "./application-resources.interface";
import Services from "./services.interface";

export default abstract class BaseController {
    private resources: ApplicationResources;

    constructor(resources: ApplicationResources) {
        this.resources = resources;
    }

    protected get services(): Services | undefined {
        return this.resources.services;
    }
}