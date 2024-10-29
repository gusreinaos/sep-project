import * as fs from 'fs';
import * as path from 'path';
import { Role } from "../../domain/types";
import { User } from "../../domain/user";

export class UserRepository {
    private users: User[] = [];
    private filePath: string = path.join(__dirname, '../persistance/users.json');

    removeAllUsers(): void {
        this.users = [];
        this.saveUsers();
    }

    constructor() {
        this.loadUsers();
    }

    // Load users from the JSON file
    private loadUsers(): void {
        try {
            if (!fs.existsSync(this.filePath)) {
                // If it doesn't exist, create it with an empty array
                fs.writeFileSync(this.filePath, JSON.stringify({ users: [] }));
            }
            const data = fs.readFileSync(this.filePath, 'utf-8');
    
            // Try parsing JSON and catch syntax errors
            try {
                //console.log(data)
                const parsedData = JSON.parse(data);
                this.users = parsedData.users || []; // Default to empty array if users key doesn't exist
            } catch (parseError) {
                console.error("JSON parse error:", parseError);
                this.users = []; // Initialize with an empty array if JSON parsing fails
            }
        } catch (error) {
            console.error("Could not load users from file:", error);
            this.users = []; // Initialize with an empty array if file reading fails
        }
    }

    // Save users to the JSON file
    private saveUsers(): void {
        try {
            const object: any = {"users": this.users}
            fs.writeFileSync(this.filePath, JSON.stringify(object, null, 2));
        } catch (error) {
            console.error("Could not save users to file:", error);
        }
    }

    // Add a new user to the repository and save to file
    addUser(user: User): void {
        this.users.push(user);
        this.saveUsers();
    }

    // Remove a user by their ID and save to file
    removeUser(userId: string): boolean {
        const index = this.users.findIndex(user => user.userName === userId);
        if (index !== -1) {
            this.users.splice(index, 1);
            this.saveUsers();
            return true;
        }
        return false;
    }

    // Update a user's data by their ID and save to file
    updateUser(userId: string, updatedData: Partial<User>): User | null {
        const user = this.users.find(user => user.userName === userId);
        if (user) {
            Object.assign(user, updatedData);
            this.saveUsers();
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

    // Get a user by username
    getUserByUsername(username: string): User | undefined {
        return this.users.find(user => user.userName === username);
    }
}
