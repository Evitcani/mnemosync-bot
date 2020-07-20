import "reflect-metadata";
import {Container} from "inversify";
import {TYPES} from "./types";
import {Bot} from "./bot";
import {Client} from "discord.js";
import {MessageResponder} from "./services/message-responder";
import {PingFinder} from "./services/ping-finder";
import {DatabaseService} from "./database/base/DatabaseService";
import {PartyFundCommandHandler} from "./command-handlers/PartyFundCommandHandler";
import {PartyFundService} from "./database/PartyFundService";
import {RegisterCommandHandler} from "./command-handlers/RegisterCommandHandler";
import {PartyToGuildService} from "./database/PartyToGuildService";
import {UserDefaultPartyService} from "./database/UserDefaultPartyService";
import {UserService} from "./database/UserService";
import {UserToGuildService} from "./database/UserToGuildService";
import {WhichCommandHandler} from "./command-handlers/WhichCommandHandler";
import {SpecialChannelService} from "./database/SpecialChannelService";
import {HelpCommandHandler} from "./command-handlers/HelpCommandHandler";
import {QuoteCommandHandler} from "./command-handlers/QuoteCommandHandler";
import {CharacterService} from "./database/CharacterService";
import {BagCommandHandler} from "./command-handlers/BagCommandHandler";
import {CharacterCommandHandler} from "./command-handlers/CharacterCommandHandler";
import {TravelCommandHandler} from "./command-handlers/TravelCommandHandler";
import {UserToCharacterService} from "./database/UserToCharacterService";
import {PartyController} from "./controllers/PartyController";
import {PartyFundController} from "./controllers/PartyFundController";

let container = new Container();

container.bind<Bot>(TYPES.Bot).to(Bot).inSingletonScope();
container.bind<Client>(TYPES.Client).toConstantValue(new Client());
container.bind<string>(TYPES.Token).toConstantValue(process.env.TOKEN);
container.bind<string>(TYPES.DatabaseUrl).toConstantValue(process.env.DATABASE_URL);
container.bind<MessageResponder>(TYPES.MessageResponder).to(MessageResponder).inSingletonScope();
container.bind<PingFinder>(TYPES.PingFinder).to(PingFinder).inSingletonScope();

container.bind<CharacterService>(TYPES.CharacterService).to(CharacterService).inSingletonScope();
container.bind<DatabaseService>(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();
container.bind<PartyFundService>(TYPES.PartyFundService).to(PartyFundService).inSingletonScope();
container.bind<PartyToGuildService>(TYPES.PartyToGuildService).to(PartyToGuildService).inSingletonScope();
container.bind<SpecialChannelService>(TYPES.SpecialChannelService).to(SpecialChannelService).inSingletonScope();
container.bind<UserDefaultPartyService>(TYPES.UserDefaultPartyService).to(UserDefaultPartyService).inSingletonScope();
container.bind<UserService>(TYPES.UserService).to(UserService).inSingletonScope();
container.bind<UserToGuildService>(TYPES.UserToGuildService).to(UserToGuildService).inSingletonScope();
container.bind<UserToCharacterService>(TYPES.UserToCharacterService).to(UserToCharacterService).inSingletonScope();

container.bind<BagCommandHandler>(TYPES.BagCommandHandler).to(BagCommandHandler).inSingletonScope();
container.bind<CharacterCommandHandler>(TYPES.CharacterCommandHandler).to(CharacterCommandHandler).inSingletonScope();
container.bind<HelpCommandHandler>(TYPES.HelpCommandHandler).to(HelpCommandHandler).inSingletonScope();
container.bind<PartyFundCommandHandler>(TYPES.PartyFundCommandHandler).to(PartyFundCommandHandler).inSingletonScope();
container.bind<QuoteCommandHandler>(TYPES.QuoteCommandHandler).to(QuoteCommandHandler).inSingletonScope();
container.bind<RegisterCommandHandler>(TYPES.RegisterUserCommandHandler).to(RegisterCommandHandler).inSingletonScope();
container.bind<TravelCommandHandler>(TYPES.TravelCommandHandler).to(TravelCommandHandler).inSingletonScope();
container.bind<WhichCommandHandler>(TYPES.WhichCommandHandler).to(WhichCommandHandler).inSingletonScope();

container.bind<PartyController>(TYPES.PartyController).to(PartyController).inSingletonScope();
container.bind<PartyFundController>(TYPES.PartyFundController).to(PartyFundController).inSingletonScope();

export default container;