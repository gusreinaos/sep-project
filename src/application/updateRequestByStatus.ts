import { Request, Status } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class UpdateRequestByStatus {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, status: Status): string{
        
        const requestToUpdate = this.requestRepository.getRequestById(requestId);
        if (!requestToUpdate) return "Request not found. ";

        const newRequest = new Request(requestToUpdate!.requestId, requestToUpdate!.clientId, requestToUpdate!.staffId, requestToUpdate!.eventName, requestToUpdate!.proposedBudget, requestToUpdate!.staffRequirement, requestToUpdate!.date, requestToUpdate!.details, status)
        Object.assign(requestToUpdate, newRequest);
        return `Request ${requestId} updated successfully.`;

        
    }
}