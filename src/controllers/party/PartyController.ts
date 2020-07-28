import {Table} from "../../documentation/databases/Table";
import {Party} from "../../entity/Party";
import {injectable} from "inversify";
import {AbstractController} from "../Base/AbstractController";
import {NameValuePair} from "../Base/NameValuePair";
import {World} from "../../entity/World";
import {Subcommands} from "../../documentation/commands/Subcommands";
import {Command} from "../../models/generic/Command";
import {Message} from "discord.js";
import {User} from "../../entity/User";
import {WorldRelatedClientResponses} from "../../documentation/client-responses/information/WorldRelatedClientResponses";
import {PartyRelatedClientResponses} from "../../documentation/client-responses/information/PartyRelatedClientResponses";

@injectable()
export class PartyController extends AbstractController<Party> {
    constructor() {
        super(Table.PARTY);
    }

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

        return this.getRepo().save(party).then((party) => {
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not create new party.");
            console.error(err);
            return null;
        });
    }

    public save (party: Party): Promise<Party> {
        return this.getRepo().save(party).then((party) => {
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not save party.");
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
        return this.getRepo().findOne({where: {id: id}}).then((party) => {
            if (party == undefined) {
                return null;
            }
            return party;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get party.");
            console.error(err);
            return null;
        });
    }

    public getByGuild (guildId: string): Promise<Party[]> {
        return this.getRepo().find({where: {guildId: guildId}}).then((parties) => {
            if (parties == undefined) {
                return null;
            }
            return parties;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get parties in guild.");
            console.error(err);
            return null;
        });
    }

    public getByWorld (world: World): Promise<Party[]> {
        return this.getRepo().find({where: {world: world}}).then((parties) => {
            if (parties == undefined || parties.length < 1) {
                return null;
            }
            return parties;
        }).catch((err: Error) => {
            console.error("ERR ::: Could not get parties in world.");
            console.error(err);
            return null;
        });
    }

    public updatePartyWorld (party: Party, world: World): Promise<Party> {
        party.world = world;
        return this.getRepo().save(party);
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param partyName The name of the party to get.
     * @param guildId The ID of the guild the party lives in.
     */
    public getByNameAndGuild(partyName: string, guildId: string): Promise<Party[]> {
        return this.getLikeArgs(
            [new NameValuePair("guild_id", guildId)],
            [new NameValuePair("name", partyName)])
            .catch((err: Error) => {
                console.error("ERR ::: Could not get parties.");
                console.error(err);
                return null;
            });
    }

    public async getPartyBasedOnInputOrUser(command: Command, message: Message, user: User, action: string): Promise<Party> {
        // Check the user has assigned a party or has one.
        let parties: Party[] = null;
        if (Subcommands.PARTY.isCommand(command)) {
            let ptCmd = Subcommands.PARTY.getCommand(command);
            if (ptCmd.getInput() != null) {
                parties = await this.getByNameAndGuild(ptCmd.getInput(), message.guild.id);
            }
        }

        if (parties == null) {
            parties = [];
            if (user.defaultCharacter != null && user.defaultCharacter.party != null) {
                parties.push(user.defaultCharacter.party);
            }

            if (user.defaultParty != null) {
                parties.push(user.defaultParty);
            }
        }

        // Nothing to return.
        if (parties.length <= 0) {
            return Promise.resolve(null);
        }

        // No need to ask the user which one they want to use.
        if (parties.length == 1) {
            return Promise.resolve(parties[0]);
        }

        return this.partySelection(parties, action, message);
    }

    public async partySelection(parties: Party[], action: string, message: Message): Promise<Party> {
        return message.channel.send(PartyRelatedClientResponses.SELECT_PARTY(parties, action)).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed party processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= parties.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return parties[choice];
            }).catch(()=> {
                msg.delete({reason: "Removed party processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }
}