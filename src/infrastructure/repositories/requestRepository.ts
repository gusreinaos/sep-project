import { User } from "../../domain/user";
import { Role } from "../../domain/types";
import { Request } from "../../domain/request";

export class RequestRepository {
    private requests: Request[] = [];

    addRequest(request: Request): void {
        this.requests.push(request);
    }

    removeRequest(requestId: string): boolean {
        const index = this.requests.findIndex(request => request.requestId === requestId);
        if (index !== -1) {
            this.requests.splice(index, 1);
            return true; 
        }
        return false; 
    }

    updateRequest(requestId: string, updatedData: Partial<Request>): Request | null {
        const request = this.requests.find(request => request.requestId === requestId);
        if (request) {
            Object.assign(request, updatedData);
            return request; 
        }
        return null; 
    }

    getAllRequests(): Request[] {
        return this.requests;
    }

    getRequestsByClient(clientId: string): Request[] {
        return this.requests.filter(request => request.clientId === clientId);
    }

    getRequestsByStatus(status: string): Request[] {
        return this.requests.filter(request => request.status === status);
    }

    getRequestById(requestId: string): Request | undefined {
        return this.requests.find(request => request.requestId === requestId);
    }
}
