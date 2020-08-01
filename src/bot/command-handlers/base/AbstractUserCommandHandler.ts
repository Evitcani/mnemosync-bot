import {injectable} from "inversify";
import {Command} from "../../../shared/models/generic/Command";
import {Message} from "discord.js";
import {UserDTO} from "../../../backend/api/dto/model/UserDTO";

@injectable()
export abstract class AbstractUserCommandHandler {
    /**
     * This method is not used by this command type.
     *
     * @param command
     * @param message
     */
    protected async handleCommand (command: Command, message: Message): Promise<Message | Message[]> {
        return undefined;
    }

    abstract async handleUserCommand (command: Command, message: Message, user: UserDTO): Promise<Message | Message[]>;
}