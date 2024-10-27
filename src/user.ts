import { Role } from "./types";
import { permissions } from "./permissions";
import { Request, Status } from "./request";
import { UserManager } from "./UserManager";

export class User {
    private userManager: UserManager;
    private requests: Request[] = [];
    private archived: Request[] = [];

    constructor(public username: string, public role: Role, public userManger: UserManager) {
        this.userManager = userManger;
     }

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
                this.requests.splice(index, 1)[0]; //
                return `Request ${requestId} has been rejected.`;

            default:
                return "You do not have permission to reject requests.";
        }
    }

    archiceRequest(requestId: string): string {
        switch (this.role) {

            case Role.SeniorCustomerService: 
                const index = this.requests.findIndex(req => req.id === requestId);
                if (index === -1) return "Request not found.";
                const currReq = this.requests.splice(index, 1)[0]; //
                currReq.status = Status.Closed;

                // Archive request
                this.archived.push(currReq);               
                return `Request ${requestId} has been archived.`;

            default:
                return "You do not have permission to reject requests.";
        }
    }

    getAllRequests(): Request[] | null {
        switch (this.role) {
            case Role.SeniorCustomerService:
                return this.requests;

            default:
                return null;
        }
    }

    redirectRequest(requestId: string, newStaffRequirement: number): string {
        switch (this.role) {
            case Role.SeniorCustomerService:
                const requestToRedirect = this.requests.findIndex(request => request.id === requestId);
                if (!requestToRedirect) return "Request not found.";
                // redirect request (remove from our list and give to another department)
                const currReq = this.requests.splice(requestToRedirect, 1)[0]; 
                this.userManager.addRequestToUser(Role.ProductionManager, currReq);
                return `Request ${requestId} has been redirected.`;

            default:
                return "You do not have permission to redirect requests.";
        }
    }
}