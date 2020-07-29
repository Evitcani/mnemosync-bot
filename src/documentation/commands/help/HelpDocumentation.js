"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpDocumentation = void 0;
const Commands_1 = require("../Commands");
const BasicEmbed_1 = require("../../BasicEmbed");
const bot_1 = require("../../../bot");
const BankCommandDocumentation_1 = require("./commands/BankCommandDocumentation");
const CalendarCommandDocumentation_1 = require("./commands/CalendarCommandDocumentation");
const CharacterCommandDocumentation_1 = require("./commands/CharacterCommandDocumentation");
const FundCommandDocumentation_1 = require("./commands/FundCommandDocumentation");
const DateCommandDocumentation_1 = require("./commands/DateCommandDocumentation");
const HelpCommandDocumentation_1 = require("./commands/HelpCommandDocumentation");
const PartyCommandDocumentation_1 = require("./commands/PartyCommandDocumentation");
const QuoteCommandDocumentation_1 = require("./commands/QuoteCommandDocumentation");
const RegisterCommandDocumentation_1 = require("./commands/RegisterCommandDocumentation");
const SendingCommandDocumentation_1 = require("./commands/SendingCommandDocumentation");
const WhichCommandDocumentation_1 = require("./commands/WhichCommandDocumentation");
const WorldCommandDocumentation_1 = require("./commands/WorldCommandDocumentation");
class HelpDocumentation {
    static find(command) {
        if (this.cmdMap == null) {
            this.createMap();
        }
        let cmd = this.cmdMap.get(command);
        if (cmd == null) {
            return this.get();
        }
        return cmd.getFullDescription();
    }
    static createMap() {
        this.cmdMap = new Map();
        this.cmdMap.set(this.BANK.getCommand(), this.BANK);
        // this.cmdMap.set(this.CALENDAR.getCommand(), this.CALENDAR);
        // this.cmdMap.set(this.CHARACTER.getCommand(), this.CHARACTER);
        // this.cmdMap.set(this.DATE.getCommand(), this.DATE);
        this.cmdMap.set(this.FUND.getCommand(), this.FUND);
        // this.cmdMap.set(this.HELP.getCommand(), this.HELP);
        // this.cmdMap.set(this.PARTY.getCommand(), this.PARTY);
        this.cmdMap.set(this.QUOTE.getCommand(), this.QUOTE);
        // this.cmdMap.set(this.REGISTER.getCommand(), this.REGISTER);
        this.cmdMap.set(this.SENDING.getCommand(), this.SENDING);
        // this.cmdMap.set(this.WHICH.getCommand(), this.WHICH);
        // this.cmdMap.set(this.WORLD.getCommand(), this.WORLD);
    }
    static get() {
        if (this.cmdMap == null) {
            this.createMap();
        }
        let str = "";
        this.cmdMap.forEach((value) => {
            str += "\n\n" + value.formatCommand();
        });
        return BasicEmbed_1.BasicEmbed.get()
            .setTitle(`Commands`)
            .setDescription(`Below is a basic overview of all commands. For a more detailed description of a command ` +
            `type, \`${bot_1.Bot.PREFIX}${Commands_1.Commands.HELP} [command name]\`.` +
            str);
    }
}
exports.HelpDocumentation = HelpDocumentation;
HelpDocumentation.cmdMap = null;
HelpDocumentation.BANK = new BankCommandDocumentation_1.BankCommandDocumentation();
HelpDocumentation.CALENDAR = new CalendarCommandDocumentation_1.CalendarCommandDocumentation();
HelpDocumentation.CHARACTER = new CharacterCommandDocumentation_1.CharacterCommandDocumentation();
HelpDocumentation.DATE = new DateCommandDocumentation_1.DateCommandDocumentation();
HelpDocumentation.FUND = new FundCommandDocumentation_1.FundCommandDocumentation();
HelpDocumentation.HELP = new HelpCommandDocumentation_1.HelpCommandDocumentation();
HelpDocumentation.PARTY = new PartyCommandDocumentation_1.PartyCommandDocumentation();
HelpDocumentation.QUOTE = new QuoteCommandDocumentation_1.QuoteCommandDocumentation();
HelpDocumentation.REGISTER = new RegisterCommandDocumentation_1.RegisterCommandDocumentation();
HelpDocumentation.SENDING = new SendingCommandDocumentation_1.SendingCommandDocumentation();
HelpDocumentation.WHICH = new WhichCommandDocumentation_1.WhichCommandDocumentation();
HelpDocumentation.WORLD = new WorldCommandDocumentation_1.WorldCommandDocumentation();
//# sourceMappingURL=HelpDocumentation.js.map