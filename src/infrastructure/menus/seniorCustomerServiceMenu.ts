import * as readline from "readline";
import { GetAllRequests } from "../../application/getAllRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { UpdateRequestByStatus } from "../../application/updateRequestByStatus";
import { Request } from "../../domain/request";
import { RequestRepository } from "../repositories/requestRepository";

export class SeniorCustomerServiceMenu {
    constructor(
        private readonly getAllRequests: GetAllRequests,
        private readonly updateRequestByStatus: UpdateRequestByStatus,
        private readonly redirectRequest: RedirectRequest,
        private readonly requestRepository: RequestRepository) {}

    displayMenu(): void {
        console.log("\n--- Senior Customer Service Menu ---");
        console.log("1. Review requests");
        console.log("2. Redirect request to administration manager");
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
                    rl.close();
                    this.reviewRequests();
                    break;
                case "2":
                    rl.close();
                    this.redirectRequestCommand();
                    break; // Fixed the missing break statement
                case "3":
                    console.log("Exiting the menu.");
                    rl.close();
                    return;
                default:
                    console.log("Invalid option. Please select again.");
                    this.displayMenu();
                    break;
            }
        });
    }

    private reviewRequests(): void {
        const requests = this.getAllRequests.execute();

        console.log("\n--- Requests for Review ---");
        if (requests.length === 0) {
            console.log("No requests found.");
            this.displayMenu();
            return;
        }

        requests.forEach((request: Request) => {
            const print = JSON.stringify(request, null, 2); // Pretty print
            console.log(`Request: ${print}`);
        });

        this.displayMenu()

    }


    private redirectRequestCommand(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter the Request ID to review: ", (requestId) => {
            if (requestId.trim().toLowerCase() === "exit") {
                this.displayMenu();
                rl.close();
                return;
            }

            // Check if requestId is valid (assumed to be non-empty)
            if (!requestId.trim()) {
                console.log("Invalid Request ID. Please enter a valid ID.");
                rl.close();
                this.displayMenu();
                return;
            }

            rl.question("Do you want to approve the request's feasibility and redirect it to the financial manager? (yes/no) ", (action) => {
                if (action.trim().toLowerCase() === "yes") {
                    rl.question("Specify your financial manager ID: ", (targetId) => {
                        if (!targetId.trim()) {
                            console.log("Invalid Financial Manager ID. Please provide a valid ID.");
                            rl.close();
                            this.displayMenu();
                            return;
                        }
                        const request = this.requestRepository.getRequestById(requestId)
                        this.redirectRequest.execute(targetId, request!);
                        console.log(`Request with ID ${requestId} has been redirected to Financial Manager with ID ${targetId}.`);
                        rl.close();
                        this.displayMenu();
                    });
                } else if (action.trim().toLowerCase() === "no") {
                    console.log("Request not redirected.");
                    rl.close();
                    this.displayMenu();
                } else {
                    console.log("Invalid input. Please respond with 'yes' or 'no'.");
                    rl.close();
                    this.displayMenu();
                }
            });
        });
    }
}
