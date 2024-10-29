import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { CreateStaffRequest } from "../../application/staff/createStaffRequest";
import { GetAllStaff } from "../../application/staff/getAllStaff";
import { GetAvailableStaff } from "../../application/staff/getAvailableStaff";
import { UpdateRequestByStatus } from "../../application/updateRequestByStatus";
import { Request, Status } from "../../domain/request";
import { Staff } from "../../domain/staff";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { RequestRepository } from "../repositories/requestRepository";
import { UserRepository } from "../repositories/userRepository";

export class ProductionManagerMenu {
    constructor(
        private readonly getAvailableStaff: GetAvailableStaff,
        private readonly getAllStaff: GetAllStaff,
        private readonly getAssignedRequests: GetAssignedRequests,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepositoy: UserRepository,
        private readonly updateRequestByStatus: UpdateRequestByStatus,
        private readonly createStaffRequest: CreateStaffRequest,
        private readonly requestRepository: RequestRepository,
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Production Manager Menu ---");
        console.log("1. Show All Staff");
        console.log("2. Show Available Staff");
        console.log("3. Check sub-team comments (displalys assigned requests)");
        console.log("4. Request Budget check from Financial Manager");
        console.log("5. Update application status to in-progress");
        console.log("6. Request additional staff");
        console.log("7. Exit");
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
                    this.showAllStaff();
                    break;
                case "2":
                    rl.close();
                    this.showAvailableStaff();
                    break;
                case "3":
                    rl.close();
                    this.reviewSubTeamComments();
                    break;
                case "4":
                    rl.close();
                    this.requestBudgetCheck();
                    break;
                case "5":
                    rl.close();
                    this.updateApplicationStatus();
                    break;
                case "6":
                    rl.close();
                    this.requestAdditionalStaff();
                    break;
                case "7":
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

    private showAllStaff(): void {
        const availableStaff = this.getAllStaff.execute();
        if(availableStaff.length === 0) {
            console.log("No available staff.");
        } else {
            console.log("All Staff:");
            availableStaff.forEach((staff: Staff) => {
                console.log(`Id: ${staff.staffId}, Available: ${staff.available}, Role: ${staff.staffRole}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private showAvailableStaff(): void {
        const availableStaff = this.getAvailableStaff.execute();
        if(availableStaff.length === 0) {
            console.log("No available staff.");
        } else {
            console.log("Available Staff:");
            availableStaff.forEach((staff: Staff) => {
                console.log(`Id: ${staff.staffId}, Role: ${staff.staffRole}`);
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
                console.log(`RequestID: ${request.requestId}, Budget: ${request.eventDetails.budget}, Comments: ${request.eventDetails.details}, Bugdet Approved?: ${request.budgetApproved}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private requestBudgetCheck(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter request Id to send to financial manager: ", (requestId) => {
            const request = this.requestRepository.getRequestById(requestId)
            const message = this.redirectRequest.execute(
                this.userRepositoy.getUsersByRole(Role.FinancialManager)[0].userId, request!);
                
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

        rl.question("Enter request Id to update status to in-progress: ", (requestId) => {
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