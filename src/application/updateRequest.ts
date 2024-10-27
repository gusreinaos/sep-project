import { Status } from "../domain/request";
import { Role } from "../domain/types";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";
import { Request } from "../domain/request";

export class UpdateRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, updates: Partial<Request>, role: Role): string{
        switch(role) {
            case Role.SeniorCustomerService:
                const requestToUpdate = this.requestRepository.getRequestById(requestId);
                if (!requestToUpdate) return "Request not found. ";
                Object.assign(requestToUpdate, updates);
                return `Request ${requestId} updated successfully.`;

            default:
                return "You do now have permission to update requests."
        }
    }
}