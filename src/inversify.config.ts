import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {Client} from "discord.js";
import {MessageResponder} from "./services/message-responder";
import {PingFinder} from "./services/ping-finder";
import {DatabaseService} from "./database/base/DatabaseService";
import {PartyFundCommandHandler} from "./command-handlers/world/party/inventory/PartyFundCommandHandler";
import {RegisterCommandHandler} from "./command-handlers/misc/RegisterCommandHandler";
import {PartyToGuildService} from "./database/PartyToGuildService";
import {UserDefaultPartyService} from "./database/UserDefaultPartyService";
import {UserToGuildService} from "./database/UserToGuildService";
import {WhichCommandHandler} from "./command-handlers/world/information/WhichCommandHandler";
import {SpecialChannelService} from "./database/SpecialChannelService";
import {HelpCommandHandler} from "./command-handlers/misc/HelpCommandHandler";
import {QuoteCommandHandler} from "./command-handlers/misc/QuoteCommandHandler";
import {BagCommandHandler} from "./command-handlers/world/party/inventory/BagCommandHandler";
import {CharacterCommandHandler} from "./command-handlers/world/party/character/CharacterCommandHandler";
import {TravelCommandHandler} from "./command-handlers/world/information/TravelCommandHandler";
import {PartyController} from "./controllers/party/PartyController";
import {PartyFundController} from "./controllers/party/PartyFundController";
import {CharacterController} from "./controllers/character/CharacterController";
import {UserController} from "./controllers/user/UserController";
import {WorldController} from "./controllers/world/WorldController";
import {NPCController} from "./controllers/character/NPCController";
import {WorldCommandHandler} from "./command-handlers/world/information/WorldCommandHandler";
import {EncryptionUtility} from "./utilities/EncryptionUtility";
import {SendingController} from "./controllers/character/SendingController";
import {SendingCommandHandler} from "./command-handlers/world/party/character/SendingCommandHandler";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<string>(TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind<string>(TYPES.CryptKey).toConstantValue(process.env.CRYPT_KEY);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();
container.bind<EncryptionUtility>(TYPES.EncryptionUtility).to(EncryptionUtility).inSingletonScope();

container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<PartyToGuildService>(TYPES.PartyToGuildService).to(PartyToGuildService).inSingletonScope();
container.bind<SpecialChannelService>(TYPES.SpecialChannelService).to(SpecialChannelService).inSingletonScope();
container.bind<UserDefaultPartyService>(TYPES.UserDefaultPartyService).to(UserDefaultPartyService).inSingletonScope();
container.bind<UserToGuildService>(TYPES.UserToGuildService).to(UserToGuildService).inSingletonScope();

container.bind<BagCommandHandler>(TYPES.BagCommandHandler).to(BagCommandHandler).inSingletonScope();
container.bind<CharacterCommandHandler>(TYPES.CharacterCommandHandler).to(CharacterCommandHandler).inSingletonScope();
container.bind<HelpCommandHandler>(TYPES.HelpCommandHandler).to(HelpCommandHandler).inSingletonScope();
container.bind<PartyFundCommandHandler>(TYPES.PartyFundCommandHandler).to(PartyFundCommandHandler).inSingletonScope();
container.bind<QuoteCommandHandler>(TYPES.QuoteCommandHandler).to(QuoteCommandHandler).inSingletonScope();
container.bind<RegisterCommandHandler>(TYPES.RegisterUserCommandHandler).to(RegisterCommandHandler).inSingletonScope();
container.bind<SendingCommandHandler>(TYPES.SendingCommandHandler).to(SendingCommandHandler).inSingletonScope();
container.bind<TravelCommandHandler>(TYPES.TravelCommandHandler).to(TravelCommandHandler).inSingletonScope();
container.bind<WhichCommandHandler>(TYPES.WhichCommandHandler).to(WhichCommandHandler).inSingletonScope();
container.bind<WorldCommandHandler>(TYPES.WorldCommandHandler).to(WorldCommandHandler).inSingletonScope();

container.bind<CharacterController>(TYPES.CharacterController).to(CharacterController).inSingletonScope();
container.bind<NPCController>(TYPES.NPCController).to(NPCController).inSingletonScope();
container.bind<PartyController>(TYPES.PartyController).to(PartyController).inSingletonScope();
container.bind<PartyFundController>(TYPES.PartyFundController).to(PartyFundController).inSingletonScope();
container.bind<SendingController>(TYPES.SendingController).to(SendingController).inSingletonScope();
container.bind<UserController>(TYPES.UserController).to(UserController).inSingletonScope();
container.bind<WorldController>(TYPES.WorldController).to(WorldController).inSingletonScope();

export default container;