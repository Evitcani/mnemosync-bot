"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const inversify_1 = require("inversify");
const types_1 = require("./types");
const bot_1 = require("./bot");
const discord_js_1 = require("discord.js");
const message_responder_1 = require("./services/message-responder");
const ping_finder_1 = require("./services/ping-finder");
const DatabaseService_1 = require("./database/DatabaseService");
const PartyService_1 = require("./database/PartyService");
const PartyFundCommandHandler_1 = require("./command-handlers/PartyFundCommandHandler");
const PartyFundService_1 = require("./database/PartyFundService");
const RegisterUserCommandHandler_1 = require("./command-handlers/RegisterUserCommandHandler");
const PartyToGuildService_1 = require("./database/PartyToGuildService");
const UserDefaultPartyService_1 = require("./database/UserDefaultPartyService");
const UserService_1 = require("./database/UserService");
const UserToGuildService_1 = require("./database/UserToGuildService");
const WhichCommandHandler_1 = require("./command-handlers/WhichCommandHandler");
let container = new inversify_1.Container();
container.bind(types_1.TYPES.Bot).to(bot_1.Bot).inSingletonScope();
container.bind(types_1.TYPES.Client).toConstantValue(new discord_js_1.Client());
container.bind(types_1.TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind(types_1.TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind(types_1.TYPES.MessageResponder).to(message_responder_1.MessageResponder).inSingletonScope();
container.bind(types_1.TYPES.PingFinder).to(ping_finder_1.PingFinder).inSingletonScope();
container.bind(types_1.TYPES.DatabaseService).to(DatabaseService_1.DatabaseService).inSingletonScope();
container.bind(types_1.TYPES.PartyFundService).to(PartyFundService_1.PartyFundService).inSingletonScope();
container.bind(types_1.TYPES.PartyService).to(PartyService_1.PartyService).inSingletonScope();
container.bind(types_1.TYPES.PartyToGuildService).to(PartyToGuildService_1.PartyToGuildService).inSingletonScope();
container.bind(types_1.TYPES.UserDefaultPartyService).to(UserDefaultPartyService_1.UserDefaultPartyService).inSingletonScope();
container.bind(types_1.TYPES.UserService).to(UserService_1.UserService).inSingletonScope();
container.bind(types_1.TYPES.UserToGuildService).to(UserToGuildService_1.UserToGuildService).inSingletonScope();
container.bind(types_1.TYPES.PartyFundCommandHandler).to(PartyFundCommandHandler_1.PartyFundCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.RegisterUserCommandHandler).to(RegisterUserCommandHandler_1.RegisterUserCommandHandler).inSingletonScope();
container.bind(types_1.TYPES.WhichCommandHandler).to(WhichCommandHandler_1.WhichCommandHandler).inSingletonScope();
exports.default = container;
//# sourceMappingURL=inversify.config.js.map