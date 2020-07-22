import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {User} from "../entity/User";
import {Subcommands} from "../documentation/commands/Subcommands";
import {World} from "../entity/World";
import {WorldController} from "../controllers/WorldController";
import {TYPES} from "../types";
import {UserController} from "../controllers/UserController";
import {WorldRelatedClientResponses} from "../documentation/client-responses/WorldRelatedClientResponses";

@injectable()
export class WorldCommandHandler extends AbstractUserCommandHandler {
    private userController: UserController;
    private worldController: WorldController;

    constructor(@inject(TYPES.UserController) userController: UserController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.userController = userController;
        this.worldController = worldController;
    }

    /**
     * Handles the given user command.
     *
     * @param command
     * @param message
     * @param user
     */
    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Command to create a new world.
        const createCmd = Subcommands.CREATE.isCommand(command);
        if (createCmd != null) {
            return this.createWorld(createCmd.getInput(), command, message, user);
        }

        // Command to switch default worlds.
        const switchCmd = Subcommands.SWITCH.isCommand(command);
        if (switchCmd != null) {
            // If the input is null, it means we should remove the default world.
            if (switchCmd.getInput() == null) {
                return this.removeDefaultWorld(message, user);
            }

            return this.switchDefaultWorld(switchCmd.getInput(), message, user);
        }

        return undefined;
    }

    private async switchDefaultWorld(worldName: string, message: Message, user: User): Promise<Message | Message[]> {
        return this.findWorldByName(worldName, user).then((worlds) => {
            if (worlds == null || worlds.length < 1) {
                return message.channel.send("Could not find world with given name like: " + worldName);
            }

            // Only one result.
            if (worlds.length == 1) {
                return this.userController.updateDefaultWorld(user, worlds[0]).then(() => {
                    return message.channel.send(`Default world switched to '${worlds[0].name}'`);
                });
            }

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
                        return message.channel.send("That input doesn't make any sense!");
                    }

                    return this.userController.updateDefaultWorld(user, worlds[choice]).then(() => {
                        return message.channel.send(`Default world switched to '${worlds[choice].name}'`);
                    });
                }).catch(()=> {
                    msg.delete({reason: "Removed world processing command."});
                    return message.channel.send("Message timed out.");
                });
            });




        });
    }

    private async findWorldByName(worldName: string, user: User): Promise<World[]> {
        return this.worldController.getByNameAndUser(worldName, user);
    }

    private async removeDefaultWorld (message: Message, user: User): Promise<Message | Message[]> {
        return this.userController.updateDefaultWorld(user, null).then((usr) => {
            if (usr == null) {
                return message.channel.send("Could not remove default world.");
            }

            return message.channel.send("Removed default world.");
        })
    }

    public async createWorld(worldName: string, command: Command, message: Message, user: User): Promise<Message | Message[]> {
        const world = new World();
        world.name = worldName;
        world.guildId = message.guild.id;
        return this.worldController.create(world).then((newWorld) => {
            if (newWorld == null) {
                return message.channel.send("Could not create world.");
            }

            return this.userController.addWorld(user, newWorld).then((user) => {
                if (user == null) {
                    return message.channel.send("Could not add the world to the map.");
                }

                // Go and save this.
                return this.userController.updateDefaultWorld(user, newWorld).then(() => {
                    return message.channel.send("Created new world: " + newWorld.name);
                });
            });
        });
    }
}