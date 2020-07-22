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
exports.Sending = void 0;
const typeorm_1 = require("typeorm");
const NonPlayableCharacter_1 = require("./NonPlayableCharacter");
const Character_1 = require("./Character");
const Table_1 = require("../documentation/databases/Table");
let Sending = class Sending {
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], Sending.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], Sending.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], Sending.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column("text", { name: "in_game_date" }),
    __metadata("design:type", String)
], Sending.prototype, "inGameDate", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], Sending.prototype, "content", void 0);
__decorate([
    typeorm_1.Column("text", { nullable: true }),
    __metadata("design:type", String)
], Sending.prototype, "reply", void 0);
__decorate([
    typeorm_1.Column({ name: "to_npc_id", nullable: true }),
    __metadata("design:type", String)
], Sending.prototype, "toNpcId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => NonPlayableCharacter_1.NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "to_npc_id" }),
    __metadata("design:type", NonPlayableCharacter_1.NonPlayableCharacter)
], Sending.prototype, "toNpc", void 0);
__decorate([
    typeorm_1.Column({ name: "from_npc_id", nullable: true }),
    __metadata("design:type", String)
], Sending.prototype, "fromNpcId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => NonPlayableCharacter_1.NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "from_npc_id" }),
    __metadata("design:type", NonPlayableCharacter_1.NonPlayableCharacter)
], Sending.prototype, "fromNpc", void 0);
__decorate([
    typeorm_1.Column({ name: "to_player_id", nullable: true }),
    __metadata("design:type", Number)
], Sending.prototype, "toPlayerId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "to_player_id" }),
    __metadata("design:type", Character_1.Character)
], Sending.prototype, "toPlayer", void 0);
__decorate([
    typeorm_1.Column({ name: "from_player_id", nullable: true }),
    __metadata("design:type", Number)
], Sending.prototype, "fromPlayerId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "from_player_id" }),
    __metadata("design:type", Character_1.Character)
], Sending.prototype, "fromPlayer", void 0);
Sending = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.SENDING })
], Sending);
exports.Sending = Sending;
//# sourceMappingURL=Sending.js.map