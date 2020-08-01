import {PartyFundController} from "./backend/controllers/party/PartyFundController";

export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),
    CryptKey: Symbol("CryptKey"),
    DatabaseUrl: Symbol("DatabaseUrl"),
    MessageResponder: Symbol("MessageResponder"),
    EncryptionUtility: Symbol("EncryptionUtility"),

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
    CurrentDateController: Symbol("CurrentDateController"),
    PartyController: Symbol("PartyController"),
    PartyFundController: Symbol("PartyFundController"),
    SendingController: Symbol("SendingController"),
    UserController: Symbol("UserController"),
    WorldController: Symbol("WorldController"),
};