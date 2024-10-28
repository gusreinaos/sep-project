import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { Status } from "../../domain/request";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { UserRepository } from "../repositories/userRepository";

export class FinancialManagerMenu {
    constructor(
        private readonly getAssignedRequests: GetAssignedRequests,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepositoy: UserRepository
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Financial Manager Menu ---");
        console.log("1. View Assigned Requests");
        console.log("2. Add comments to Assigned Request (completion redirects request)");
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
                    this.showAssignedRequests();
                    break;
                case "2":
                    this.addCommentsToRequest();
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
            rl.close();
        });
    }

    private showAssignedRequests(): void {
        const requests = this.getAssignedRequests.execute(this.curr_user.userId);
        if(requests.length === 0) {
            console.log("No assigned requests.");
        } else {
            console.log("Assigned Requests:");
            requests.forEach(request => {
                console.log(`Request ID: ${request.requestId}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private addCommentsToRequest(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter your request id: ", (requestId) => {
            rl.question("Enter feedback on financial status: ", (financialFeedback) => {
            
                // Setting role and status internally
                const status = Status.Created;
                const role = Role.CustomerService;
                
                const requests = this.getAssignedRequests.execute(this.curr_user.userId)
                if(requests.length === 0) {
                    // get the request based on the assigned requests and the request id provided
                    const { clientId, 
                            staffId, 
                            eventName, 
                            proposedBudget, 
                            staffRequirement, 
                            date, 
                            details } = requests.filter(request => request.requestId === requestId)[0];

                    const message = this.redirectRequest.execute(
                        this.userRepositoy.getUsersByRole(Role.FinancialManager)[0].userId,
                        requestId,
                        {
                            clientId, 
                            staffId, 
                            eventName, 
                            proposedBudget, 
                            staffRequirement, 
                            date, 
                            details, 
                            status,
                            financialFeedback
                        },
                        role, 
                        );

                    console.log(message);

                } else console.log("Request not found.")
                rl.close();
                this.displayMenu(this.curr_user);
            });                     
        });
    }

}