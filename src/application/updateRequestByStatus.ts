import { Request, Status } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class UpdateRequestByStatus {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, status: Status): Request | null{
        
        const requestToUpdate = this.requestRepository.getRequestById(requestId);
        if (!requestToUpdate) return null;

        const newRequest = new Request(requestToUpdate!.requestId, requestToUpdate!.clientId, requestToUpdate!.staffId, requestToUpdate!.eventName, requestToUpdate!.proposedBudget, requestToUpdate!.staffRequirement, requestToUpdate!.date, requestToUpdate!.details, status, requestToUpdate!.financialFeedback)
        const updatedRequest = this.requestRepository.updateRequest(requestId, newRequest)
        return updatedRequest;
    }
}