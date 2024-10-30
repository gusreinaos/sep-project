import * as fs from "fs";
import * as path from "path";
import { Request } from "../../domain/request";
import { Event } from "../../domain/types";

export class RequestRepository {
    private readonly filePath: string = path.join(__dirname, "../persistance/requests.json");
    private requests: Request[] = [];
    private test: boolean = false;

    constructor(test: boolean) {
        this.test = test!;
        if(!this.test) this.loadRequests();
    }

    removeAllRequests(): void {
        this.requests = [];
        if(!this.test) this.saveRequests(); // Save the empty array to the file
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
        if(!this.test) this.saveRequests();
    }

    removeRequest(requestId: string): boolean {
        const index = this.requests.findIndex(request => request.requestId === requestId);
        if (index !== -1) {
            this.requests.splice(index, 1);
            if(!this.test) this.saveRequests();
            return true; 
        }
        return false; 
    }

    updateRequest(requestId: string, updatedData: Request): Request | null {
        const requestIndex = this.requests.findIndex(request => request.requestId === requestId);
    
        if (requestIndex !== -1) {
            this.requests.splice(requestIndex, 1)[0];
            const eventDetailsFull: Event = {
                id: updatedData.eventDetails.id, 
                details: updatedData.eventDetails.details, 
                status: updatedData.eventDetails.status, 
                budget: updatedData.eventDetails.budget
            };
            const updatedRequest = new Request(
                updatedData.requestId, 
                updatedData.clientId, 
                updatedData.staffId, 
                updatedData.eventName, 
                updatedData.proposedBudget, 
                updatedData.staffRequirement, 
                updatedData.date, updatedData.details, 
                updatedData.status, 
                updatedData.financialFeedback, 
                eventDetailsFull,
                updatedData.budgetApproved);
            this.requests.push(updatedRequest);
    
            if(!this.test) this.saveRequests(); 
            return updatedRequest; 
        }
        
        console.log("Request not found for ID:", requestId); 
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
