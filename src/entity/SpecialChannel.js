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
exports.SpecialChannel = void 0;
const SpecialChannelDesignation_1 = require("../enums/SpecialChannelDesignation");
const typeorm_1 = require("typeorm");
let SpecialChannel = class SpecialChannel {
};
__decorate([
    typeorm_1.PrimaryColumn("serial"),
    __metadata("design:type", Number)
], SpecialChannel.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], SpecialChannel.prototype, "guild_id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], SpecialChannel.prototype, "channel_id", void 0);
__decorate([
    typeorm_1.Column(),
    __metadata("design:type", Number)
], SpecialChannel.prototype, "designation", void 0);
SpecialChannel = __decorate([
    typeorm_1.Entity({ name: "special_channels" })
], SpecialChannel);
exports.SpecialChannel = SpecialChannel;
//# sourceMappingURL=SpecialChannel.js.map