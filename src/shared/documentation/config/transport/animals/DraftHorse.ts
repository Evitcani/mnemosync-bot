import {AbstractTransportAnimal} from "./AbstractTransportAnimal";
import {CreatureSize} from "../enums/CreatureSize";

export class DraftHorse extends AbstractTransportAnimal {
    constructor() {
        super("Horse, Draft", 50, 540, CreatureSize.LARGE);
    }
}