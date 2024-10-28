import { Request } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class RedirectRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(targetId: string, requestId: string): string{
       
        const requestToRedirect = this.requestRepository.getRequestById(requestId);
        if (!requestToRedirect) return "Request not found.";
        //const currReq = this.requests.splice(requestToRedirect, 1)[0]; 
        const updatedRequest = this.requestRepository.updateRequest(requestId, new Request(requestId, requestToRedirect.clientId, targetId, requestToRedirect.eventName, requestToRedirect.proposedBudget, requestToRedirect.staffRequirement, requestToRedirect.date, requestToRedirect.details, requestToRedirect.status))

        if(!updatedRequest) return "Request not updated"
        return `Request ${requestId} has been redirected.`;

        
    }
}