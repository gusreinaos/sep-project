import { Role } from "./types";
import { permissions } from "./permissions";
import { Request, Status } from "./request";

export class User {
    private requests: Request[] = [];

    constructor(public username: string, public role: Role) { }

    getPermissions(): string[] {
        return permissions[this.role] || [];
    }

    createEventRequest(clientId: string, eventName: string, proposedBudget: number, staffRequirement: number, date: Date, details: string, status: Status): string {
        switch(this.role) {
            case Role.CustomerService:
                const request = new Request(clientId, eventName, proposedBudget, staffRequirement, date, details, Status.Created);
                this.requests.push(request);
                return `Request created for event ${eventName} with ID: ${request.id}`;

            default:
                return "You do not have permission to create an event request.";
        }
    }

    updateRequest(requestId: string, updates: Partial<Request>): string{
        switch(this.role) {
            case Role.SeniorCustomerService:
                const requestToUpdate = this.requests.find(request => request.id === requestId);
                if (!requestToUpdate) return "Request not found. ";
                Object.assign(requestToUpdate, updates);
                return `Request ${requestId} updated successfully.`;

            default:
                return "You do now have permission to update requests."
        }
    }

    rejectRequest(requestId: string): string {
        switch (this.role) {

            case Role.SeniorCustomerService: 
                const index = this.requests.findIndex(req => req.id === requestId);
                if (index === -1) return "Request not found.";
                this.requests.splice(index, 1); 
                return `Request ${requestId} has been rejected.`;

            default:
                return "You do not have permission to reject requests.";
        }
    }
}

