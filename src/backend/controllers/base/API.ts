import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import {injectable, unmanaged} from "inversify";
import {Authorization} from "./Authorization";
import {Message, MessageEmbed} from "discord.js";
import {APIConfig} from "./APIConfig";
import {messageEmbed} from "../../../shared/documentation/messages/MessageEmbed";
import {DataDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DataDTO";

@injectable()
export class API<U extends {id?: any}> {
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
            let ret = {
                baseUrl: process.env.API_BASE_URL,
                headers: {
                    common: {
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        Pragma: "no-cache",
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                },
                ...param
            };
            ret.headers.common['Authorization'] = auth;
            return ret;
        });
    }

    /**
     * Get Uri
     *
     * @param config
     * @returns {string}
     * @memberof Api
     */
    protected getUri (config?: AxiosRequestConfig): string {
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
    protected request<T, R = AxiosResponse<T>> (config: AxiosRequestConfig): Promise<R> {
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
    protected get<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
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
    protected delete<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
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
    protected head<T, R = AxiosResponse<T>> (url: string, config?: AxiosRequestConfig): Promise<R> {
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
    protected post<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
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
    protected put<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
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
    protected patch<T, B, R = AxiosResponse<T>> (url: string, data?: B, config?: AxiosRequestConfig): Promise<R> {
        return this.api.patch(url, data, config);
    }

    /**
     *
     * @template T - type.
     * @param response - axios response.
     * @returns {T} - expected object.
     * @memberof Api
     */
    protected success<T> (response: AxiosResponse<T>): T {
        return response.data;
    }

    protected error (error: AxiosError<Error>) {
        throw error;
    }

    protected async getByParams(url: string, params?: any): Promise<U> {
        let config = APIConfig.GET();
        config.params = params;

        return this.get(url, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get item.");
            console.error(err);
            return null;
        });
    }

    protected async getAll(url: string, params?: any): Promise<U[]> {
        let config = APIConfig.GET();
        if (!!params) {
            config.params = params;
        }

        return this.get(url, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to get item.");
            console.error(err);
            return null;
        });
    }

    protected async create(item: U, url: string, params?: any): Promise<U> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(item);
        config.data = data;
        config.params = params;

        return this.post(url, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new item.");
            console.error(err);
            return null;
        });
    }

    protected async save(item: U, url: string, params?: any): Promise<U> {
        if (!item.id) {
            return this.create(item, url, params);
        }

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(item);
        config.data = data;
        config.params = params;

        return this.put(url, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to update item.");
            console.error(err);
            return null;
        });
    }

    protected async selection(items: U[], action: string,
                              type: {singular: string, plural: string}, message: Message): Promise<U> {
        let embed: MessageEmbed = messageEmbed.generic.select_from_the_following(type, action, items);

        return message.channel.send(embed).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= items.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return items[choice];
            }).catch(()=> {
                msg.delete({reason: "Removed processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }
}