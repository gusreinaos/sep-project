import { permissions } from "./permissions";
import { Request } from "./request";
import { Role } from "./types";

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