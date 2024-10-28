import { Status } from "../domain/request";
import { Role } from "../domain/types";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";
import { Request } from "../domain/request";
import { request } from "https";

export class UpdateRequestByStatus {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, status: Status): string{
        
        const requestToUpdate = this.requestRepository.getRequestById(requestId);
        const newRequest = new Request(requestToUpdate!.requestId, requestToUpdate!.clientId, requestToUpdate!.staffId, requestToUpdate!.eventName, requestToUpdate!.proposedBudget, requestToUpdate!.staffRequirement, requestToUpdate!.date, requestToUpdate!.details, status)
        if (!requestToUpdate) return "Request not found. ";
        Object.assign(requestToUpdate, newRequest);
        return `Request ${requestId} updated successfully.`;

        
    }
}