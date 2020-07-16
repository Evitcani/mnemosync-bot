import {Client, Message} from "discord.js";
import {inject, injectable} from "inversify";
import {TYPES} from "./types";
import {MessageResponder} from "./services/message-responder";

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
            const args = contents.substr(1).split(" ");
            const cmd = args[0].toLowerCase();

            // Remove command from args.
            args.splice(0,1);

            console.log("Message received! Contents: ", message.content);

            switch (cmd) {
                case "bank":
                    this.messageResponder.bankCommand(message, args).then(() => {
                        console.log("Response sent!");
                    }).catch(() => {
                        console.log("Response not sent.")
                    });
                    break;
            }
        });

        return this.client.login(this.token);
    }
}