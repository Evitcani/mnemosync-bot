import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {Client} from "discord.js";
import {MessageResponder} from "./services/message-responder";
import {PingFinder} from "./services/ping-finder";
import {DatabaseService} from "./database/DatabaseService";
import {PartyService} from "./database/PartyService";
import {PartyFundCommandHandler} from "./command-handlers/PartyFundCommandHandler";
import {PartyFundService} from "./database/PartyFundService";
import {RegisterUserCommandHandler} from "./command-handlers/RegisterUserCommandHandler";
import {PartyToGuildService} from "./database/PartyToGuildService";
import {UserDefaultPartyService} from "./database/UserDefaultPartyService";
import {UserService} from "./database/UserService";
import {UserToGuildService} from "./database/UserToGuildService";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<string>(TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();

container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<PartyFundService>(TYPES.PartyFundService).to(PartyFundService).inSingletonScope();
container.bind<PartyService>(TYPES.PartyService).to(PartyService).inSingletonScope();
container.bind<PartyToGuildService>(TYPES.PartyToGuildService).to(PartyToGuildService).inSingletonScope();
container.bind<UserDefaultPartyService>(TYPES.UserDefaultPartyService).to(UserDefaultPartyService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<UserToGuildService>(TYPES.UserToGuildService).to(UserToGuildService).inSingletonScope();


container.bind<PartyFundCommandHandler>(TYPES.PartyFundCommandHandler).to(PartyFundCommandHandler).inSingletonScope();
container.bind<RegisterUserCommandHandler>(TYPES.RegisterUserCommandHandler).to(RegisterUserCommandHandler).inSingletonScope();


export default container;