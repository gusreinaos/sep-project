import * as readline from "readline";
import { GetAssignedRequests } from "../../application/getAssignedRequests";
import { RedirectRequest } from "../../application/redirectRequest";
import { CreateStaffRequest } from "../../application/staff/createStaffRequest";
import { GetAllStaff } from "../../application/staff/getAllStaff";
import { GetAssignedStaffRequests } from "../../application/staff/getAssignedStaffRequests";
import { GetAvailableStaff } from "../../application/staff/getAvailableStaff";
import { UpdateRequestByStatus } from "../../application/updateRequestByStatus";
import { Request, Status } from "../../domain/request";
import { Staff } from "../../domain/staff";
import { StaffRequest } from "../../domain/staffRequest";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { RequestRepository } from "../repositories/requestRepository";
import { UserRepository } from "../repositories/userRepository";

export class ServiceManagerMenu {
    getAllRequests: any;
    constructor(
        private readonly getAvailableStaff: GetAvailableStaff,
        private readonly getAllStaff: GetAllStaff,
        private readonly getAssignedRequests: GetAssignedRequests,
        private readonly redirectRequest: RedirectRequest,
        private readonly userRepositoy: UserRepository,
        private readonly updateRequestByStatus: UpdateRequestByStatus,
        private readonly createStaffRequest: CreateStaffRequest,
        private readonly requestRepository: RequestRepository,
        private readonly getAssignedStaffRequests: GetAssignedStaffRequests
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Service Manager Menu ---");
        console.log("1. Show All Staff");
        console.log("2. Show available staff");
        console.log("3. Distribute request to sub-team")
        console.log("4. Check sub-team comments (displalys assigned requests)");
        console.log("5. Request Budget check from Financial Manager");
        console.log("6. Update application status to in-progress");
        console.log("7. Request additional staff");
        console.log("8. List additional staff requests");
        console.log("9. Exit");
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
                    this.distributeTask();
                    break;
                case "4":
                    rl.close();
                    this.reviewSubTeamComments();
                    break;
                case "5":
                    rl.close();
                    this.requestBudgetCheck();
                    break;
                case "6":
                    rl.close();
                    this.updateApplicationStatus();
                    break;
                case "7":
                    rl.close();
                    this.requestAdditionalStaff();
                    break;
                case "8":
                    rl.close();
                    this.getAdditionalStaffRequests();
                case "9":
                    console.log("Exiting the Production Manager Menu.");
                    rl.close();
                    return;
                default:
                    console.log("Invalid option. Please select again.");
                    this.displayMenu(this.curr_user);
                    break;
            }
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
                console.log(`Id: ${staff.staffId}, Available: ${staff.available}, Role: ${staff.staffRole}`);
            });
        }
        this.displayMenu(this.curr_user);
    }

    private distributeTask(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter request ID to redirect to subteam: ", (requestId) => {
            const message = this.redirectRequest.execute(this.userRepositoy.getUsersByRole(Role.SubTeamUser)[0].userId, this.requestRepository.getRequestById(requestId)!);
            console.log(message);
            rl.close();
            this.displayMenu(this.curr_user);
        });
    }

    private reviewSubTeamComments(): void {
        console.log("\n Event Details below (subteam comments).");
        const requests = this.getAssignedRequests.execute(this.curr_user.userId);
        if(requests.length === 0) {
            console.log("No assigned requests.");
        } else {
            console.log("SubTeam Comments:");
            requests.forEach(request => {
                console.log(`RequestID: ${request.requestId}, Budget: ${request.eventDetails.budget}, Comments: ${request.eventDetails.details}, Bugdet Approved By Financial Manager: ${request.budgetApproved}`);
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

            rl.question("Enter requesting department: ", (requestingDepartment) => {
                rl.question("Enter years of experience needed: ", (yearsOfExperience) => {
                    rl.question("Enter job title: ", (jobTittle) => {
                        rl.question("Enter job description: ", (jobDescription) => {
                            rl.question("Enter contract type: ", (contractType) => {
                                const response = this.createStaffRequest.execute(this.userRepositoy.getUsersByRole(Role.HR)[0].userId, requestingDepartment, Number(yearsOfExperience), jobTittle, jobDescription, contractType); 
                                rl.close();
                                if(response) console.log("Staff request has been created successfully and redirected to the HR department")
                                this.displayMenu(this.curr_user);
                            });
                        });
                    });
                });
            });
    }

    private getAdditionalStaffRequests(): void {
        const staffRequests = this.getAssignedStaffRequests.execute(this.curr_user.userId)
        if(staffRequests.length === 0) {
            console.log("No available requests")
        }
        else {
            staffRequests.forEach((staffRequest: StaffRequest) => {
                console.log(`ID: ${staffRequest.requestId}, Department: ${staffRequest.requestingDepartment}, Job title: ${staffRequest.jobTitle}, Years of experience: ${staffRequest.yearsOfExperience}, Status ${staffRequest.staffStatus}`);
            });
            console.log("")
        }
        this.displayMenu(this.curr_user)
    }
}