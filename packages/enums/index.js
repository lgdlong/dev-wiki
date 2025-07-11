"use strict";
// packages/types/index.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountStatus = exports.AccountRole = void 0;
var AccountRole;
(function (AccountRole) {
    AccountRole["USER"] = "user";
    AccountRole["ADMIN"] = "admin";
    AccountRole["MODERATOR"] = "moderator";
})(AccountRole || (exports.AccountRole = AccountRole = {}));
var AccountStatus;
(function (AccountStatus) {
    AccountStatus["ACTIVE"] = "active";
    AccountStatus["INACTIVE"] = "inactive";
    AccountStatus["BANNED"] = "banned";
})(AccountStatus || (exports.AccountStatus = AccountStatus = {}));
