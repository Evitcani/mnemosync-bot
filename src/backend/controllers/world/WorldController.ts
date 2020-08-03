import {injectable} from "inversify";
import {Collection, Message} from "discord.js";
import {WorldRelatedClientResponses} from "../../../shared/documentation/client-responses/information/WorldRelatedClientResponses";
import {API} from "../base/API";
import {APIConfig} from "../base/APIConfig";
import {WorldDTO} from "@evitcani/mnemoshared/dist/src/dto/model/WorldDTO";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";
import {DataDTO} from "@evitcani/mnemoshared/dist/src/dto/model/DataDTO";
import {DTOType} from "@evitcani/mnemoshared/dist/src/dto/DTOType";

@injectable()
export class WorldController extends API<WorldDTO> {
    /**
     * Constructs this controller.
     */
    constructor() {
        super(APIConfig.GET());
    }

    public async getById(id: string): Promise<WorldDTO> {
        return this.get(`/worlds/${id}`).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    /**
     * Creates a new world.
     *
     * @param world The world to create.
     */
    public async create(world: WorldDTO): Promise<WorldDTO> {
        let config = APIConfig.GET();
        let data: DataDTO = {};
        data.data = [];
        data.data.push(world);
        config.data = data;

        return this.post(`/worlds`, config).then((res) => {
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
        let worlds: WorldDTO[] = [], world: WorldDTO;
        if (user.defaultWorldId != null) {
            world = await this.getById(user.defaultWorldId);
            worlds.push(world);
        }

        if (user.defaultCharacterId != null) {
            let tempWorlds: WorldDTO[] = await this.getByCharacterId(user.defaultCharacterId);
            if (!!tempWorlds && tempWorlds.length > 0) {
                worlds.concat(tempWorlds);
            }
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
        let config = APIConfig.GET();
        config.params = {
            name: name,
            discord_id: user.discord_id
        };

        return this.get(`/worlds`, config).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.error("Caught error.");
            console.error(err);
            return null;
        });
    }

    /**
     * Gets all parties in the given guild with a name similar.
     *
     * @param characterId
     */
    public getByCharacterId(characterId: string): Promise<WorldDTO[]> {
        let config = APIConfig.GET();
        config.params = {
            character_id: characterId
        };

        return this.get(`/worlds`, config).then((res) => {
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
     * @param id The discord ID of the world to get.
     */
    public getDiscordId(id: string): Promise<Collection<string, string>> {
        // TODO: fix this
        return this.get(`/worlds/${id}/user`).then((res) => {
            // @ts-ignore
            return res.data.data;
        }).catch((err: Error) => {
            console.log("Caught error.");
            console.error(err);
            return null;
        });
    }

    public async addWorld(user: UserDTO, world: WorldDTO): Promise<WorldDTO> {
        let config = APIConfig.GET();
        config.params = {
            discord_id: user.discord_id
        };

        return this.post(`/worlds/${world.id}`, config).then((res) => {
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