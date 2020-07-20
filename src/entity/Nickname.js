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
exports.Nickname = void 0;
const typeorm_1 = require("typeorm");
const Character_1 = require("./Character");
const Table_1 = require("../documentation/databases/Table");
let Nickname = class Nickname {
};
__decorate([
    typeorm_1.PrimaryColumn("serial"),
    __metadata("design:type", Number)
], Nickname.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Nickname.prototype, "discord_id", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Nickname.prototype, "name", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character),
    __metadata("design:type", Character_1.Character)
], Nickname.prototype, "character", void 0);
Nickname = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.USER_TO_CHARACTER })
], Nickname);
exports.Nickname = Nickname;
//# sourceMappingURL=Nickname.js.map