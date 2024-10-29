import { permissions } from "./permissions";
import { Role } from "./types";

export class User {

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