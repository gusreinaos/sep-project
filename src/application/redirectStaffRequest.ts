import { StaffRequest } from "../domain/staffRequest";
import { StaffRequestRepository } from "../infrastructure/repositories/staffRequestRepository";

export class RedirectStaffRequest {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(targetId: string, staffRequest: StaffRequest): string{
        console.log("Target: ", targetId)
        const updatedRequest = this.staffRequestRepository.updateStaffRequest(staffRequest.requestId, new StaffRequest(staffRequest.requestId, targetId, staffRequest.requestingDepartment, staffRequest.yearsOfExperience, staffRequest.jobTitle, staffRequest.jobDescription, staffRequest.contractType, staffRequest.staffStatus))

        if(!updatedRequest) return "Request not updated"
        return `Request ${staffRequest.requestId} has been redirected.`;

        
    }
}