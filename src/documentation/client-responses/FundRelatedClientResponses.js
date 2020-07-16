"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FundRelatedClientResponses = void 0;
const StringUtility_1 = require("../../utilities/StringUtility");
const discord_js_1 = require("discord.js");
/**
 * A class for formatting responses.
 *
 */
class FundRelatedClientResponses {
    static NOT_ENOUGH_MONEY(currentMoney, amtToWithdraw, difference) {
        let input1 = StringUtility_1.StringUtility.numberWithCommas(currentMoney);
        let input2 = StringUtility_1.StringUtility.numberWithCommas(amtToWithdraw);
        let input3 = StringUtility_1.StringUtility.numberWithCommas(difference);
        return this.getBasicEmbed()
            .setTitle('Too little, too late!')
            .addField('Remaining funds', input1, true)
            .addField('Attempted to withdraw', input2, true)
            .addField(null, `You don't have enough money to do that. You are short ${input3} gp!`, true);
    }
    /**
     * Gets the
     */
    static getBasicEmbed() {
        return new discord_js_1.MessageEmbed()
            .setColor('#0099ff')
            .setFooter('Created by @Evit_cani on Twitter.')
            .setTimestamp();
    }
}
exports.FundRelatedClientResponses = FundRelatedClientResponses;
//# sourceMappingURL=FundRelatedClientResponses.js.map