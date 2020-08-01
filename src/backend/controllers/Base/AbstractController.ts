import {injectable, unmanaged} from "inversify";
import {API} from "../../api/controller/base/API";

@injectable()
export abstract class AbstractController<T, R extends API> {
    protected api: R;

    protected constructor(@unmanaged() api: R) {
        this.api = api;
    }
}