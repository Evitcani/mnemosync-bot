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
const Table_1 = require("../shared/documentation/databases/Table");
const StringUtility_1 = require("../backend/utilities/StringUtility");
const World_1 = require("./World");
const GameDate_1 = require("./GameDate");
const User_1 = require("./User");
let Sending = class Sending {
    purifyInsertUpdate() {
        this.reply = StringUtility_1.StringUtility.escapeSQLInput(this.reply);
        this.content = StringUtility_1.StringUtility.escapeSQLInput(this.content);
        // Checks if the message is replied to or not.
        this.isReplied = this.reply != null || this.noConnection || this.noReply;
    }
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
    typeorm_1.Column({ name: "world_id", nullable: true }),
    __metadata("design:type", String)
], Sending.prototype, "worldId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => World_1.World, {
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "world_id" }),
    __metadata("design:type", World_1.World)
], Sending.prototype, "world", void 0);
__decorate([
    typeorm_1.Column(type => GameDate_1.GameDate),
    __metadata("design:type", GameDate_1.GameDate)
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
    typeorm_1.Column({ nullable: true, name: "no_reply" }),
    __metadata("design:type", Boolean)
], Sending.prototype, "noReply", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, name: "no_connection" }),
    __metadata("design:type", Boolean)
], Sending.prototype, "noConnection", void 0);
__decorate([
    typeorm_1.Column({ nullable: true, name: "is_replied" }),
    __metadata("design:type", Boolean)
], Sending.prototype, "isReplied", void 0);
__decorate([
    typeorm_1.Column({ name: "to_npc_id", nullable: true }),
    __metadata("design:type", String)
], Sending.prototype, "toNpcId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => NonPlayableCharacter_1.NonPlayableCharacter, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
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
        onDelete: "SET NULL",
        eager: true
    }),
    typeorm_1.JoinColumn({ name: "from_npc_id" }),
    __metadata("design:type", NonPlayableCharacter_1.NonPlayableCharacter)
], Sending.prototype, "fromNpc", void 0);
__decorate([
    typeorm_1.Column({ name: "to_player_character_id", nullable: true }),
    __metadata("design:type", Number)
], Sending.prototype, "toPlayerCharacterId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    }),
    typeorm_1.JoinColumn({ name: "to_player_character_id" }),
    __metadata("design:type", Character_1.Character)
], Sending.prototype, "toPlayerCharacter", void 0);
__decorate([
    typeorm_1.Column({ name: "from_player_character_id", nullable: true }),
    __metadata("design:type", Number)
], Sending.prototype, "fromPlayerCharacterId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    }),
    typeorm_1.JoinColumn({ name: "from_player_character_id" }),
    __metadata("design:type", Character_1.Character)
], Sending.prototype, "fromPlayerCharacter", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    }),
    typeorm_1.JoinColumn({ name: "sending_message_from_user_id" }),
    __metadata("design:type", User_1.User)
], Sending.prototype, "sendingMessageFromUser", void 0);
__decorate([
    typeorm_1.ManyToOne(type => User_1.User, {
        nullable: true,
        onDelete: "SET NULL",
        eager: true
    }),
    typeorm_1.JoinColumn({ name: "sending_reply_from_user_id" }),
    __metadata("design:type", User_1.User)
], Sending.prototype, "sendingReplyFromUser", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Sending.prototype, "purifyInsertUpdate", null);
Sending = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.SENDING })
], Sending);
exports.Sending = Sending;
//# sourceMappingURL=Sending.js.map