import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { UpdateRequest } from "../../application/updateRequest";
import { Request, Status } from "../../domain/request";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { UserRepository } from "../repositories/userRepository";

export class FinancialManagerMenu {
    constructor(
        private readonly getAssignedRequests: GetAssignedRequests,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepositoy: UserRepository,
        private readonly updateRequest: UpdateRequest,
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Financial Manager Menu ---");
        console.log("1. View Assigned Requests");
        console.log("2. Add comments to Assigned Request (completion redirects request)");
        console.log("3. Approve Sub-team budget");
        console.log("4. Exit");
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
                    this.showAssignedRequests();
                    break;
                case "2":
                    rl.close();
                    this.addCommentsToRequest();
                    break;
                case "3":
                    rl.close();
                    this.delegateSubTeamBudget();
                    break;
                case "4":
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

    private showAssignedRequests(): void {
        const requests = this.getAssignedRequests.execute(this.curr_user.userId);
        if(requests.length === 0) {
            console.log("No assigned requests.");
        } else {
            console.log("Assigned Requests:");
            requests.forEach((request: Request) => {
                console.log(`Request ID: ${request.requestId}, Status: ${request.status}, Budget: ${request.proposedBudget}`);
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
            
                const status = Status.Created;
                const role = Role.CustomerService;
                
                const requests = this.getAssignedRequests.execute(this.curr_user.userId)
                
                if(requests.length > 0) {  
                    const newRequest = requests.filter(request => request.requestId === requestId)[0]
                    newRequest.financialFeedback = financialFeedback;
                    const updatedRequest = this.updateRequest.execute(requestId, newRequest)
                    const message = this.redirectRequest.execute(this.userRepositoy.getUsersByRole(Role.AdminManager)[0].userId, updatedRequest!);

                    console.log(message);

                } else console.log("No requests assigned to this user id.")
                rl.close();
                this.displayMenu(this.curr_user);
            });                     
        });
    }

    private delegateSubTeamBudget(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter request Id: ", (requestId) => {
            rl.question("Do you want to approve or reject? (ENTER: approve or reject): ", (verdict) => {
                const curr_request: Request = this.getAssignedRequests.execute(this.curr_user.userId).filter((request: Request) => request.requestId === requestId)[0];

                if (verdict.trim().toLowerCase() === "approve") {
                    curr_request.budgetApproved = true;
                    const updatedRequest = this.updateRequest.execute(requestId, curr_request)

                    this.redirectRequest.execute(
                        this.userRepositoy.getUsersByRole(Role.ProductionManager)[0].userId,
                        updatedRequest!);
    
                    console.log(`Request with ID ${requestId} has been approved.`);
                } else if (verdict.trim().toLowerCase() === "reject") {
                    console.log(`Request with ID ${requestId} has been rejected.`);
                }
                
                rl.close();
                this.displayMenu(this.curr_user);
            });
        });
    }

}