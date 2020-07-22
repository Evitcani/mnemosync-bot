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
exports.World = void 0;
const typeorm_1 = require("typeorm");
const Party_1 = require("./Party");
const StringUtility_1 = require("../utilities/StringUtility");
const NonPlayableCharacter_1 = require("./NonPlayableCharacter");
const Table_1 = require("../documentation/databases/Table");
const User_1 = require("./User");
let World = class World {
    purifyInsertUpdate() {
        this.guildId = StringUtility_1.StringUtility.escapeSQLInput(this.guildId);
        this.mapUrl = StringUtility_1.StringUtility.escapeSQLInput(this.mapUrl);
    }
};
__decorate([
    typeorm_1.PrimaryGeneratedColumn('uuid'),
    __metadata("design:type", String)
], World.prototype, "id", void 0);
__decorate([
    typeorm_1.Column("text", { name: "name" }),
    __metadata("design:type", String)
], World.prototype, "name", void 0);
__decorate([
    typeorm_1.Column({ name: "guild_id" }),
    __metadata("design:type", String)
], World.prototype, "guildId", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: "created_date" }),
    __metadata("design:type", Date)
], World.prototype, "createdDate", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: "updated_date" }),
    __metadata("design:type", Date)
], World.prototype, "updatedDate", void 0);
__decorate([
    typeorm_1.Column("text", { name: "map_url" }),
    __metadata("design:type", String)
], World.prototype, "mapUrl", void 0);
__decorate([
    typeorm_1.OneToMany(type => Party_1.Party, party => party.world, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], World.prototype, "parties", void 0);
__decorate([
    typeorm_1.OneToMany(type => NonPlayableCharacter_1.NonPlayableCharacter, character => character.world, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], World.prototype, "npcs", void 0);
__decorate([
    typeorm_1.OneToMany(type => User_1.User, user => user.defaultWorld, {
        onDelete: "SET NULL"
    }),
    __metadata("design:type", Array)
], World.prototype, "defaultOfUsers", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    typeorm_1.BeforeUpdate(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], World.prototype, "purifyInsertUpdate", null);
World = __decorate([
    typeorm_1.Entity({ name: Table_1.Table.WORLD })
], World);
exports.World = World;
//# sourceMappingURL=World.js.map