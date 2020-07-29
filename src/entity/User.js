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
exports.User = void 0;
const Character_1 = require("./Character");
const typeorm_1 = require("typeorm");
const StringUtility_1 = require("../backend/utilities/StringUtility");
const World_1 = require("./World");
const Table_1 = require("../shared/documentation/databases/Table");
const Party_1 = require("./Party");
let User = class User {
    purifyInsertUpdate() {
        this.discord_name = StringUtility_1.StringUtility.escapeSQLInput(this.discord_name);
        this.discord_id = StringUtility_1.StringUtility.escapeSQLInput(this.discord_id);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('increment'),
    __metadata("design:type", Number)
], User.prototype, "id", void 0);
__decorate([
    typeorm_1.CreateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn(),
    __metadata("design:type", Date)
], User.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], User.prototype, "discord_name", void 0);
__decorate([
    typeorm_1.Column("text"),
    __metadata("design:type", String)
], User.prototype, "discord_id", void 0);
__decorate([
    typeorm_1.Column("int", { name: "default_character_id", nullable: true }),
    __metadata("design:type", Number)
], User.prototype, "defaultCharacterId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Character_1.Character, character => character.defaultUsers, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "default_character_id" }),
    __metadata("design:type", Character_1.Character)
], User.prototype, "defaultCharacter", void 0);
__decorate([
    typeorm_1.Column({ name: "default_world_id", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "defaultWorldId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => World_1.World, world => world.defaultOfUsers, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "default_world_id" }),
    __metadata("design:type", World_1.World)
], User.prototype, "defaultWorld", void 0);
__decorate([
    typeorm_1.Column({ name: "default_party_id", nullable: true }),
    __metadata("design:type", String)
], User.prototype, "defaultPartyId", void 0);
__decorate([
    typeorm_1.ManyToOne(type => Party_1.Party, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL"
    }),
    typeorm_1.JoinColumn({ name: "default_party_id" }),
    __metadata("design:type", Party_1.Party)
], User.prototype, "defaultParty", void 0);
__decorate([
    typeorm_1.ManyToMany(type => World_1.World, { nullable: true }),
    typeorm_1.JoinTable({ name: Table_1.Table.WORLD_OWNERS }),
    __metadata("design:type", Array)
], User.prototype, "campaignsDMing", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], User.prototype, "purifyInsertUpdate", null);
User = __decorate([
    typeorm_1.Entity({ name: "users" })
], User);
exports.User = User;
//# sourceMappingURL=User.js.map