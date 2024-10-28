import * as readline from "readline";
import { GetAllRequests } from "../../application/getAllRequests";
import { UpdateRequestByStatus } from "../../application/updateRequestByStatus";
import { Request, Status } from "../../domain/request";

export class SeniorCustomerServiceMenu {
    constructor(
        private readonly getAllRequests: GetAllRequests,
        private readonly updateRequestByStatus: UpdateRequestByStatus) {}

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
                    this.reviewRequests()
                    break;
                case "2":
                    // this.redirectRequestCommand()
                case "3":
                    console.log("Invalid option. Please select again.");
                    this.displayMenu();
                    break;
            }
            rl.close();
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
            const print = JSON.stringify(request, null, 2); //pretty print
            console.log(`Request: ${print}`);
        });

        this.getRequestAction();
    }

    // private redirectRequestCommand(): void {
    //     this.redirectRequest.execute(user)// TODO

    // }

    private getRequestAction(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter the Request ID to approve or reject (or type 'exit' to return): ", (requestId) => {
            if (requestId.trim().toLowerCase() === "exit") {
                this.displayMenu();
                rl.close();
                return;
            }

            rl.question("Do you want to approve or reject the request? (Type 'approve' or 'reject'): ", (action) => {

                if (action.trim().toLowerCase() === "approve") {
                    this.updateRequestByStatus.execute(requestId, Status.Approved)
                    console.log(`Request with ID ${requestId} has been approved.`);
                } else if (action.trim().toLowerCase() === "reject") {
                    this.updateRequestByStatus.execute(requestId, Status.Rejected)
                    console.log(`Request with ID ${requestId} has been rejected.`);
                }

                rl.close();
                this.displayMenu();
            });
        });
    }
}
