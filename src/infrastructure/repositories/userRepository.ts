import { User } from "../../domain/user";
import { Role } from "../../domain/types";
import { Request } from "../../domain/request";

export class UserRepository {
    private users: User[] = [];

    // Add a new user to the repository
    addUser(user: User): void {
        this.users.push(user);
    }

    // Remove a user by their ID
    removeUser(userId: string): boolean {
        const index = this.users.findIndex(user => user.userName === userId);
        if (index !== -1) {
            this.users.splice(index, 1);
            return true;
        }
        return false;
    }

    // Update a user's data by their ID
    updateUser(userId: string, updatedData: Partial<User>): User | null {
        const user = this.users.find(user => user.userName === userId);
        if (user) {
            Object.assign(user, updatedData);
            return user;
        }
        return null;
    }

    // Retrieve all users
    getAllUsers(): User[] {
        return this.users;
    }

    // Get users by role
    getUsersByRole(role: Role): User[] {
        return this.users.filter(user => user.role === role);
    }

    // Get a single user by ID
    getUserById(userId: string): User | undefined {
        return this.users.find(user => user.userName === userId);
    }
}