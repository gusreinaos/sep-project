import { Role } from "./types";
import { permissions } from "./permissions";

export class User {
  constructor(public username: string, public role: Role) {}

  getPermissions(): string[] {
    return permissions[this.role] || [];
  }
}
