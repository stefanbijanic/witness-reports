import BaseController from "../common/base-controller.interface";
import {Request, Response, NextFunction} from "express";

export default class WitnessReportController extends BaseController {
    public async createWitnessReport(req: Request, res: Response, next: NextFunction) {
        const body = req.body;
        const ipAddress = req.socket.remoteAddress;

        const checkLocationByIP = await this.services.witnessReportService.checkLocationByIpAddress(ipAddress, body.country);
        if (!checkLocationByIP) {
            res.status(400).send("Invalid country provided");
            return;
        }

        const phoneNumberDetails = await this.services.witnessReportService.validatePhoneNumber(body.phoneNumber, body.countryInitials);
        if (!phoneNumberDetails) {
            res.status(400).send("Invalid phone number");
            return;
        }

        const fbiMostWantedList = await this.services.witnessReportService.getFBIMostWanted(req.body.title);
        if (!fbiMostWantedList) {
            res.status(400).send("Title does not egzist in FBI database");
            return;
        }

        const writeReport = await this.services.witnessReportService.writeReport(body)
        if (!writeReport) {
            res.status(400).send("Report failed");
            return;
        }
        
        res.send(writeReport);
    }
}