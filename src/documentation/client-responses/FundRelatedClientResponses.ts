import {StringUtility} from "../../utilities/StringUtility";
import {MessageEmbed} from "discord.js";

/**
 * A class for formatting responses.
 *
 */
export class FundRelatedClientResponses {
    static NOT_ENOUGH_MONEY(currentMoney: number, amtToWithdraw: number, difference: number): MessageEmbed {
        let input1 = StringUtility.numberWithCommas(currentMoney);
        let input2 = StringUtility.numberWithCommas(amtToWithdraw);
        let input3 = StringUtility.numberWithCommas(difference);

        return this.getBasicEmbed()
            .setTitle('Too little, too late!')
            .addField('Remaining funds', input1, true)
            .addField('Attempted to withdraw', input2, true)
            .addField(null, `You don't have enough money to do that. You are short ${input3} gp!`, true);
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
