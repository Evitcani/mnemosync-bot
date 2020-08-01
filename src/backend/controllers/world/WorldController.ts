import {injectable} from "inversify";
import {Collection, Message} from "discord.js";
import {WorldRelatedClientResponses} from "../../../shared/documentation/client-responses/information/WorldRelatedClientResponses";
import {WorldDTO} from "../../api/dto/model/WorldDTO";
import {UserDTO} from "../../api/dto/model/UserDTO";
import {API} from "../../api/controller/base/API";
import {apiConfig} from "../../api/controller/base/APIConfig";
import {DataDTO} from "../../api/dto/model/DataDTO";
import {DTOType} from "../../api/dto/DTOType";

@injectable()
export class WorldController extends API {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(apiConfig);
    }

    /**
     * Creates a new world.
     *
     * @param world The world to create.
     */
    public async create(world: WorldDTO): Promise<WorldDTO> {
        let config = apiConfig;
        let data: DataDTO = {};
        data.data = [];
        data.data.push(world);
        config.data = data;

        return this.post(`/world`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error trying to create new world.");
            console.error(err);
            return null;
        });
    }

    public async worldSelectionFromUser(user: UserDTO, message: Message): Promise<WorldDTO> {
        // If the default world is not null, then add the character on that world.
        let worlds: WorldDTO[] = [];
        if (user.defaultWorld != null) {
            worlds.push(user.defaultWorld);
        }

        if (user.defaultCharacter != null && user.defaultCharacter.party != null && user.defaultCharacter.party.world != null) {
            worlds.push(user.defaultCharacter.party.world);
        }

        if (worlds.length < 1) {
            await message.channel.send("No world to choose from!");
            return Promise.resolve(null);
        }

        // No selection needed.
        if (worlds.length == 1) {
            return Promise.resolve(worlds[0]);
        }

        return this.worldSelection(worlds, message);
    }

    public async worldSelection(worlds: WorldDTO[], message: Message): Promise<WorldDTO> {
        return message.channel.send(WorldRelatedClientResponses.SELECT_WORLD(worlds, "switch")).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed world processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice >= worlds.length || choice < 0) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return worlds[choice];
            }).catch(()=> {
                msg.delete({reason: "Removed world processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param name The name of the world to get.
     * @param user
     */
    public getByNameAndUser(name: string, user: UserDTO): Promise<WorldDTO[]> {
        let config = apiConfig;
        config.params = {
            name: name,
            discord_id: user.discord_id
        };

        return this.get(`/worlds`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param id The name of the world to get.
     * @param user
     */
    public getDiscordId(id: string): Promise<Collection<string, string>> {
        // TODO: fix this
        return this.get(`/world/${id}/user`).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public async addWorld(user: UserDTO, world: WorldDTO): Promise<WorldDTO> {
        let config = apiConfig;
        config.params = {
            discord_id: user.discord_id
        };

        return this.post(`/worlds/${world.id}`, config).then((res) => {
            console.log(res.data);
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public static isWorld(obj: any): obj is WorldDTO {
        return ((obj as WorldDTO).dtoType == DTOType.WORLD);
    }
}