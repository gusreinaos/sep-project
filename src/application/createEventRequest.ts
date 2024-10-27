import { Status } from "../domain/request";
import { Role } from "../domain/types";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";
import { Request } from "../domain/request";

export class CreateEventRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(clientId: string, staffId: string, eventName: string, proposedBudget: number, staffRequirement: number, date: Date, details: string, status: Status, role: Role): string {
        switch(role) {
            case Role.CustomerService:
                const request = new Request(Math.random().toString(36).substr(2, 9), clientId, staffId, eventName, proposedBudget, staffRequirement, date, details, Status.Created);
                this.requestRepository.addRequest(request)
                return `Request created for event ${eventName} with ID: ${request.requestId}`;

            default:
                return "You do not have permission to create an event request.";
        }
    }
}