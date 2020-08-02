import {API} from "../base/API";
import {SpecialChannelDTO} from "../../api/dto/model/SpecialChannelDTO";
import {injectable} from "inversify";
import {APIConfig} from "../base/APIConfig";
import {SpecialChannelDesignation} from "../../../shared/enums/SpecialChannelDesignation";

@injectable()
export class SpecialChannelController extends API<SpecialChannelDTO> {
    constructor() {
        super(APIConfig.GET());
    }

    public async update(specialChannel: SpecialChannelDTO): Promise<SpecialChannelDTO> {
        if (!specialChannel.id) {
            return this.create(specialChannel, `specialChannels`)
        }

        return this.save(specialChannel, `/specialChannels/${specialChannel.id}`);
    }

    public async getByGuildIdAndDesignation(guildId: string, type: SpecialChannelDesignation): Promise<SpecialChannelDTO> {
        let params = {
            guild_id: guildId,
            designation: SpecialChannelDesignation
        };
        return this.getByParams(`/specialChannels`, params);
    }
}