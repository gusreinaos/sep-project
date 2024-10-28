import { Role } from "./types";
import { permissions } from "./permissions";
import { Request, Status } from "./request";
import { UserRepository } from "../infrastructure/repositories/userRepository";

export class User {
    private requests: Request[] = [];
    private archived: Request[] = [];

    public userId: string;
    public userName: string;
    public role: Role;


    constructor(userId: string, username: string, role: Role) {
        this.userId = userId;
        this.userName = username;
        this.role = role;
    }

    getPermissions(): string[] {
        return permissions[this.role] || [];
    }

}