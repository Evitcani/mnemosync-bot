import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {TYPES} from "../types";
import {User} from "../entity/User";
import {EncryptionUtility} from "../utilities/EncryptionUtility";
import {Subcommands} from "../documentation/commands/Subcommands";
import {Sending} from "../entity/Sending";
import {NPCController} from "../controllers/NPCController";
import {World} from "../entity/World";
import {SendingController} from "../controllers/SendingController";

@injectable()
export class SendingCommandHandler extends AbstractUserCommandHandler {
    private encryptionUtility: EncryptionUtility;
    private npcController: NPCController;
    private sendingController: SendingController;

    constructor(@inject(TYPES.EncryptionUtility) encryptionUtility: EncryptionUtility,
                @inject(TYPES.NPCController) npcController: NPCController,
                @inject(TYPES.SendingController) sendingController: SendingController) {
        super();
        this.encryptionUtility = encryptionUtility;
        this.npcController = npcController;
        this.sendingController = sendingController;
    }


    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Want to view sendings.
        if (command.getSubcommands() == null || command.getSubcommands().size < 1) {

        }

        // Sending a message to another player!
        const readCmd = Subcommands.READ.isCommand(command);
        if (readCmd != null) {
            // Get latest message.
            if (readCmd.getInput() == null) {

            }

            // TODO: Figure out how this'll work...
            return null;
        }

        // Replying to a sending.
        const replyCmd = Subcommands.REPLY.isCommand(command);
        if (replyCmd != null) {
            // TODO: Will deal with later...
            return null;
        }

        return this.getWorld(user).then((world) => {
            if (world == null) {
                return message.channel.send("No world where this message can be sent!");
            }

            return this.constructNewSending(command, user, world, new Sending(), message).then((sending) => {
                if (sending == null) {
                    return message.channel.send("Could not send message.");
                }

                return this.sendingController.create(sending).then((sent) => {
                    return message.channel.send(`Sent message to ` +
                        `${sent.toNpc == null ? sent.toPlayer.name : sent.toNpc.name} with message ` +
                        `${this.encryptionUtility.decrypt(sent.content)}`);
                });
            });
        });
    }

    private async getWorld(user: User): Promise<World> {
        if (user.defaultCharacter == null) {
            if (user.defaultWorld == null) {
                return null;
            }

            return user.defaultWorld;
        }

        if (user.defaultCharacter.party == null) {
            return null;
        }

        if (user.defaultCharacter.party.world == null) {
            return null;
        }

        return user.defaultCharacter.party.world;
    }

    private async constructNewSending(command: Command, user: User, world: World, sending: Sending, message: Message): Promise<Sending> {
        // Get the content.
        const msgCmd = Subcommands.MESSAGE.isCommand(command);
        const replyCmd = Subcommands.REPLY.isCommand(command);
        if (msgCmd != null) {
            if (replyCmd == null) {
                sending.content = this.encryptionUtility.encrypt(msgCmd.getInput());
            } else {
                sending.reply = this.encryptionUtility.encrypt(msgCmd.getInput());
                return sending;
            }
        } else {
            await message.channel.send("Message has no content. Add message content with `~msg [content]`.");
            return null;
        }

        // Get the in-game date.
        const dateCmd = Subcommands.DATE.isCommand(command);
        if (dateCmd != null) {
            sending.inGameDate = dateCmd.getInput();
        } else {
            await message.channel.send("Message has no date. Add message (in-game) date with `~date [day]/[month]/[year]`.");
            return null;
        }

        // If going to an NPC, need to see which one.
        const tonCmd = Subcommands.TO_NPC.isCommand(command);
        if (tonCmd != null) {
            sending.toNpc = await this.npcController.getByName(tonCmd.getInput(), world.id);
        } else {
            const toCmd = Subcommands.TO.isCommand(command);
            if (toCmd != null) {
                // TODO: Allow players to send messages to other players.
                return null;
            } else {
                return null;
            }
        }

        // Get who the message is from.
        const fromCmd = Subcommands.FROM.isCommand(command);
        if (fromCmd != null) {
            sending.fromNpc = await this.npcController.getByName(fromCmd.getInput(), world.id);
        } else {
            if (user.defaultCharacter != null) {
                sending.fromPlayer = user.defaultCharacter;
            } else {
                // From no one...
                return null;
            }
        }

        return sending;
    }
}