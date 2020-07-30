import axios, {AxiosError, AxiosInstance, AxiosResponse} from "axios";
import {AxiosRequestConfig} from "axios";
import {injectable, unmanaged} from "inversify";
import {Authorization} from "./Authorization";

@injectable()
export class API {
    private api: AxiosInstance;
    /**
     * Creates an instance of Api.
     *
     * @param [config] - axios configuration.
     */
    public constructor (@unmanaged() config?: AxiosRequestConfig) {
        this.api = axios.create(config);

        this.api.interceptors.request.use(async (param: AxiosRequestConfig) => {
            let auth = await Authorization.AUTHORIZE();
            return {
                baseUrl: process.env.API_BASE_URL,
                headers: {
                    common: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        Pragma: "no-cache",
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                    authorization: auth,
                },
                ...param
            };
        });
    }

    /**
     * Get Uri
     *
     * @param config
     * @returns {string}
     * @memberof Api
     */
    public getUri (config?: AxiosRequestConfig): string {
        return this.api.getUri(config);
    }

    /**
     * Generic request.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP axios response payload.
     * @memberof Api
     *
     * @example
     * api.request({
     *   method: "GET|POST|DELETE|PUT|PATCH"
     *   baseUrl: "http://www.domain.com",
     *   url: "/api/v1/users",
     *   headers: {
     *     "Content-Type": "application/json"
     *  }
     * }).then((response: AxiosResponse<User>) => response.data)
     *
     */
    public request<T, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R> {
        return this.api.request(config);
    }

    /**
     * HTTP GET method, used to fetch data `statusCode`: 200.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} HTTP `axios` response payload.
     * @memberof Api
     */
    public get<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.get(url, config);
    }

    /**
     * HTTP DELETE method, `statusCode`: 204 No Content.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public delete<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.delete(url, config);
    }

    /**
     * HTTP HEAD method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public head<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
        return this.api.head(url, config);
    }

    /**
     * HTTP POST method `statusCode`: 201 Created.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public post<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
        return this.api.post(url, data, config);
    }

    /**
     * HTTP PUT method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public put<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
        return this.api.put(url, data, config);
    }

    /**
     * HTTP PATCH method.
     *
     * @access public
     * @template T - `TYPE`: expected object.
     * @template B - `BODY`: body request object.
     * @template R - `RESPONSE`: expected object inside a axios response format.
     * @param {string} url - endpoint you want to reach.
     * @param {B} data - payload to be send as the `request body`,
     * @param [config] - axios request configuration.
     * @returns {Promise<R>} - HTTP [axios] response payload.
     * @memberof Api
     */
    public patch<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
        return this.api.patch(url, data, config);
    }

    /**
     *
     * @template T - type.
     * @param response - axios response.
     * @returns {T} - expected object.
     * @memberof Api
     */
    public success<T> (response: AxiosResponse<T>): T {
        return response.data;
    }

    public error (error: AxiosError<Error>) {
        throw error;
    }
}