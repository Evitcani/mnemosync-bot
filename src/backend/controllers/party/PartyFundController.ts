import {injectable} from "inversify";
import {PartyFundDTO} from "../../api/dto/model/PartyFundDTO";
import {PartyDTO} from "../../api/dto/model/PartyDTO";
import {API} from "../base/API";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {DTOType} from "../../api/dto/DTOType";
import {APIConfig} from "../base/APIConfig";

@injectable()
export class PartyFundController extends API<PartyFundDTO> {
    constructor() {
        super(APIConfig.GET());
    }

    /**
     * Creates a new party fund for the given party and type.
     *
     * @param partyId
     * @param type The type of fund this is.
     */
    public async createNew(partyId: number, type: string): Promise<PartyFundDTO> {
        let fund: PartyFundDTO = {dtoType: DTOType.PARTY_FUND};
        fund.type = type;
        fund.party = {dtoType: DTOType.PARTY};
        fund.copper = 0;
        fund.silver = 0;
        fund.gold = 0;
        fund.platinum = 0;

        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(fund);
        config.data = data;

        return this.post(`/parties/${partyId}/funds`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new party fund.");
            console.error(err);
            return null;
        });
    }

    public async getByPartyAndType(partyId: number, type: string): Promise<PartyFundDTO> {
        if (!partyId) {
            return Promise.resolve(null);
        }

        if (type == null) {
           type = "FUND";
        }

        type = type.toLowerCase();
        let config = APIConfig.GET();
        config.params = {
            type: type
        };

        return this.get(`/parties/${partyId}/funds`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            let funds: PartyFundDTO[] = res.data.data;
            if (!funds || funds.length <= 0) {
                return null;
            }
            return funds[0];
        }).catch((err: Error) => {
            console.log("Caught error trying to get fund.");
            console.error(err);
            return null;
        });
    }

    public async updateFunds (partyId: number, fund: PartyFundDTO): Promise<PartyFundDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(fund);
        config.data = data;

        return this.post(`/parties/${partyId}/funds/${fund.id}`, config)
            .then((res) => {
                console.log(res.data);
                // @ts-ignore
                return res.data.data;
            }).catch((err: Error) => {
                console.log("Caught error trying to update fund.");
                console.error(err);
                return null;
            });
    }
}