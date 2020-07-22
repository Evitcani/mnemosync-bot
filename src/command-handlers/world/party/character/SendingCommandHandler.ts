import {AbstractUserCommandHandler} from "../../../base/AbstractUserCommandHandler";
import {inject, injectable} from "inversify";
import {Command} from "../../../../models/generic/Command";
import {Client, Message} from "discord.js";
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
import {CharacterController} from "../../../../controllers/character/CharacterController";

@injectable()
export class SendingCommandHandler extends AbstractUserCommandHandler {
    private characterController: CharacterController;
    private client: Client;
    private readonly encryptionUtility: EncryptionUtility;
    private npcController: NPCController;
    private sendingController: SendingController;
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.Client) client: Client,
                @inject(TYPES.EncryptionUtility) encryptionUtility: EncryptionUtility,
                @inject(TYPES.NPCController) npcController: NPCController,
                @inject(TYPES.SendingController) sendingController: SendingController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.characterController = characterController;
        this.client = client;
        this.encryptionUtility = encryptionUtility;
        this.npcController = npcController;
        this.sendingController = sendingController;
        this.worldController = worldController;
    }


    async handleUserCommand(command: Command, message: Message, user: User): Promise<Message | Message[]> {

        // Want to view sendings.
        if (command.getSubcommands() == null || command.getSubcommands().size < 1 || Subcommands.GET.isCommand(command)) {
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
            // Someone is replying!
            return this.beginReply(command, user, message);
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

    private async beginReply (command: Command, user: User, message: Message): Promise<Message | Message[]> {
        let replyCmd = Subcommands.REPLY.getCommand(command);
        if (replyCmd.getInput() == null) {
            return message.channel.send("No reply ID.");
        }

        let page = SendingCommandHandler.getNumber(replyCmd.getInput());
        if (page == null) {
            return message.channel.send("ID isn't a number.");
        }

        if (user.defaultCharacter != null && user.defaultWorld != null) {
            return this.worldOrCharacter(user.defaultWorld, user.defaultCharacter, message).then((ret) => {
                if (ret == null) {
                    return null;
                }

                // Type is world.
                if (WorldController.isWorld(ret)) {
                    return this.sendingController.getOne(page, ret,  null, null).then((msg) => {
                        return this.doReply(msg, command, user, message);
                    });
                }

                return this.sendingController.getOne(page, null,  null, ret).then((msg) => {
                    return this.doReply(msg, command, user, message);
                });
            })
        }

        if (user.defaultCharacter != null) {
            return this.sendingController.getOne(page, null,  null, user.defaultCharacter).then((msg) => {
                return this.doReply(msg, command, user, message);
            });
        }

        if (user.defaultWorld != null) {
            return this.sendingController.getOne(page, user.defaultWorld,  null, null).then((msg) => {
                return this.doReply(msg, command, user, message);
            });
        }

        return message.channel.send(SendingHelpRelatedResponses.NO_DEFAULT_WORLD_OR_CHARACTER());
    }

    private async doReply(msg: Sending, command: Command, user: User, message: Message): Promise<Message | Message[]> {
        if (msg == null) {
            return message.channel.send("Could not find message with that ID.");
        }

        return this.constructNewSending(command, user, null, msg, message).then((sending) => {
            if (sending == null) {
                return null;
            }

            return this.sendingController.create(sending).then((sending) => {
                // Notify the player of the reply.
                if (sending.fromPlayerId != null) {
                    return this.characterController.getDiscordId(sending.fromPlayerId).then(async (discordIds) => {
                        let discordId, i;
                        for (i = 0; i < discordIds.length; i++) {
                            discordId = discordIds[i];
                            if (this.client.users.cache.get(discordId) == null) {
                                await this.client.users.fetch(discordId).then((user) => {
                                    this.client.users.cache.set(user.id, user);
                                    return user.send(SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility));
                                });
                            } else {
                                await this.client.users.cache.get(discordId)
                                    .send(SendingHelpRelatedResponses.PRINT_MESSAGE_REPLY_TO_PLAYER(sending, this.encryptionUtility));
                            }
                        }
                        return message.channel.send("Finished informing all users of the reply.");
                    });
                }

                // TODO: From an NPC.
                return null;
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
            return message.channel.send(SendingHelpRelatedResponses.PRINT_MESSAGES_FROM_WORLD(messages, world, page, this.encryptionUtility));
        });
    }

    private async getUnrepliedSendingsForCharacter(page: number, character: Character, message: Message): Promise<Message | Message[]> {
        // Go out to fetch the messages.
        return this.sendingController.get(page, null, null, character).then((messages) => {
            return message.channel.send(SendingHelpRelatedResponses.PRINT_MESSAGES_TO_CHARACTER(messages, character, page, this.encryptionUtility));
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
            await message.channel.send(SendingHelpRelatedResponses.MESSAGE_HAS_NO_CONTENT(message.content));
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