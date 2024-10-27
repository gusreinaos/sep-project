import { Status } from "../domain/request";
import { Role } from "../domain/types";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";
import { Request } from "../domain/request";

export class RejectRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, role: Role): string {
        switch (role) {

            case Role.SeniorCustomerService: 
                const request = this.requestRepository.getRequestById(requestId);
                if (!request) return "Request not found.";
                this.requestRepository.removeRequest(requestId);
                return `Request ${requestId} has been rejected.`;

            default:
                return "You do not have permission to reject requests.";
        }
    }
}