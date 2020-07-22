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
import {Character} from "../../../../entity/Character";
import {GameDate} from "../../../../entity/GameDate";

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
            console.log("Getting unreplied sendings...");
            return this.getUnrepliedSendings(command, user, message);
        }

        console.log("Not looking for unreplied sendings!");

        // Reading a message.
        if (Subcommands.READ.isCommand(command)) {
            const readCmd = Subcommands.READ.getCommand(command);

            // Get latest message.
            if (readCmd.getInput() == null) {

            }

            // TODO: Figure out how this'll work...
            console.log("Deal with reads later...");
            return null;
        }

        console.log("Not reading!");

        if (Subcommands.REPLY.isCommand(command)) {
            // TODO: Will deal with later...
            console.log("Deal with replies later...");
            return null;
        }

        console.log("Not replying! Going to send a new message...");

        return this.worldController.worldSelectionFromUser(user, message).then((world) => {
            if (world == null) {
                return message.channel.send("No world where this message can be sent!");
            }

            console.log("Constructing a new sending..");
            return this.constructNewSending(command, user, world, new Sending(), message).then((sending) => {
                if (sending == null) {
                    return message.channel.send("Could not send message.");
                }

                console.log("Created sending, now saving...");

                return this.sendingController.create(sending).then((sent) => {
                    if (sent == null) {
                        return message.channel.send("Could not send message.");
                    }

                    console.log("Saved, returning...");

                    return message.channel.send(`Sent message to ` +
                        `${sent.toNpc == null ? sent.toPlayer.name : sent.toNpc.name} with message ` +
                        `${this.encryptionUtility.decrypt(sent.content)}`);
                });
            });
        });
    }

    private async getUnrepliedSendings(command: Command, user: User, message: Message): Promise<Message | Message[]> {
        // Process the next  command.
        let page = 0;
        if (Subcommands.NEXT.isCommand(command)) {
            const nextCmd = Subcommands.NEXT.getCommand(command);
            if (nextCmd.getInput() != null) {
                let pg = Number(nextCmd.getInput());
                if (!isNaN(pg)) {
                    page = pg;
                }
            } else {
                page = 1;
            }
        }

        if (user.defaultCharacter != null && user.defaultWorld != null) {
            return this.worldOrCharacter(user.defaultWorld, user.defaultCharacter, message).then((ret) => {
                if (ret == null) {
                    return null;
                }

                // Type is world.
                if (WorldController.isWorld(ret)) {
                    return this.getUnrepliedSendingsForWorld(page, ret, message);
                }

                return this.getUnrepliedSendingsForCharacter(page, ret, message);
            })
        }

        if (user.defaultCharacter != null) {
            return this.getUnrepliedSendingsForCharacter(page, user.defaultCharacter, message);
        }

        if (user.defaultWorld != null) {
            return this.getUnrepliedSendingsForWorld(page, user.defaultWorld, message);
        }

        return message.channel.send(SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
    }

    private async getUnrepliedSendingsForWorld(page: number, world: World, message: Message): Promise<Message | Message[]> {
        // Go out to fetch the messages.
        return this.sendingController.get(page, world, null, null).then((messages) => {
            return message.channel.send(SendingHelpRelatedResponses.PRINT_MESSAGES_FROM_WORLD(messages, world, page));
        });
    }

    private async getUnrepliedSendingsForCharacter(page: number, character: Character, message: Message): Promise<Message | Message[]> {
        // Go out to fetch the messages.
        return this.sendingController.get(page, null, null, character).then((messages) => {
            return message.channel.send(SendingHelpRelatedResponses.PRINT_MESSAGES_TO_CHARACTER(messages, character, page));
        });
    }

    private async constructNewSending(command: Command, user: User, world: World, sending: Sending, message: Message): Promise<Sending> {
        // Get the content.
        if (Subcommands.MESSAGE.isCommand(command)) {
            const msgCmd = Subcommands.MESSAGE.getCommand(command);
            if (!Subcommands.REPLY.isCommand(command)) {
                sending.content = this.encryptionUtility.encrypt(msgCmd.getInput());
            } else {
                sending.reply = this.encryptionUtility.encrypt(msgCmd.getInput());
                return sending;
            }
        } else {
            await message.channel.send("Message has no content. Add message content with `~msg [content]`.");
            return null;
        }

        // Set the world.
        sending.world = world;

        // Get the in-game date.
        if (Subcommands.DATE.isCommand(command)) {
            const dateCmd = Subcommands.DATE.getCommand(command);
            let input = dateCmd.getInput();
            if (input == null) {
                await message.channel.send("There was no actual date given.");
                return null;
            }
            // Split the date and process.
            let dates = input.split("/");
            if (dates.length < 3) {
                await message.channel.send("Date was malformed. Should be like `[day]/[month]/[year]`");
                return null;
            }

            // TODO: Implement era processing.
            let day = SendingCommandHandler.getNumber(dates[0]),
                month = SendingCommandHandler.getNumber(dates[1]),
                year = SendingCommandHandler.getNumber(dates[2]);

            // TODO: Better response here.
            if (day == null || month == null || year == null) {
                await message.channel.send("Date was malformed. Day, month or year was not a number. Should be like " +
                    "`[# day]/[# month]/[# year]`");
                return null;
            }

            // Now put it inside the sending.
            sending.inGameDate = new GameDate();
            sending.inGameDate.day = day;
            sending.inGameDate.month = month;
            sending.inGameDate.year = year;
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
                await message.channel.send("Could not find the given NPC you were trying to send to.");
                return null;
            }
        } else {
            if (Subcommands.TO.isCommand(command)) {
                const toCmd = Subcommands.TO.getCommand(command);
                // TODO: Allow players to send messages to other players.
                await message.channel.send("Not yet supporting player-to-player messages!");
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
                await message.channel.send("Couldn't figure out who this message was meant to be from!");
                return null;
            }
        }

        return sending;
    }

    public async worldOrCharacter(world: World, character: Character, message: Message): Promise<World | Character> {
        return message.channel.send(SendingHelpRelatedResponses.CHECK_SENDINGS_FOR_WHICH(character, world)).then((msg) => {
            return message.channel.awaitMessages(m => m.author.id === message.author.id, {
                max: 1,
                time: 10e3,
                errors: ['time'],
            }).then((input) => {
                msg.delete({reason: "Removed processing command."});
                let content = input.first().content;
                let choice = Number(content);
                if (isNaN(choice) || choice > 2 || choice < 1) {
                    message.channel.send("Input doesn't make sense!");
                    return null;
                }

                input.first().delete();
                return choice == 1 ? world : character;
            }).catch(()=> {
                msg.delete({reason: "Removed processing command."});
                message.channel.send("Message timed out.");
                return null;
            });
        });
    }

    private static getNumber(input: string): number | null {
        if (input == null) {
            return null;
        }

        let ret = Number(input);
        if (isNaN(ret)) {
            return null;
        }

        return ret;
    }
}