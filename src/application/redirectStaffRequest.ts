import { StaffRequest } from "../domain/staffRequest";
import { StaffRequestRepository } from "../infrastructure/repositories/staffRequestRepository";

export class RedirectStaffRequest {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(targetId: string, staffRequestId: string): string{
       
        const requestToRedirect = this.staffRequestRepository.getStaffRequestById(staffRequestId);
        if (!requestToRedirect) return "Request not found.";
        //const currReq = this.requests.splice(requestToRedirect, 1)[0]; 
        const updatedRequest = this.staffRequestRepository.updateStaffRequest(staffRequestId, new StaffRequest(staffRequestId, targetId, requestToRedirect.requestingDepartment, requestToRedirect.yearsOfExperience, requestToRedirect.jobTitle, requestToRedirect.jobDescription, requestToRedirect.contractType))

        if(!updatedRequest) return "Request not updated"
        return `Request ${staffRequestId} has been redirected.`;

        
    }
}