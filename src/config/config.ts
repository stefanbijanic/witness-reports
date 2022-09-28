import ConfigInterface from "../common/config.interface";
import * as dotenv from "dotenv";

const dotEnv = dotenv.config();

if (dotEnv.error) throw ".env configuration error: " + dotEnv.error;

const Config: ConfigInterface = {
    server: {
        port: +(process.env?.SERVER_PORT),
        static: {
            route: "/static",
            path: "./static/",
            cacheControl: false,
            dotfiles: "deny",
            etag: false,
            index: false,
            maxAge: 360000,
        }
    }
}

export default Config