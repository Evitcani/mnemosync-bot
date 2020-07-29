import {BaseCommandDocumentation} from "./commands/BaseCommandDocumentation";
import {Subcommands} from "../Subcommands";
import {Commands} from "../Commands";
import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Bot} from "../../../bot";
import {CommandStrut} from "../CommandStrut";
import {BankCommandDocumentation} from "./commands/BankCommandDocumentation";
import {CalendarCommandDocumentation} from "./commands/CalendarCommandDocumentation";
import {CharacterCommandDocumentation} from "./commands/CharacterCommandDocumentation";
import {FundCommandDocumentation} from "./commands/FundCommandDocumentation";
import {DateCommandDocumentation} from "./commands/DateCommandDocumentation";
import {HelpCommandDocumentation} from "./commands/HelpCommandDocumentation";
import {PartyCommandDocumentation} from "./commands/PartyCommandDocumentation";
import {QuoteCommandDocumentation} from "./commands/QuoteCommandDocumentation";
import {RegisterCommandDocumentation} from "./commands/RegisterCommandDocumentation";
import {SendingCommandDocumentation} from "./commands/SendingCommandDocumentation";
import {WhichCommandDocumentation} from "./commands/WhichCommandDocumentation";
import {WorldCommandDocumentation} from "./commands/WorldCommandDocumentation";

export class HelpDocumentation {
    public static cmdMap: Map<string, BaseCommandDocumentation> = null;

    public static BANK: BaseCommandDocumentation = new BankCommandDocumentation();
    public static CALENDAR: BaseCommandDocumentation = new CalendarCommandDocumentation();
    public static CHARACTER: BaseCommandDocumentation = new CharacterCommandDocumentation();
    public static DATE: BaseCommandDocumentation = new DateCommandDocumentation();
    public static FUND: BaseCommandDocumentation = new FundCommandDocumentation();
    public static HELP: BaseCommandDocumentation = new HelpCommandDocumentation();
    public static PARTY: BaseCommandDocumentation = new PartyCommandDocumentation();
    public static QUOTE: BaseCommandDocumentation = new QuoteCommandDocumentation();
    public static REGISTER: BaseCommandDocumentation = new RegisterCommandDocumentation();
    public static SENDING: BaseCommandDocumentation = new SendingCommandDocumentation();
    public static WHICH: BaseCommandDocumentation = new WhichCommandDocumentation();
    public static WORLD: BaseCommandDocumentation = new WorldCommandDocumentation();

    static find(command: string): MessageEmbed {
        if (this.cmdMap == null) {
            this.createMap();
        }

        let cmd = this.cmdMap.get(command);
        if (cmd == null) {
            return this.get();
        }

        return cmd.getFullDescription();
    }

    private static createMap() {
        this.cmdMap = new Map<string, BaseCommandDocumentation>();
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

    static get(): MessageEmbed {
        if (this.cmdMap == null) {
            this.createMap();
        }

        let str = "";
        this.cmdMap.forEach((value) => {
            str += "\n\n" + value.formatCommand();
        });

        return BasicEmbed.get()
            .setTitle(`Commands`)
            .setDescription(`Below is a basic overview of all commands. For a more detailed description of a command ` +
                `type, \`${Bot.PREFIX}${Commands.HELP} [command name]\`.` +
                str);
    }
}