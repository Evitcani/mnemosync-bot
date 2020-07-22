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
import {getConnection} from "typeorm";

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

            return this.findWorldByName(switchCmd.getInput(), user).then((worlds) => {
                if (worlds == null) {
                    return message.channel.send("Could not find world with given name like: " + switchCmd.getInput());
                }

                return message.channel.send("Found worlds with given name like: " + switchCmd.getInput());
            })
        }

        return undefined;
    }

    public async findWorldByName(worldName: string, user: User): Promise<World[]> {
        return this.worldController.getByNameAndUser(worldName, user);
    }

    public async removeDefaultWorld (message: Message, user: User): Promise<Message | Message[]> {
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
        world.defaultOfUsers = [];
        world.defaultOfUsers.push(user);
        return this.worldController.create(world).then((newWorld) => {
            if (newWorld == null) {
                return message.channel.send("Could not create world.");
            }

            // Update the user details.
            user.defaultWorld = newWorld;
            if (user.campaignsDMing == null) {
                user.campaignsDMing = [];
            }
            user.campaignsDMing.push(newWorld);

            // Go and save this.
            this.userController.updateDefaultWorld(user, newWorld).then(() => {
                return message.channel.send("Created new world: " + newWorld.name);
            });
        });
    }
}