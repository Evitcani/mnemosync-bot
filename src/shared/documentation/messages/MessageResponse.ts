import {Bot} from "../../../bot/bot";
import {Commands} from "../commands/Commands";
import {Subcommands} from "../commands/Subcommands";
import {StringUtility} from "../../../backend/utilities/StringUtility";
import {CharacterDTO} from "../../../backend/api/dto/model/CharacterDTO";

const PREFIX: string = "$";
const PREFIX_SUBCOMMAND: string = "~";

export const messageResponse = {
    character: {
        now_playing_as: {
            title: (name: string) => `You are now playing as ${name}`,
            desc: (newlyCreated: boolean, name: string) =>
                `You are now playing as ${newlyCreated ? "newly created character " : ""}${name}.\n\n` +
                `To switch characters, type \`${Bot.PREFIX}${Commands.CHARACTER} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.SWITCH.name} ` +
                `[character name]\`.\n\n` +
                `To view all of your characters, type ` +
                `\`${Bot.PREFIX}${Commands.WHICH} ${Commands.CHARACTER}\`.`,
        }
    },

    date: {
        get: {
            title: (name: string) => `Current date for ${name}`,
            desc: (date: string) => `It's the ${date}.`,
        }
    },

    generic: {
        action: {
            switch_to: `switch to`
        },
        command: {
            create: (type: string, createCommand: string) =>
                `To create a new ${type}, type, \`${createCommand}\`.`
        },
        could_not_get: {
            msg: (type: string) => `Could not get a ${type}.`,
        },
        display_all: {
            title: (type: string, area: string) =>
                `All ${type} in this ${area}`,
            desc: (type: string, area: string, items: any[]) =>
                `The following ${type} are in this ${area}:\n${displayAll(items, true)}`,
            desc_none: (type: string, area: string, create: string) =>
                `There are no ${type} in this ${area}.\n\n${create}`,
            desc_singular: (type: string, area: string, itemName: string) =>
                `The only ${type} in this ${area} is: ${itemName}`,
        },
        select_from_the_following: {
            title: (type: string, action: string) =>
                `Please select which ${type} you want to ${action}`,
            desc: (type: string, items: any[]) =>
                `Select from the following ${type} by pressing the given number:\n${displayAll(items, false)}`,
        }
    },

    npc: {
        display_all: {
            title: (worldName: string) => `NPCs in the world of ${worldName}`,
            desc: (worldName: string, npcs: CharacterDTO[]) =>
                `The following NPCs live in ${worldName}:\n${displayAll(npcs, true)}`,
        }
    },

    party: {
        command: {
            create: `${PREFIX}${Commands.PARTY} ${PREFIX_SUBCOMMAND}${Subcommands.CREATE} [party name]`,
        },
    },

    quote: {
        display: {
            footer: (numberOfQuotes: number) => `1 of ${StringUtility.numberWithCommas(Math.abs(numberOfQuotes))} quotes. Type ` +
                `\`${Bot.PREFIX}${Commands.QUOTE}\` to get one yourself!`
        }
    },

    sending: {
        error: {
            no_date: {
                title: () => `Message has no date!`,
                desc: (messageContents: string) =>
                    `Message has no date. Add message (in-game) date with ` +
                    `\`${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE.name} [day]/[month]/[year]\`.\n\n` +
                    `Here is your original message with the added date parameter:\n` +
                    `\`\`\`${messageContents} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.DATE.name} [day]/[month]/[year]\`\`\``,
            },
            no_message: {
                title: () => `Message has no contents!`,
                desc: (messageContents: string) =>
                    `Message has no content. Add message content with ` +
                    `\`${Bot.PREFIX_SUBCOMMAND}${Subcommands.MESSAGE.name} [message contents]\`.\n\n` +
                    `Here is your original message with the added message parameter:\n` +
                    `\`\`\`${messageContents} ${Bot.PREFIX_SUBCOMMAND}${Subcommands.MESSAGE.name} [message contents]\`\`\``,
            },
        },
    },
};

function displayAll(items: any[], displayStar: boolean): string {
    if (items == null || items.length <= 0) {
        return "";
    }

    let str = "";
    let item: {name: string}, i;
    for (i = 0; i < items.length; i++) {
        item = items[i];
        if (displayStar) {
            str += `[\`*\`] `;
        } else {
            str += `[\`${i}\`] `;
        }
        str += `${item.name}\n`;
    }

    return str;
}