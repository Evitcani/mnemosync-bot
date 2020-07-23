import {inject, injectable} from "inversify";
import {TYPES} from "../../../types";
import {Message} from "discord.js";
import {WhichRelatedClientResponses} from "../../../documentation/client-responses/information/WhichRelatedClientResponses";
import {PartyController} from "../../../controllers/party/PartyController";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {NPCController} from "../../../controllers/character/NPCController";
import {WorldController} from "../../../controllers/world/WorldController";
import {NPCRelatedClientResponses} from "../../../documentation/client-responses/character/NPCRelatedClientResponses";
import {MessageUtility} from "../../../utilities/MessageUtility";
import {Command} from "../../../models/generic/Command";
import {User} from "../../../entity/User";

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
        this.npcController = npcController;
        this.partyController = partyController;
        this.worldController = worldController;
    }

    async handleUserCommand(command, message, user): Promise<Message | Message[]> {

        // Get all NPCs in a given world.
        if (command.getInput() != null && command.getInput().toLowerCase() == "npc") {
            return this.fetchNPCs(command, message, user);
        }
        return this.partyController.getByGuild(message.guild.id).then((res) => {
            return message.channel.send(WhichRelatedClientResponses.LIST_ALL_PARTIES(res));
        });
    }

    async fetchNPCs (command: Command, message: Message, user: User): Promise<Message | Message[]> {
        let page = MessageUtility.getPage(command);
        let world = await this.worldController.worldSelectionFromUser(user, message);

        if (world == null) {
            return message.channel.send("No world associated with  account.");
        }

        let npcs = await this.npcController.getByWorld(world.id, page);

        if (npcs == null || npcs.length < 1) {
            return message.channel.send("No NPCs are in this world.");
        }
        npcs.sort((npc1, npc2) => {
            return npc1.name.localeCompare(npc2.name);
        });

        return message.channel.send(NPCRelatedClientResponses.DISPLAY_ALL(npcs, world, page));
    }
}