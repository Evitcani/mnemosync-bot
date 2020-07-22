"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SendingController = void 0;
const inversify_1 = require("inversify");
const AbstractController_1 = require("./Base/AbstractController");
const Table_1 = require("../documentation/databases/Table");
let SendingController = class SendingController extends AbstractController_1.AbstractController {
    constructor() {
        super(Table_1.Table.SENDING);
    }
    /**
     * Creates a new sending.
     *
     * @param sending
     */
    create(sending) {
        return this.getRepo().save(sending);
    }
};
SendingController = __decorate([
    inversify_1.injectable(),
    __metadata("design:paramtypes", [])
], SendingController);
exports.SendingController = SendingController;
//# sourceMappingURL=SendingController.js.map