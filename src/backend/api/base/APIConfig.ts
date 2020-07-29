import * as qs from "qs";
import { PathLike } from "fs";
import {AxiosRequestConfig} from "axios";

export const apiConfig: AxiosRequestConfig = {
    withCredentials: true,
    timeout: 30000,
    baseURL: "https://party-management-api.herokuapp.com/api",
    headers: {
        common: {
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    },
    paramsSerializer: (params: PathLike) => qs.stringify(params, { indices: false }),
};