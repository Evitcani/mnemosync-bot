import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {Subcommands} from "../../../../shared/documentation/commands/Subcommands";
import {WorldController} from "../../../../backend/controllers/world/WorldController";
import {TYPES} from "../../../../types";
import {UserController} from "../../../../backend/controllers/user/UserController";
import {PartyController} from "../../../../backend/controllers/party/PartyController";
import {UserDTO} from "mnemoshared/dist/src/dto/model/UserDTO";
import {WorldDTO} from "mnemoshared/dist/src/dto/model/WorldDTO";
import {DTOType} from "mnemoshared/dist/src/dto/DTOType";

@injectable()
export class WorldCommandHandler extends AbstractUserCommandHandler {
    private partyController: PartyController;
    private userController: UserController;
    private worldController: WorldController;

    constructor(@inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.UserController) userController: UserController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.partyController = partyController;
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
    async handleUserCommand(command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        // Command to create a new world.
        if (Subcommands.CREATE.isCommand(command)) {
            const createCmd = Subcommands.CREATE.getCommand(command);
            return this.createWorld(createCmd.getInput(), command, message, user);
        }

        // Command to switch default worlds.

        if (Subcommands.SWITCH.isCommand(command)) {
            const switchCmd = Subcommands.SWITCH.getCommand(command);
            // If the input is null, it means we should remove the default world.
            if (switchCmd.getInput() == null) {
                return this.removeDefaultWorld(message, user);
            }

            return this.switchDefaultWorld(switchCmd.getInput(), message, user);
        }

        // Command to add the party to this world.
        if (Subcommands.PARTY.isCommand(command)) {
            const ptCmd = Subcommands.PARTY.getCommand(command);
            return this.addPartyToWorld(ptCmd.getInput(), message, user);
        }

        return undefined;
    }

    private async addPartyToWorld(partyName: string, message: Message, user: UserDTO): Promise<Message | Message[]> {
        return this.worldController.worldSelectionFromUser(user, message).then((world) => {
            if (world == null) {
                return null;
            }

            return this.continueAddingPartyToWorld(partyName, message, world);
        });


    }

    private async continueAddingPartyToWorld(partyName: string, message: Message, world: WorldDTO): Promise<Message | Message[]> {
        return this.partyController.getByNameAndGuild(partyName, message.guild.id).then((parties) => {
            if (parties == null || parties.length < 1) {
                return message.channel.send("Could not find party with given name like: " + partyName);
            }

            // TODO: Allow user to select party if ambiguous.
            return this.partyController.updatePartyWorld(parties[0], world.id).then((party) => {
                return message.channel.send(`Party ('${party.name}') added to world: ${world.name}`);
            });
        });
    }

    private async switchDefaultWorld(worldName: string, message: Message, user: UserDTO): Promise<Message | Message[]> {
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

            return this.worldController.worldSelection(worlds, message).then((world) => {
                if (world == null) {
                    return null;
                }

                return this.userController.updateDefaultWorld(user, world).then(() => {
                    return message.channel.send(`Default world switched to '${world.name}'`);
                });
            });
        });
    }

    private async findWorldByName(worldName: string, user: UserDTO): Promise<WorldDTO[]> {
        return this.worldController.getByNameAndUser(worldName, user);
    }

    private async removeDefaultWorld (message: Message, user: UserDTO): Promise<Message | Message[]> {
        return this.userController.updateDefaultWorld(user, null).then((usr) => {
            if (usr == null) {
                return message.channel.send("Could not remove default world.");
            }

            return message.channel.send("Removed default world.");
        })
    }

    public async createWorld(worldName: string, command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        const world: WorldDTO = {dtoType: DTOType.WORLD};
        world.name = worldName;
        world.guildId = message.guild.id;
        return this.worldController.createWorld(world, user).then((newWorld) => {
            if (newWorld == null) {
                return message.channel.send("Could not create world.");
            }

            return message.channel.send("Created new world: " + newWorld.name);
        });
    }
}