import {inject, injectable} from "inversify";
import {TYPES} from "../../../../types";
import {Message} from "discord.js";
import {WhichRelatedClientResponses} from "../../../../shared/documentation/client-responses/information/WhichRelatedClientResponses";
import {PartyController} from "../../../../backend/controllers/party/PartyController";
import {AbstractUserCommandHandler} from "../../base/AbstractUserCommandHandler";
import {WorldController} from "../../../../backend/controllers/world/WorldController";
import {NPCRelatedClientResponses} from "../../../../shared/documentation/client-responses/character/NPCRelatedClientResponses";
import {MessageUtility} from "../../../../backend/utilities/MessageUtility";
import {Command} from "../../../../shared/models/generic/Command";
import {CharacterController} from "../../../../backend/controllers/character/CharacterController";
import {UserDTO} from "@evitcani/mnemoshared/dist/src/dto/model/UserDTO";

/**
 * Handles questions about the state of the world.
 */
@injectable()
export class WhichCommandHandler extends AbstractUserCommandHandler {
    private characterController: CharacterController;
    private partyController: PartyController;
    private worldController: WorldController;

    constructor(@inject(TYPES.CharacterController) characterController: CharacterController,
                @inject(TYPES.PartyController) partyController: PartyController,
                @inject(TYPES.WorldController) worldController: WorldController) {
        super();
        this.characterController = characterController;
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

    async fetchNPCs (command: Command, message: Message, user: UserDTO): Promise<Message | Message[]> {
        let page = MessageUtility.getPage(command);
        let world = await this.worldController.worldSelectionFromUser(user, message);

        if (world == null) {
            return message.channel.send("No world associated with  account.");
        }

        let npcs = await this.characterController.getNPCByWorld(world.id);

        if (npcs == null || npcs.length < 1) {
            return message.channel.send("No NPCs are in this world.");
        }

        return message.channel.send(NPCRelatedClientResponses.DISPLAY_ALL(npcs, world, page));
    }
}