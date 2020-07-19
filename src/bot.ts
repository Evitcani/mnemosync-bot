import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {MessageResponder} from "./services/message-responder";
import {CommandUtility} from "./utilities/CommandUtility";

@injectable()
export class Bot {
    public static PREFIX: string = "$";
    public static PREFIX_SUBCOMMAND: string = "~";
    private client: Client;
    private readonly token: string;
    private messageResponder: MessageResponder;

    constructor(
        @inject(TYPES.Client) client: Client,
        @inject(TYPES.Token) token: string,
        @inject(TYPES.MessageResponder) messageResponder: MessageResponder) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
    }

    public listen(): Promise<string> {
        this.client.on('message', (message: Message) => {
            const contents = message.content;
            if (message.author.bot || contents.substr(0, Bot.PREFIX.length) !== Bot.PREFIX) {
                return;
            }

            // Get the message sent.
            const command = CommandUtility.processCommands(contents);

            this.messageResponder.handle(command, message).catch((err: Error) => {
                console.log("ERR ::: " + err.message);
                console.log(err.stack);
                return message.channel.send("ERR ::: Unable to process command at this time.");
            });
        });

        return this.client.login(this.token);
    }
}