import {getManager, Repository} from "typeorm";
import {Table} from "../documentation/databases/Table";
import {Party} from "../entity/Party";
import {injectable} from "inversify";

@injectable()
export class PartyController {
    /**
     * Creates a new party in the server with the given name.
     *
     * @param partyName The name of the party.
     * @param guildId The ID of the guild for this party to live in.
     * @param discordId The discord id of the creator.
     */
    public create(partyName: string, guildId: string, discordId: string): Promise<Party> {
        const party = new Party();
        party.name = partyName;
        party.guildId = guildId;
        party.creatorDiscordId = discordId;

        return PartyController.getRepo().save(party).then((party) => {
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not create new party.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets the party by the ID.
     *
     * @param id The ID of the party.
     */
    public getById (id: number): Promise<Party> {
        return PartyController.getRepo().findOne({where: {id: id}}).then((party) => {
            if (party == undefined) {
                return null;
            }
            return party;
        })
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param partyName The name of the party to get.
     * @param guildId The ID of the guild the party lives in.
     */
    public getByNameAndGuild(partyName: string, guildId: string): Promise<Party | Party[]> {
        return PartyController.getRepo()
            .createQueryBuilder(Table.PARTY)
            .where("guild_id = :id AND LOWER(name) LIKE LOWER('%:name%')",
                { id: guildId, name: partyName })
            .getMany()
            .then((parties) => {
                if (parties == null || parties.length < 1) {
                    return null;
                }

                if (parties.length < 2) {
                    return parties[0];
                }

                return parties;
            })
            .catch((err: Error) => {
                console.error("ERR ::: Could not get parties.");
                console.error(err);
                return null;
            });
    }

    /**
     * Gets the repo.
     */
    private static getRepo(): Repository<Party> {
        return getManager().getRepository(Table.PARTY);
    }
}