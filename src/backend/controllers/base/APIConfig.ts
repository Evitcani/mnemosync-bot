import * as qs from "qs";
import { PathLike } from "fs";
import {AxiosRequestConfig} from "axios";

export class APIConfig {
    public static GET(): AxiosRequestConfig {
        return {
            withCredentials: true,
                timeout: 30000,
            baseURL: "https://party-management-api.herokuapp.com/api",
            paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
        };
    }
}