import { Request, Status } from "../domain/request";
import { Role } from "../domain/types";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class ArchiveRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, updatedData: Request, role: Role): string {
        switch (role) {

            case Role.SeniorCustomerService: 
                const request = this.requestRepository.getRequestById(requestId);
                if (!request) return "Request not found.";
                
                const updatedRequest = this.requestRepository.updateRequest(requestId, updatedData)

                if (!updatedRequest) return "Request could not get updated."
                updatedRequest!.status = Status.Closed;
            
                return `Request ${requestId} has been archived.`;

            default:
                return "You do not have permission to reject requests.";
        }
    }
}