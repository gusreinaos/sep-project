import { User } from "./domain/user";
import { UserRepository } from "./infrastructure/repositories/userRepository";

export class AuthSystem {
    constructor(private readonly userRepository: UserRepository) {}

    private currentUser: User | null = null;

    login(username: string): string {
        const user = this.userRepository.getUserByUsername(username);
        if (user) {
            this.currentUser = user;
            return `Welcome, ${username}! Role: ${user.role}`;
        }
        return "User not found!";
    }

    logout(): string {
        if (this.currentUser) {
            this.currentUser = null;
            return "Logged out successfully!";
        }
        return "No user is currently logged in.";
    }

    getCurrentUser(): User | null {
        return this.currentUser;
    }
}


