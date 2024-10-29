import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { CreateStaffRequest } from "../../application/staff/createStaffRequest";
import { GetAvailableStaff } from "../../application/staff/getAvailableStaff";
import { UpdateRequestByStatus } from "../../application/updateRequestByStatus";
import { Request, Status } from "../../domain/request";
import { Staff } from "../../domain/staff";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { UserRepository } from "../repositories/userRepository";

export class ServiceManagerMenu {
    getAllRequests: any;
    constructor(
        private readonly getAvailableStaff: GetAvailableStaff,
        private readonly getAssignedRequests: GetAssignedRequests,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepositoy: UserRepository,
        private readonly updateRequestByStatus: UpdateRequestByStatus,
        private readonly createStaffRequest: CreateStaffRequest
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Service Manager Menu ---");
        console.log("1. Show available staff");
        console.log("2. Check sub-team comments");
        console.log("3. Request Budget check from Financial Manager");
        console.log("4. Update application status to in-progress");
        console.log("5. Request additional staff");
        console.log("6. Exit");
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
                    this.showAvailableStaff();
                    break;
                case "2":
                    this.reviewSubTeamComments();
                    break;
                case "3":
                    this.requestBudgetCheck();
                    break;
                case "4":
                    this.updateApplicationStatus();
                    break;
                case "5":
                    this.requestAdditionalStaff();
                    break;
                case "6":
                    console.log("Exiting the Production Manager Menu.");
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

    private showAvailableStaff(): void {
        const availableStaff = this.getAvailableStaff.execute();
        if(availableStaff.length === 0) {
            console.log("No available staff.");
        } else {
            console.log("Available Staff:");
            availableStaff.forEach((staff: Staff) => {
                console.log(`Id: ${staff.staffId}, Available: ${staff.available}, Role: ${staff.staffRole}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private reviewSubTeamComments(): void {
        console.log("Reviewing sub-team comments.");
        const requests = this.getAssignedRequests.execute(this.curr_user.userId);
        if(requests.length === 0) {
            console.log("No assigned requests.");
        } else {
            console.log("SubTeam Comments:");
            requests.forEach(request => {
                console.log(`RequestID: ${request.requestId}, Budget: ${request.eventDetails.budget}, Comments: ${request.eventDetails.details}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private requestBudgetCheck(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter request Id to send to financial manager", (requestId) => {
            const message = this.redirectRequest.execute(
                this.userRepositoy.getUsersByRole(Role.FinancialManager)[0].userId, requestId);
                
            console.log(message);
            rl.close();
            this.displayMenu(this.curr_user);
        });    
    }

    private updateApplicationStatus(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter request Id to update status to in-progress", (requestId) => {
            const curr_request: Request = this.getAssignedRequests.execute(this.curr_user.userId).filter((request: Request) => request.requestId === requestId)[0];
            if(curr_request.budgetApproved){
                const message = this.updateRequestByStatus.execute(requestId, Status.InProgress);
                
                console.log(message);
            } else {
                console.log("Budget not approved yet.");
            }
            rl.close();
            this.displayMenu(this.curr_user);
        });
    }

    private requestAdditionalStaff(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

            rl.question("Enter staff ID: ", (staffId) => {
                rl.question("Enter requesting department: ", (requestingDepartment) => {
                    rl.question("Enter years of experience needed: ", (yearsOfExperience) => {
                        rl.question("Enter job title: ", (jobTittle) => {
                            rl.question("Enter job description: ", (jobDescription) => {
                                rl.question("Enter contract type: ", (contractType) => {
                                    const response = this.createStaffRequest.execute(staffId, requestingDepartment, Number(yearsOfExperience), jobTittle, jobDescription, contractType); 
                                    rl.close();
                                    this.displayMenu(this.curr_user);
                                });
                            });
                        });
                    });
                });
            });
    }
}