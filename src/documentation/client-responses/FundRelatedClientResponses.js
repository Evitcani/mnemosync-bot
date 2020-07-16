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
        let input3 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(difference));
        return this.getTwoInputEmbed('Too little, too late!', 'Remaining funds', currentMoney, 'Attempted to withdraw', amtToWithdraw, `You don't have enough money to do that. You are short ${input3} gp!`);
    }
    static UPDATED_MONEY(currentMoney, previousAmt, difference, isWithdrawn) {
        let input3 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(difference));
        return this.getTwoInputEmbed(`You ${isWithdrawn ? "withdraw" : "add"} some money!`, 'Current Amount', currentMoney, 'Previous Amount', previousAmt, `You have updated the party funds by ${isWithdrawn ? "withdrawing" : "adding"} ${input3} gp!`);
    }
    static getTwoInputEmbed(title, inputTitle1, currentMoney, inputTitle2, amtToWithdraw, description) {
        let input1 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(currentMoney));
        let input2 = StringUtility_1.StringUtility.numberWithCommas(Math.abs(amtToWithdraw));
        return this.getBasicEmbed()
            .setTitle(title)
            .addField(inputTitle1, `${input1} gp`, true)
            .addField(inputTitle2, `${input2} gp`, true)
            .addField("Description", description, false);
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