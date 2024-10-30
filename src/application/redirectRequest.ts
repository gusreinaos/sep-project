import { Request } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class RedirectRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(targetId: string, request: Request, budgetApproved?: boolean): string{
       
        const updatedRequest = this.requestRepository.updateRequest(request.requestId, new Request(request.requestId, request.clientId, targetId, request.eventName, request.proposedBudget, request.staffRequirement, request.date, request.details, request.status, request.financialFeedback, request.eventDetails, budgetApproved))

        if(!updatedRequest) return "Request not updated"
        return `Request ${request.requestId} has been redirected.`;

        
    }
}