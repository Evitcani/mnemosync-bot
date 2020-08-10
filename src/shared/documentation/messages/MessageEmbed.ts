import {BasicEmbed} from "../BasicEmbed";
import {messageResponse} from "./MessageResponse";
import {CharacterDTO} from "mnemoshared/dist/src/dto/model/CharacterDTO";

export const messageEmbed = {
    character: {
        now_playing_as: (character: CharacterDTO, newlyCreated: boolean) => {
            const embed = BasicEmbed.get();
            embed.setTitle(messageResponse.character.now_playing_as.title(character.name));
            if (character.img_url != null) {
                embed.setThumbnail(character.img_url);
            }

            embed.setDescription(messageResponse.character.now_playing_as.desc(newlyCreated,
                character.name));

            return embed;
        }
    },

    generic: {
        select_from_the_following: (type: {plural: string, singular: string}, action: string, items: any[]) => {
            return BasicEmbed.get()
                .setTitle(messageResponse.generic.select_from_the_following.title(type.singular, action))
                .setDescription(messageResponse.generic.select_from_the_following.desc(type.plural, items));
        },
        display_all: (type: {plural: string, singular: string}, are: {plural: string, singular: string}, createCommand: string, items: any[]) => {
            if (!items || items.length <= 0) {
                return BasicEmbed.get()
                    .setTitle(messageResponse.generic.display_all.title(type.plural, are.singular))
                    .setDescription(messageResponse.generic.display_all.desc_none(type.singular, are.singular,
                        messageResponse.generic.command.create(type.singular, createCommand)));
            }

            if (items.length == 1) {
                return BasicEmbed.get()
                    .setTitle(messageResponse.generic.display_all.title(type.plural, are.singular))
                    .setDescription(messageResponse.generic.display_all.desc_singular(type.singular, are.singular, items[0].name));
            }

            return BasicEmbed.get()
                .setTitle(messageResponse.generic.display_all.title(type.plural, are.singular))
                .setDescription(messageResponse.generic.display_all.desc(type.plural, are.singular, items));
        }
    }
};