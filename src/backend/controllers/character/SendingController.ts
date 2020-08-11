import {injectable} from "inversify";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {SendingDTO} from "mnemoshared/dist/src/dto/model/SendingDTO";
import {DataDTO} from "mnemoshared/dist/src/dto/model/DataDTO";

@injectable()
export class SendingController extends API<SendingDTO> {
    public static SENDING_LIMIT = 10;

    constructor() {
        super(APIConfig.GET());
    }

    /**
     * Creates a new sending.
     *
     * @param sending
     */
    protected async create(sending: SendingDTO): Promise<SendingDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(sending);
        config.data = data;

        return this.post(`/sendings`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.error("Caught error trying to create new sending.");
            console.error(err);
            return null;
        });
    }

    public async save(sending: SendingDTO): Promise<SendingDTO> {
        if (!sending) {
            return Promise.resolve(null);
        }

        if (!sending.id) {
            return this.create(sending);
        }

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(sending);
        config.data = data;

        return this.put(`/sendings/${sending.id}`, config).then((res) => {
            // @ts-ignore
            console.log(res.data.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.error("Caught error trying to create new sending.");
            console.error(err);
            return null;
        });
    }

    public async getOne(page: number, worldId: string, toCharacterId?: string): Promise<SendingDTO> {
        return this.getBySpecs(page, 1, worldId, toCharacterId).then((messages) => {
            if (messages == null || messages.length < 1) {
                return null;
            }

            return messages[0];
        });
    }

    public async getAllOf(page: number, worldId: string, toCharacterId?: string): Promise<SendingDTO[]> {
        return this.getBySpecs(page * SendingController.SENDING_LIMIT, SendingController.SENDING_LIMIT,
            worldId, toCharacterId);
    }

    private async getBySpecs(skip: number, limit: number,
                             worldId: string, toCharacterId?: string): Promise<SendingDTO[]> {
        if (!worldId && !toCharacterId) {
            return Promise.resolve(null);
        }

        let params = {
            skip: skip,
            limit: limit,
            world_id: worldId,
            to_character_id: toCharacterId
        };

        return this.getByParameters(params);
    }
    private async getByParameters(params: any): Promise<SendingDTO[]> {
        if (!params) {
            return Promise.resolve(null);
        }

        let config = APIConfig.GET();
        config.params = params;

        return this.get(`/sendings`, config).then((res) => {
            // @ts-ignore
            if (!res || !res.data || !res.data.data) {
                return null;
            }

            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.error("Caught error trying to get sendings.");
            console.error(err);
            return null;
        });
    }
}