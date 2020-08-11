import {AbstractTransportAnimal} from "./AbstractTransportAnimal";
import {CreatureSize} from "../enums/CreatureSize";

export class RidingHorse extends AbstractTransportAnimal {
    constructor() {
        super("Horse, Riding", 75, 480, CreatureSize.LARGE);
    }
}