import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../../../../models/generic/Command";
import {Message} from "discord.js";
import {TYPES} from "../../../../types";
import {User} from "../../../../entity/User";
import {EncryptionUtility} from "../../../../utilities/EncryptionUtility";
import {Subcommands} from "../../../../documentation/commands/Subcommands";
import {Sending} from "../../../../entity/Sending";
import {NPCController} from "../../../../controllers/character/NPCController";
import {World} from "../../../../entity/World";
import {SendingController} from "../../../../controllers/character/SendingController";
import {SendingHelpRelatedResponses} from "../../../../documentation/client-responses/misc/SendingHelpRelatedResponses";
import {WorldController} from "../../../../controllers/world/WorldController";

@injectable()
export class SendingCommandHandler extends AbstractUserCommandHandler {
    private encryptionUtility: EncryptionUtility;
    private npcController: NPCController;
    private sendingController: SendingController;
    private worldController: WorldController;

    constructor(@inject(TYPES.EncryptionUtility) encryptionUtility: EncryptionUtility,
                @inject(TYPES.NPCController) npcController: NPCController,
                @inject(TYPES.SendingController) sendingController: SendingController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.encryptionUtility = encryptionUtility;
        this.npcController = npcController;
        this.sendingController = sendingController;
        this.worldController = worldController;
    }


    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {
        // Want to view sendings.
        if (command.getSubcommands() == null || command.getSubcommands().size < 1) {

        }

        // Reading a message.
        if (Subcommands.READ.isCommand(command)) {
            const readCmd = Subcommands.READ.getCommand(command);

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

        return this.worldController.worldSelectionFromUser(user, message).then((world) => {
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

    private async constructNewSending(command: Command, user: User, world: World, sending: Sending, message: Message): Promise<Sending> {
        // Get the content.

        if (Subcommands.MESSAGE.isCommand(command)) {
            const msgCmd = Subcommands.MESSAGE.getCommand(command);
            if (Subcommands.REPLY.isCommand(command)) {
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
        if (Subcommands.DATE.isCommand(command)) {
            const dateCmd = Subcommands.DATE.getCommand(command);
            sending.inGameDate = dateCmd.getInput();
        } else {
            await message.channel.send(SendingHelpRelatedResponses.MESSAGE_HAS_NO_DATE(message.content));
            return null;
        }

        // If going to an NPC, need to see which one.
        if (Subcommands.TO_NPC.isCommand(command)) {
            const tonCmd = Subcommands.TO_NPC.getCommand(command);
            sending.toNpc = await this.npcController.getByName(tonCmd.getInput(), world.id);

            // Could not find the NPC.
            if (sending.toNpc == null) {

            }
        } else {
            if (Subcommands.TO.isCommand(command)) {
                const toCmd = Subcommands.TO.getCommand(command);
                // TODO: Allow players to send messages to other players.
                return null;
            } else {
                return null;
            }
        }

        // Get who the message is from.
        if (Subcommands.FROM.isCommand(command)) {
            const fromCmd = Subcommands.FROM.getCommand(command);
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