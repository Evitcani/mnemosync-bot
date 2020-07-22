import {inject, injectable} from "inversify";
import {TYPES} from "../types";
import {Command} from "../models/generic/Command";
import {Message} from "discord.js";
import {WhichRelatedClientResponses} from "../documentation/client-responses/WhichRelatedClientResponses";
import {PartyController} from "../controllers/PartyController";
import {AbstractUserCommandHandler} from "./base/AbstractUserCommandHandler";
import {NPCController} from "../controllers/NPCController";
import {WorldController} from "../controllers/WorldController";
import {NPCRelatedClientResponses} from "../documentation/client-responses/NPCRelatedClientResponses";

/**
 * Handles questions about the state of the world.
 */
@injectable()
export class WhichCommandHandler extends AbstractUserCommandHandler {
    private npcController: NPCController;
    private partyController: PartyController;
    private worldController: WorldController;

    constructor(@inject(TYPES.NPCController) npcController: NPCController,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.partyController = partyController;
    }

    async handleUserCommand(command, message, user): Promise<Message | Message[]> {

        // Get all NPCs in a given world.
        if (command.getInput() != null && command.getInput().toLowerCase() == "npc") {
            return this.worldController.worldSelectionFromUser(user, message).then((world) => {
                if (world == null) {
                    return message.channel.send("No world associated with  account.");
                }

                return this.npcController.getByWorld(world.id).then((npcs) => {
                    if (npcs == null || npcs.length < 1) {
                        return message.channel.send("No NPCs are in this world.");
                    }
                    npcs.sort((npc1, npc2) => {
                        return npc1.name.localeCompare(npc2.name);
                    });

                    return message.channel.send(NPCRelatedClientResponses.DISPLAY_ALL(npcs, world));
                });
            });
        }
        return this.partyController.getByGuild(message.guild.id).then((res) => {
            return message.channel.send(WhichRelatedClientResponses.LIST_ALL_PARTIES(res));
        });
    }
}