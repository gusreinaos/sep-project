import * as fs from "fs";
import * as path from "path";
import { Request } from "../../domain/request";

export class RequestRepository {
    private readonly filePath: string = path.join(__dirname, "../persistance/requests.json");
    private requests: Request[] = [];

    constructor() {
        this.loadRequests();
    }

    removeAllRequests(): void {
        this.requests = [];
        this.saveRequests();
    }

    private loadRequests(): void {
        try {
            const data = fs.readFileSync(this.filePath, "utf8");
            this.requests = JSON.parse(data);
        } catch (error) {
            console.error("Could not load requests:", error);
            this.requests = [];
        }
    }

    private saveRequests(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.requests, null, 2));
        } catch (error) {
            console.error("Could not save requests:", error);
        }
    }

    addRequest(request: Request): void {
        this.requests.push(request);
        this.saveRequests();
    }

    removeRequest(requestId: string): boolean {
        const index = this.requests.findIndex(request => request.requestId === requestId);
        if (index !== -1) {
            this.requests.splice(index, 1);
            this.saveRequests();
            return true; 
        }
        return false; 
    }

    updateRequest(requestId: string, updatedData: Partial<Request>): Request | null {
        const request = this.requests.find(request => request.requestId === requestId);
        if (request) {
            Object.assign(request, updatedData);
            this.saveRequests();
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

    getRequestByUserID(userId: string): Request[] {
        return this.requests.filter(request => request.staffId === userId);
    }
}
