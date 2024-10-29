import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { UpdateRequestByStatus } from "../../application/updateRequestByStatus";
import { Request, Status } from "../../domain/request";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { UserRepository } from "../repositories/userRepository";

export class AdministrationManagerMenu {
    constructor(
        private readonly getAssignedRequests: GetAssignedRequests,
        private readonly updateRequestByStatus: UpdateRequestByStatus,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepository: UserRepository
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Administration Manager Menu ---");
        console.log("1. View Assigned Requests");
        console.log("2. Approve or Reject Request");
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
                    rl.close();
                    this.showAssignedRequests(this.curr_user);
                    break;
                case "2":
                    rl.close();
                    this.approveOrRejectRequest();
                    break;
                case "3":
                    console.log("Exiting the Customer Service Menu.");
                    rl.close();
                    return;
                default:
                    console.log("Invalid option. Please select again.");
                    this.displayMenu(this.curr_user);
                    break;
            }
        });
    }

    private showAssignedRequests(curr_user: User): void {
        const requests = this.getAssignedRequests.execute(curr_user.userId);
        if(requests.length === 0) {
            console.log("No assigned requests.");
        } else {
            console.log("Assigned Requests:");
            requests.forEach((request: Request) => {
                const print = JSON.stringify(request, null, 2); //pretty print
                console.log(`Request: ${print} \n`);
            });
        }
        this.displayMenu(curr_user);
    }

    private approveOrRejectRequest(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        const requests = this.getAssignedRequests.execute(this.curr_user.userId);

        console.log("\n--- Requests for Review ---");
        if (requests.length === 0) {
            console.log("No requests found.");
            this.displayMenu(this.curr_user);
            return;
        }

        requests.forEach((request: Request) => {
            console.log(`ID: ${request.requestId}, Event Name: ${request.eventName}, Status: ${request.status}, Financial feedback: ${request.financialFeedback}`);
        });
        console.log("")
        this.getRequestAction();
    
    }

    private getRequestAction(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter the Request ID to approve or reject (or type 'exit' to return): ", (requestId) => {
            if (requestId.trim().toLowerCase() === "exit") {
                this.displayMenu(this.curr_user);
                rl.close();
                return;
            }

            rl.question("Do you want to approve or reject the request? (Type 'approve' or 'reject'): ", (action) => {

                if (action.trim().toLowerCase() === "approve") {
                    const request = this.updateRequestByStatus.execute(requestId, Status.Approved)
                    console.log(`Request with ID ${requestId} has been approved.`);
                    
                    const message = this.redirectRequest.execute(
                        this.userRepository.getUsersByRole(Role.FinancialManager)[0].userId, request!);

                } else if (action.trim().toLowerCase() === "reject") {
                    this.updateRequestByStatus.execute(requestId, Status.Rejected)
                    console.log(`Request with ID ${requestId} has been rejected.`);
                }

                rl.close();
                this.displayMenu(this.curr_user);
            });
        });
    }


}