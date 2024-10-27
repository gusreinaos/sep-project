// Import necessary classes and types
import { User } from "./user";
import { Role } from "./types";
import { Request } from "./request"; // Assuming Request is imported from a module

// UserManager class to manage a single User instance per Role
export class UserManager {
    private usersByRole: Map<Role, User> = new Map();

    // Add a user to the role group
    addUser(user: User): string {
        if (this.usersByRole.has(user.role)) {
            return `A user with role ${user.role} already exists.`;
        }
        this.usersByRole.set(user.role, user);
        return `User with role ${user.role} has been added.`;
    }

    // Get a user by role
    getUser(role: Role): User | null {
        return this.usersByRole.get(role) || null;
    }

    // Remove a user by role
    removeUser(role: Role): string {
        if (this.usersByRole.delete(role)) {
            return `User with role ${role} has been removed.`;
        }
        return `User with role ${role} does not exist.`;
    }

    // Get all users as an array
    getAllUsers(): User[] {
        return Array.from(this.usersByRole.values());
    }

    // Update a user's role (essentially changes the user's role key)
    updateUserRole(oldRole: Role, newRole: Role): string {
        const user = this.getUser(oldRole);
        if (!user) {
            return `User with role ${oldRole} not found.`;
        }

        // Remove user from the old role
        this.removeUser(oldRole);

        // Update user's role and add them to the new role
        user.role = newRole;
        this.addUser(user);

        return `User role updated from ${oldRole} to ${newRole}.`;
    }

    // Add a request to a user's request array based on their role
    addRequestToUser(role: Role, request: Request): string {
        const user = this.getUser(role);
        if (!user) {
            return `User with role ${role} not found.`;
        }
        user['requests'].push(request);
        return `Request with ID ${request.id} has been added to user with role ${role}.`;
    }
}
