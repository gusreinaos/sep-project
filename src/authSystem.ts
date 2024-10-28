import { User } from "./domain/user";
import { Role } from "./domain/types";
import { UserManager } from "./infrastructure/repositories/userRepository";

export class AuthSystem {
    constructor(userManager: UserManager) {
        this.userManager = userManager;
        this.users = [
            new User("john", Role.CustomerService, this.userManager),
            new User("jane", Role.SeniorCustomerService, this.userManager),
            new User("alice", Role.FinancialManager, this.userManager),
            new User("tobias", Role.ProductionManager, this.userManager),
            new User("jack", Role.ServiceManager, this.userManager),
            new User("vp", Role.VP, this.userManager),
        ];
    }

    public userManager: UserManager;
    public users: User[];
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


