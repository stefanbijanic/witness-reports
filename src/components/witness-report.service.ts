import axios from "axios";
import {isPossiblePhoneNumber, isValidPhoneNumber, parsePhoneNumber} from "libphonenumber-js";
import ErrorResponse from "../common/error-response.interface";
import * as dotenv from "dotenv";
var https = require('https');
import * as fs from 'fs';
import { v4 as uuid } from 'uuid';
import WitnessReportEntity from "./witness-report.entity";

const dotEnv = dotenv.config();

if (dotEnv.error) throw ".env configuration error: " + dotEnv.error;

export class PhoneNumberDetails {
    number: string;
    country: string;
}

export default class WitnessReportService {
    public async getFBIMostWanted(title: string): Promise<Object | ErrorResponse> {
        try {
            let result;
            const config= { headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
                "Accept": "application/json",
                "Accept-Language": "en-US,en;q=0.5",
                "Accept-Encoding": "gzip, deflate",
                "Connection": "keep-alive",
                "Upgrade-Insecure-Requests": "1",
                "Sec-Fetch-Dest": "document",
                "Sec-Fetch-Mode": "navigate",
                "Sec-Fetch-Site": "none",
                "Sec-Fetch-User": "?1",
                "Cache-Control": "max-age=0",
            },
            data:{}};
            let response = await axios.get(process.env.FBI_WANTED_URL, config);
            
            for (const report of response.data.items) {
                if (report.title == title) {
                    result = report;
                }
            }
            return result;
        } catch (error) {
            console.log(error)
            return ({
                errorCode: 1001,
                errorMessage: "error most wanted list",
            });
        }
    }

    public async validatePhoneNumber(phoneNumber: string, countryInitials): Promise<PhoneNumberDetails> {
        const parsedPhoneNumber = parsePhoneNumber(phoneNumber, countryInitials)

        if (!isPossiblePhoneNumber(parsedPhoneNumber.number, parsedPhoneNumber.country)) {
            return;
        }
        if (!isValidPhoneNumber(parsedPhoneNumber.formatInternational(), parsedPhoneNumber.country)) {
            return;
        }

        const phoneNumberDetails: PhoneNumberDetails = {
            number: parsedPhoneNumber.number,
            country: parsedPhoneNumber.country,
        }

        return phoneNumberDetails;
    }

    public async checkLocationByIpAddress(ipAddress: string, country: string): Promise<boolean | ErrorResponse> {
        try {
            // !!! IF ON LOCALHOST CHANGE THE 'LOCALHOST_TEST_IP_ADDRESS' IN .env
            // !!! IF ON PRODUCTION USE THE REQUEST ON THE NEXT LINE
            // const checkIp = await axios.get(`https://geo.ipify.org/api/v2/country?apiKey=${process.env?.CHECK_IP_ADDRESS_API_KEY}&ipAddress=${ipAddress}`);
            const checkIp = await axios.get(`${process.env?.IP_ADDRESS_LOCATION_URL}?apiKey=${process.env?.CHECK_IP_ADDRESS_API_KEY}&ipAddress=${process.env?.LOCALHOST_TEST_IP_ADDRESS}`);

            if (country !== checkIp.data.location.country) {
                return;
            }
            return true;
        } catch (error) {
            return ({
                errorCode: 1002,
                errorMessage: "Country verification error",
            });
        }
    }

    public writeReport(data): WitnessReportEntity | ErrorResponse {
        try {
            const date:string = new Date().toISOString().substring(0, 10);
            const reportId:string = uuid();

            const pathName:string = `reports/${data.title} ${date} ${reportId}.txt`;
            const report: string = `Report Title: ${data.title} 
Description: ${data.description} 
Witness phone number: ${data.phoneNumber}
Country: ${data.country}`;

            fs.writeFileSync(pathName, report);

            return ({
                reportTitle: data.title,
                description: data.description,
                witnessPhoneNumber: data.phoneNumber,
                country: data.country,
            })
        } catch (error) {
            return ({
                errorCode: 1003,
                errorMessage: "Report failed",
            });
        }

        
    }
}