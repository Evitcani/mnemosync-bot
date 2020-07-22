import {PartyFundController} from "./controllers/PartyFundController";

export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),
    DatabaseUrl: Symbol("DatabaseUrl"),
    MessageResponder: Symbol("MessageResponder"),
    PingFinder: Symbol("PingFinder"),

    CharacterService: Symbol("CharacterService"),
    DatabaseService: Symbol("DatabaseService"),
    PartyFundService: Symbol("PartyFundService"),
    PartyToGuildService: Symbol("PartyToGuildService"),
    SpecialChannelService: Symbol("SpecialChannelService"),
    UserDefaultPartyService: Symbol("UserDefaultPartyService"),
    UserService: Symbol("UserService"),
    UserToCharacterService: Symbol("UserToCharacterService"),
    UserToGuildService: Symbol("UserToGuildService"),

    BagCommandHandler: Symbol("BagCommandHandler"),
    CharacterCommandHandler: Symbol("CharacterCommandHandler"),
    HelpCommandHandler: Symbol("HelpCommandHandler"),
    PartyFundCommandHandler: Symbol("PartyFundCommandHandler"),
    QuoteCommandHandler: Symbol("QuoteCommandHandler"),
    RegisterUserCommandHandler: Symbol("RegisterUserCommandHandler"),
    TravelCommandHandler: Symbol("TravelCommandHandler"),
    WhichCommandHandler: Symbol("WhichCommandHandler"),

    CharacterController: Symbol("CharacterController"),
    NPCController: Symbol("NPCController"),
    PartyController: Symbol("PartyController"),
    PartyFundController: Symbol("PartyFundController"),
    UserController: Symbol("UserController"),
    WorldController: Symbol("WorldController"),
};