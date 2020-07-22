import {StringUtility} from "../../../utilities/StringUtility";
import {Collection, MessageEmbed} from "discord.js";
import {BasicEmbed} from "../../BasicEmbed";
import {Bot} from "../../../bot";
import {Commands} from "../../commands/Commands";
import {Subcommands} from "../../commands/Subcommands";

/**
 * A class for formatting responses related to the `$FUND` and `$BANK` commands.
 */
export class FundRelatedClientResponses {
    private static responses: Collection<number, Collection<number, string>> = FundRelatedClientResponses.createResponses();

    static NO_DEFAULT_CHARACTER (): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`No default character!`)
            .setDescription(`You have no default character.\n\n` +
                `**To create new character**\n` +
                `To create a new character, use the following command: ` +
                `\`${Bot.PREFIX}${Commands.CHARACTER} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.CREATE.name} [character name] ` +
                `${Bot.PREFIX_SUBCOMMAND}${Subcommands.PARTY.name} [party name]\`` +
                `**To check parties**\n` +
                `To check the parties in this guild, use the following command: ` +
                `\`${Bot.PREFIX}${Commands.WHICH} ${Subcommands.PARTY.name}\``);
    }

    static CHARACTER_NOT_IN_PARTY (characterName: string): MessageEmbed {
        return BasicEmbed.get()
            .setTitle(`Default character is not in a party!`)
            .setDescription(`Your character, ${characterName}, is not in a party.\n\n` +
                `**To add your character to a party**\n` +
                `To add your character to a party, use the following command: ` +
                `\`${Bot.PREFIX}${Commands.CHARACTER} ` +
                `${Bot.PREFIX_SUBCOMMAND}${Subcommands.PARTY.name} [party name]\`` +
                `**To check parties**\n` +
                `To check the parties in this guild, use the following command: ` +
                `\`${Bot.PREFIX}${Commands.WHICH} ${Subcommands.PARTY.name}\``);
    }

    static GET_MONEY(currentMoney: number, type: string, partyName: string): MessageEmbed {
        let input = StringUtility.numberWithCommas(Math.abs(currentMoney));

        return BasicEmbed.get()
            .setTitle(`Money in ${partyName}'s ${type.toLowerCase()}`)
            .addField("Current Amount", `${input} gp`, true)
            .addField("Description", FundRelatedClientResponses.getResponseBasedOnAmount(currentMoney), false);
    }

    /**
     * The response for if there is not enough money to perform a certain action.
     *
     * @param currentMoney The current amount of money in the account.
     * @param amtToWithdraw The amount of money attempted to be withdrawn.
     * @param difference The amount needed to complete the transaction.
     * @return An embed to send back to  the client.
     */
    static NOT_ENOUGH_MONEY(currentMoney: number, amtToWithdraw: number, difference: number): MessageEmbed {
        let input3 = StringUtility.numberWithCommas(Math.abs(difference));

        return this.getTwoInputEmbed(
            'Too little, too late!',
            'Remaining funds', currentMoney,
            'Attempted to withdraw', amtToWithdraw,
            `You don't have enough money to do that. You are short ${input3} gp!`);
    }

    static UPDATED_MONEY (currentMoney: number, previousAmt: number, difference: number, isWithdrawn: boolean): MessageEmbed {
        let input3 = StringUtility.numberWithCommas(Math.abs(difference));

        return this.getTwoInputEmbed(
            `You ${isWithdrawn ? "withdraw" : "add"} some money!`,
            'Current Amount', currentMoney,
            'Previous Amount', previousAmt,
            `You have updated the party funds by ${isWithdrawn ? "withdrawing" : "adding"} ${input3} gp!`);
    }

    private static getTwoInputEmbed(title: string,
                                      inputTitle1: string, currentMoney: number,
                                      inputTitle2: string, amtToWithdraw: number,
                                      description: string): MessageEmbed {
        let input1 = StringUtility.numberWithCommas(Math.abs(currentMoney));
        let input2 = StringUtility.numberWithCommas(Math.abs(amtToWithdraw));

        return BasicEmbed.get()
            .setTitle(title)
            .addField(inputTitle1, `${input1} gp`, true)
            .addField(inputTitle2, `${input2} gp`, true)
            .addField("Description", description, false);
    }

    private static getResponseBasedOnAmount(amt: number): string {
        if (amt < 1) {
            return FundRelatedClientResponses.responses.get(1).random();
        }

        if (amt < 10) {
            return FundRelatedClientResponses.responses.get(10).random();
        }

        return FundRelatedClientResponses.responses.get(100).random();
    }

    private static createResponses(): Collection<number, Collection<number, string>> {
        const collection = new Collection<number, Collection<number, string>>();

        // Responses less than one.
        let col = new Collection<number, string>();
        col.set(0, "Keeping chump change, huh?");
        col.set(1, "Guess no one can be bothered to help the party out...");
        col.set(2, "Might want to do something about that soon.");
        collection.set(1, col);

        // Responses less than 10.
        col = new Collection<number, string>();
        col.set(0, "Wow! So much money! You might be able to buy, what, a single banana?");
        col.set(1, "This is enough money for a single night at the Decadent Wyrm! ... If you flirt your way in.");
        col.set(2, "Could take that down to the Cat's Configuration! ... Only if you're living in the before-times " +
            "and you're Mila.");
        collection.set(10, col);

        col = new Collection<number, string>();
        col.set(0, "Just got started, huh? We've all been level 3.");
        col.set(1, "Hmm... The party is running low. Might be time to ask your local knife collector for a side quest.");
        col.set(2, "That's almost two whole horses! But only draft horses. Isn't it weird the big horses cost less?");
        collection.set(100, col);

        return collection;
    }
}
