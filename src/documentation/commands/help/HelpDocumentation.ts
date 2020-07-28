import {BaseCommandDocumentation} from "./BaseCommandDocumentation";
import {Subcommands} from "../Subcommands";
import {Commands} from "../Commands";
import {MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Bot} from "../../../bot";
import {CommandStrut} from "../CommandStrut";

export class HelpDocumentation {
    public static cmdMap: Map<string, BaseCommandDocumentation> = null;

    public static BANK: BaseCommandDocumentation = new class extends BaseCommandDocumentation {
        getBasicDescription(): string {
            return `Used to access the funds in the bank for the party.`;
        }

        getCommand(): string {
            return Commands.BANK;
        }

        getFullDescription(): MessageEmbed {
            return BasicEmbed.get()
                .setTitle(`Bank Command`)
                .setDescription(`${this.getBasicDescription()} You must have a character in a party to be able to ` +
                    `use this command. If given no arguments, it will print the current amount in the bank.\n\n` +
                    `**Adding Money**\n` +
                    `If given arguments, it will add or subtract that amount from the current amount. To add more ` +
                    `money, type out the amount you wish to add like the following:` +
                    `\`\`\`${Bot.PREFIX}${this.getCommand()} 1g 2 silver 3 cp\`\`\`` +
                    `This will add \`1 gold, 2 silver and 3 copper\` to the current bank fund.\n\n` +
                    `**Removing Money**\n` +
                    `If given arguments, it will add or subtract that amount from the current amount. You must add a ` +
                    `\`-\` sign to any of the numbers to indicate a removal. To remove money, type out the amount ` +
                    `you wish to remove like the following:` +
                    `\`\`\`${Bot.PREFIX}${this.getCommand()} 1g -2 silver 3 cp\`\`\`` +
                    `This will remove \`1 gold, 2 silver and 3 copper\` from the current bank fund.\n\n` +
                    `**Subcommands**\n` +
                    `${this.formatSubcommands()}`);
        }

        getSubcommands(): Map<CommandStrut, string> {
            let map = new Map<CommandStrut, string>();
            map.set(Subcommands.CREATE, `Creates a new bank fund for the party. Requires no arguments.`);
            return undefined;
        }
    };

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
    }

    static get(): MessageEmbed {
        let str = "";
        str += this.BANK.formatCommand() + "\n\n";

        return BasicEmbed.get()
            .setTitle(`Commands`)
            .setDescription(`Below is a basic overview of all commands. For a more detailed description of a command ` +
                `type, \`${Bot.PREFIX}${Commands.HELP} [command name]\`.\n\n` +
                str);
    }
}