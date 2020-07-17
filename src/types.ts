export const TYPES = {
    Bot: Symbol("Bot"),
    Client: Symbol("Client"),
    Token: Symbol("Token"),
    DatabaseUrl: Symbol("DatabaseUrl"),
    MessageResponder: Symbol("MessageResponder"),
    PingFinder: Symbol("PingFinder"),

    DatabaseService: Symbol("DatabaseService"),
    PartyFundService: Symbol("PartyFundService"),
    PartyService: Symbol("PartyService"),
    PartyToGuildService: Symbol("PartyToGuildService"),
    UserDefaultPartyService: Symbol("UserDefaultPartyService"),
    UserService: Symbol("UserService"),
    UserToGuildService: Symbol("UserToGuildService"),

    PartyFundCommandHandler: Symbol("PartyFundCommandHandler"),
    RegisterUserCommandHandler: Symbol("RegisterUserCommandHandler"),
    WhichCommandHandler: Symbol("WhichCommandHandler"),
};