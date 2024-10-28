import * as readline from "readline";
import { CreateEventRequest } from "../../application/createEventRequest";
import { Status } from "../../domain/request";
import { Role } from "../../domain/types";

export class CustomerServiceMenu {
    constructor(
        private readonly createEventRequest: CreateEventRequest
    ) {}

    displayMenu(): void {
        console.log("\n--- Customer Service Menu ---");
        console.log("1. Register a new client");
        console.log("2. Create an event request");
        console.log("3. Exit");
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
                    //this.registerClient();
                    break;
                case "2":
                    this.createEventRequestInput();
                    break;
                case "3":
                    console.log("Exiting the Customer Service Menu.");
                    rl.close();
                    return;
                default:
                    console.log("Invalid option. Please select again.");
                    this.displayMenu();
                    break;
            }
            rl.close();
        });
    }

    private createEventRequestInput(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter client ID: ", (clientId) => {
            rl.question("Enter staff ID: ", (staffId) => {
                rl.question("Enter event name: ", (eventName) => {
                    rl.question("Enter proposed budget: ", (proposedBudget) => {
                        rl.question("Enter staff requirement: ", (staffRequirement) => {
                            rl.question("Enter event date (YYYY-MM-DD): ", (date) => {
                                rl.question("Enter event details: ", (details) => {
                                    // Setting role and status internally
                                    const status = Status.Created;
                                    const role = Role.CustomerService;

                                    const message = this.createEventRequest.execute(
                                        clientId,
                                        staffId,
                                        eventName,
                                        parseFloat(proposedBudget),
                                        parseInt(staffRequirement),
                                        new Date(date),
                                        details,
                                        status,
                                        role
                                    );

                                    console.log(message);
                                    rl.close();
                                    this.displayMenu();
                                });
                            });
                        });
                    });
                });
            });
        });
    }

}