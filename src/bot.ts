import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {MessageResponder} from "./services/message-responder";
import {CommandUtility} from "./utilities/CommandUtility";

@injectable()
export class Bot {
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
            if (message.author.bot || contents.substr(0,1) !== "$") {
                return;
            }

            // Get the message sent.
            const command = CommandUtility.processCommands(contents);

            console.log("Message received! Contents: ", message.content);

            this.messageResponder.handle(command, message).catch((err: Error) => {
                return message.channel.send("ERR ::: Unable to process command at this time.");
            });
        });

        return this.client.login(this.token);
    }
}