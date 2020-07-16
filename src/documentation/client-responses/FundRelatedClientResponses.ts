import {StringUtility} from "../../utilities/StringUtility";
import {MessageEmbed} from "discord.js";

/**
 * A class for formatting responses.
 *
 */
export class FundRelatedClientResponses {
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

        return this.getBasicEmbed()
            .setTitle(title)
            .addField(inputTitle1, `${input1} gp`, true)
            .addField(inputTitle2, `${input2} gp`, true)
            .addField("Description", description, false);
    }

    /**
     * Gets the
     */
    private static getBasicEmbed() : MessageEmbed {
        return new MessageEmbed()
            .setColor('#0099ff')
            .setFooter('Created by @Evit_cani on Twitter.')
            .setTimestamp();
    }
}
