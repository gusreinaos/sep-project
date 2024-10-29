import * as readline from "readline";
import { RedirectStaffRequest } from "../../application/redirectStaffRequest";
import { GetAllStaff } from "../../application/staff/getAllStaff";
import { GetAllStaffRequests } from "../../application/staff/getAllStaffRequests";
import { GetAvailableStaff } from "../../application/staff/getAvailableStaff";
import { UpdateStaffRequestByStatus } from "../../application/staff/updateStaffRequestByStatus";
import { Staff } from "../../domain/staff";
import { StaffRequest, StaffStatus } from "../../domain/staffRequest";
import { Role } from "../../domain/types";
import { User } from "../../domain/user";
import { UserRepository } from "../repositories/userRepository";

export class HumanResourceMenu {
    constructor(
        private readonly getAvailableStaff: GetAvailableStaff,
        private readonly getAllStaff: GetAllStaff,
        private readonly userRepository: UserRepository,
        private readonly getAllStaffRequests: GetAllStaffRequests,
        private readonly updateStaffRequestByStatus: UpdateStaffRequestByStatus,
        private readonly redirectStaffRequest: RedirectStaffRequest
    ) {}

    private curr_user: any;

    displayMenu(curr_user: User): void {
        console.log("\n--- Human Resources Menu ---");
        console.log("1. Show all staff");
        console.log("2. Show available staff")
        console.log("3. See recruitment requests");
        console.log("4. Evaluate recruitment request");
        console.log("5. Exit");
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
                    this.getRecruitmentRequests();
                    break;

                case "4":
                    rl.close();
                     

                case "5":
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

    private getRecruitmentRequests(): void {
        console.log("Staff requests available: ")
        const staffRequests = this.getAllStaffRequests.execute();
        
        if(staffRequests.length === 0) {
            console.log("No available requests")
        }
        else {
            staffRequests.forEach((staffRequest: StaffRequest) => {
                console.log(`ID: ${staffRequest.requestId}, Department: ${staffRequest.requestingDepartment}, Job title: ${staffRequest.jobTitle}, Years of experience: ${staffRequest.yearsOfExperience}, Status ${staffRequest.staffStatus}`);
            });
            console.log("")
        }

        this.getRequestAction();

    }

    private getRequestAction(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter the Staff request ID to approve or reject (or type 'exit' to return): ", (requestId) => {
            if (requestId.trim().toLowerCase() === "exit") {
                this.displayMenu(this.curr_user);
                rl.close();
                return;
            }

            rl.question("Do you want to approve or reject the request? (Type 'approve' or 'reject'): ", (action) => {

                if (action.trim().toLowerCase() === "approve") {
                    const newRequest = this.updateStaffRequestByStatus.execute(requestId, StaffStatus.Accepted)
                    console.log(`Request with ID ${requestId} has been approved.`);
                    const message = this.redirectStaffRequest.execute(
                        this.userRepository.getUsersByRole(Role.ServiceManager)[0].userId, newRequest!);
                    console.log(message)

                } else if (action.trim().toLowerCase() === "reject") {
                    this.updateStaffRequestByStatus.execute(requestId, StaffStatus.Rejected)
                    console.log(`Request with ID ${requestId} has been rejected.`);
                }

                rl.close();
                this.displayMenu(this.curr_user);
            });
        });
    }

}