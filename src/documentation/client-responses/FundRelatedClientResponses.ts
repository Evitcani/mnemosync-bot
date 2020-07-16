import {StringUtility} from "../../utilities/StringUtility";
import {MessageEmbed} from "discord.js";

/**
 * A class for formatting responses.
 *
 */
export class FundRelatedClientResponses {
    static NOT_ENOUGH_MONEY(currentMoney: number, amtToWithdraw: number, difference: number): MessageEmbed {
        let input1 = StringUtility.numberWithCommas(Math.abs(currentMoney));
        let input2 = StringUtility.numberWithCommas(Math.abs(amtToWithdraw));
        let input3 = StringUtility.numberWithCommas(Math.abs(difference));

        return this.getBasicEmbed()
            .setTitle('Too little, too late!')
            .addField('Remaining funds', `${input1} gp`, true)
            .addField('Attempted to withdraw', `${input2} gp`, true)
            .addField("Description", `You don't have enough money to do that. You are short ${input3} gp!`, false);
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
