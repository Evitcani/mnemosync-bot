"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BasicEmbed = void 0;
const discord_js_1 = require("discord.js");
class BasicEmbed {
    /**
     * Gets the basic embed with some fields.
     */
    static get() {
        return new discord_js_1.MessageEmbed()
            .setColor('#0099ff')
            .setFooter('Created by @Evit_cani on Twitter.');
    }
    static getPageFooter(page, limit, total) {
        return `On page ${page}. ${total < limit ? `No more pages.` :
            `Add \`~next ${page + 1}\` to see the next page`}`;
    }
}
exports.BasicEmbed = BasicEmbed;
//# sourceMappingURL=BasicEmbed.js.map