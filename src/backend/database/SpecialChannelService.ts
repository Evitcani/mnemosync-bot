import {inject, injectable} from "inversify";
import {DatabaseService} from "./base/DatabaseService";
import {TYPES} from "../../types";
import {StringUtility} from "../utilities/StringUtility";
import {SpecialChannel} from "../../entity/SpecialChannel";
import {SpecialChannelDesignation} from "../../shared/enums/SpecialChannelDesignation";

@injectable()
export class SpecialChannelService {
    public static TABLE_NAME = "special_channels";
    /** Connection to the database object. */
    private databaseService: DatabaseService;

    constructor(@inject(TYPES.DatabaseService) databaseService: DatabaseService) {
        this.databaseService = databaseService;
    }

    public async getSpecialChannel(guildId: string, channelDesignation: SpecialChannelDesignation): Promise<SpecialChannel> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);

        // Construct query.
        let query = `SELECT * FROM ${SpecialChannelService.TABLE_NAME} WHERE guild_id = ${sanitizedGuildId} AND designation = ${channelDesignation}`;

        // Construct query.
        return this.databaseService.query(query).then((res) => {
            if (res.rowCount <= 0) {
                return null;
            }

            // @ts-ignore
            const result: SpecialChannel = res.rows[0];

            return result;
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not get the special channel for the guild. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }

    public async addSpecialChannel(guildId: string, channelDesignation: SpecialChannelDesignation, channelId: string): Promise<SpecialChannel> {
        // First check if there's already an entry.
        return this.getSpecialChannel(guildId, channelDesignation).then((channel) => {
            if (channel != null) {
                return this.updateSpecialChannel(guildId, channelDesignation, channelId);
            }

            // Sanitize inputs.
            const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);
            const sanitizedChannelId = StringUtility.escapeMySQLInput(channelId);

            // Construct query.
            let query = `INSERT INTO ${SpecialChannelService.TABLE_NAME} (guild_id, designation, channel_id) VALUES (${sanitizedGuildId}, ${channelDesignation}, ${sanitizedChannelId})`;

            // Construct query.
            return this.databaseService.query(query).then(() => {
                return this.getSpecialChannel(guildId, channelDesignation);
            }).catch((err: Error) => {
                console.log("QUERY USED: " + query);
                console.log("ERROR: Could not add the new special channel. ::: " + err.message);
                console.log(err.stack);
                return null;
            });
        });
    }

    /**
     * Updates the special channel for the designation.
     *
     * @param guildId
     * @param channelDesignation
     * @param channelId
     */
    private async updateSpecialChannel (guildId: string, channelDesignation: SpecialChannelDesignation, channelId: string): Promise<SpecialChannel> {
        // Sanitize inputs.
        const sanitizedGuildId = StringUtility.escapeMySQLInput(guildId);
        const sanitizedChannelId = StringUtility.escapeMySQLInput(channelId);

        // Construct query.
        let query = `UPDATE ${SpecialChannelService.TABLE_NAME} SET channel_id = ${sanitizedChannelId} WHERE guild_id = ${sanitizedGuildId} AND designation = ${channelDesignation}`;

        // Construct query.
        return this.databaseService.query(query).then(() => {
            return this.getSpecialChannel(guildId, channelDesignation);
        }).catch((err: Error) => {
            console.log("QUERY USED: " + query);
            console.log("ERROR: Could not update the special channel. ::: " + err.message);
            console.log(err.stack);
            return null;
        });
    }
}