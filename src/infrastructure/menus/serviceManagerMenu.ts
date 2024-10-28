import * as readline from "readline";
import { User } from "../../domain/user";

export class ServiceManagerMenu {
    getAllRequests: any;
    updateRequestByStatus: any;
    constructor(
        
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Service Manager Menu ---");
        console.log("1. ");
        console.log("2. ");
        console.log("3. Exit");
        this.curr_user = curr_user;
        this.getUserSelection();
    }

    private getUserSelection(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Select an option: ", (selection) => {
            switch (selection.trim()) {
                case "1":
                    //
                    break;
                case "2":
                    //
                    break;
                case "3":
                    console.log("Exiting the Service Manager Menu.");
                    rl.close();
                    return;
                default:
                    console.log("Invalid option. Please select again.");
                    this.displayMenu(this.curr_user);
                    break;
            }
            rl.close();
        });
    }

}