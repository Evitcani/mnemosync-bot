"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Bot_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bot = void 0;
const discord_js_1 = require("discord.js");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const message_responder_1 = require("./services/message-responder");
const CommandUtility_1 = require("./utilities/CommandUtility");
let Bot = Bot_1 = class Bot {
    constructor(client, token, messageResponder) {
        this.client = client;
        this.token = token;
        this.messageResponder = messageResponder;
    }
    listen() {
        this.client.on('message', (message) => {
            const contents = message.content;
            // We connect with Avrae.
            if (message.author.bot) {
                if (message.author.id == Bot_1.AVRAE_BOT_ID) {
                    console.debug("Saw command from Avrae...");
                    const fields = message.embeds[0].fields;
                    let field, i;
                    for (i = 0; i < fields.length; i++) {
                        field = fields[i];
                        console.debug("NAME: " + field.name + "\nVALUE: " + field.value);
                    }
                    return;
                }
                return;
            }
            if (contents.substr(0, Bot_1.PREFIX.length) !== Bot_1.PREFIX) {
                return;
            }
            // Get the message sent.
            const command = CommandUtility_1.CommandUtility.processCommands(contents);
            this.messageResponder.handle(command, message).catch((err) => {
                console.log("ERR ::: " + err.message);
                console.log(err.stack);
                return message.channel.send("ERR ::: Unable to process command at this time.");
            });
        });
        return this.client.login(this.token);
    }
};
Bot.AVRAE_BOT_ID = "261302296103747584";
Bot.PREFIX = "$";
Bot.PREFIX_SUBCOMMAND = "~";
Bot = Bot_1 = __decorate([
    inversify_1.injectable(),
    __param(0, inversify_1.inject(types_1.TYPES.Client)),
    __param(1, inversify_1.inject(types_1.TYPES.Token)),
    __param(2, inversify_1.inject(types_1.TYPES.MessageResponder)),
    __metadata("design:paramtypes", [discord_js_1.Client, String, message_responder_1.MessageResponder])
], Bot);
exports.Bot = Bot;
//# sourceMappingURL=bot.js.map