import { StaffRequest } from "../../domain/staffRequest";
import { StaffRequestRepository } from "../../infrastructure/repositories/staffRequestRepository";

export class CreateStaffRequest {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(staffId: string, requestingDepartment: string, yearsOfExperience: number, jobTitle: string, jobDescription: string, contractType: string): boolean {
            const staffRequest = new StaffRequest(Math.random().toString(36).substr(2, 9), staffId, requestingDepartment, yearsOfExperience, jobTitle, jobDescription, contractType);
            this.staffRequestRepository.addStaffRequest(staffRequest);
            return true;
    }
}