import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { UpdateRequest } from "../../application/updateRequest";
import { Request } from "../../domain/request";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { UserRepository } from "../repositories/userRepository";

export class SubTeamMenu {
    constructor(
        private readonly updateRequest: UpdateRequest,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepositoy: UserRepository,
        private readonly getAssignedRequests: GetAssignedRequests
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- SubTeam Menu ---");
        console.log("1. Show the team's assigned requests");
        console.log("2. Submit Plans");
        console.log("3. Submit a Budget Request and submit");
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
                    this.executeSubmitPlans();
                    break;
                case "3":
                    rl.close();
                    this.executeSubmitBudgetRequest();
                    break;
                case "4":
                    console.log("Exiting the Service Manager Menu.");
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
                console.log(`RequestID: ${request.requestId}, Event Details: ${request.eventDetails.details}, Budget: ${request.eventDetails.budget}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private executeSubmitPlans(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter chosen request id: ", (requestId) => {
            rl.question("Enter plans for the event: ", (plans) => {
                const updatedRequest: Request = this.getAssignedRequests.execute(this.curr_user.userId).filter((request: Request) => request.requestId === requestId)[0];
                updatedRequest.eventDetails.details = plans;
                console.log(updatedRequest)
                const message = this.updateRequest.execute(requestId, updatedRequest);
                
                console.log(message);
                console.log("Plans submitted successfully, please add budget.");
                rl.close();
                this.displayMenu(this.curr_user);
            });
        });
        
    }

    private executeSubmitBudgetRequest(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter chosen request id: ", (requestId) => {
            rl.question("Enter propsed budget for the event (WARNING completion submits request to manager): ", (budget) => {
                const updatedRequest: Request = this.getAssignedRequests.execute(this.curr_user.userId).filter((request: Request) => request.requestId === requestId)[0];
                updatedRequest.eventDetails.budget = parseInt(budget);
                
                const newRequest = this.updateRequest.execute(requestId, updatedRequest);
                
                console.log("new Request", newRequest)
            
                //send to production manager
                const message = this.redirectRequest.execute(
                    this.userRepositoy.getUsersByRole(Role.ProductionManager)[0].userId,
                    newRequest!);

                console.log(message);

                rl.close();
                this.displayMenu(this.curr_user);
            });
        });
    }
}