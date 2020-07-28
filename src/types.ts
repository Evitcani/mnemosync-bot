import {PartyFundController} from "./controllers/party/PartyFundController";

export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),
    CryptKey: Symbol("CryptKey"),
    DatabaseUrl: Symbol("DatabaseUrl"),
    MessageResponder: Symbol("MessageResponder"),
    PingFinder: Symbol("PingFinder"),
    EncryptionUtility: Symbol("EncryptionUtility"),

    DatabaseService: Symbol("DatabaseService"),
    PartyToGuildService: Symbol("PartyToGuildService"),
    SpecialChannelService: Symbol("SpecialChannelService"),
    UserDefaultPartyService: Symbol("UserDefaultPartyService"),
    UserToGuildService: Symbol("UserToGuildService"),

    BagCommandHandler: Symbol("BagCommandHandler"),
    CalendarCommandHandler: Symbol("CalendarCommandHandler"),
    CharacterCommandHandler: Symbol("CharacterCommandHandler"),
    DateCommandHandler: Symbol("DateCommandHandler"),
    HelpCommandHandler: Symbol("HelpCommandHandler"),
    PartyCommandHandler: Symbol("PartyCommandHandler"),
    PartyFundCommandHandler: Symbol("PartyFundCommandHandler"),
    QuoteCommandHandler: Symbol("QuoteCommandHandler"),
    RegisterUserCommandHandler: Symbol("RegisterUserCommandHandler"),
    SendingCommandHandler: Symbol("SendingCommandHandler"),
    TravelCommandHandler: Symbol("TravelCommandHandler"),
    WhichCommandHandler: Symbol("WhichCommandHandler"),
    WorldCommandHandler: Symbol("WorldCommandHandler"),

    CharacterController: Symbol("CharacterController"),
    CalendarController: Symbol("CalendarController"),
    CalendarEraController: Symbol("CalendarEraController"),
    CalendarMonthController: Symbol("CalendarMonthController"),
    CalendarMoonController: Symbol("CalendarMoonController"),
    CalendarWeekDayController: Symbol("CalendarWeekDayController"),
    CurrentDateController: Symbol("CurrentDateController"),
    NPCController: Symbol("NPCController"),
    PartyController: Symbol("PartyController"),
    PartyFundController: Symbol("PartyFundController"),
    SendingController: Symbol("SendingController"),
    UserController: Symbol("UserController"),
    WorldController: Symbol("WorldController"),
};