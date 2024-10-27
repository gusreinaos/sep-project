import { User } from "./user";
import { Role } from "./types";

export class AuthSystem {
    private users: User[] = [
        new User("john", Role.CustomerService),
        new User("jane", Role.SeniorCustomerService),
        new User("alice", Role.FinancialManager),
        new User("tobias", Role.ProductionManager),
        new User("jack", Role.ServiceManager),
        new User("vp", Role.VP)
    ];
    private currentUser: User | null = null;

    login(username: string): string {
        const user = this.users.find(u => u.username === username);
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


