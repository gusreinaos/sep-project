import { StaffRequest } from "../../domain/staffRequest";
import { StaffRequestRepository } from "../../infrastructure/repositories/staffRequestRepository";


export class RedirectStaffRequest {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(targetId: string, request: StaffRequest): string{
       
        const updatedRequest = this.staffRequestRepository.updateStaffRequest(request.requestId, new StaffRequest(request.requestId, targetId, request.requestingDepartment, request.yearsOfExperience, request.jobTitle, request.jobDescription, request.contractType, request.staffStatus))

        if(!updatedRequest) return "Request not updated"
        return `Request ${request.requestId} has been redirected.`;

        
    }
}