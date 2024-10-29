import * as fs from 'fs';
import * as path from 'path';
import { StaffRequest } from "../../domain/staffRequest";

export class StaffRequestRepository {
    private readonly filePath: string = path.join(__dirname, '../persistance/staffRequests.json');
    private staffRequests: StaffRequest[] = [];
    private test: boolean;

    constructor(test: boolean) {
        this.test = test;
        if (!this.test) this.loadStaffRequests();
    }

    private loadStaffRequests(): void {
        try {
            if (!fs.existsSync(this.filePath)) {
                // Create the file if it doesn't exist
                fs.writeFileSync(this.filePath, JSON.stringify({ staffRequests: [] }, null, 2));
            }
            const data = fs.readFileSync(this.filePath, 'utf8');
            const parsedData = JSON.parse(data);
            this.staffRequests = parsedData.staffRequests || [];
        } catch (error) {
            console.error("Could not load staff requests:", error);
            this.staffRequests = [];
        }
    }

    private saveStaffRequests(): void {
        if (this.test) return; // Skip saving in test mode
        try {
            const data = JSON.stringify({ staffRequests: this.staffRequests }, null, 2);
            fs.writeFileSync(this.filePath, data);
        } catch (error) {
            console.error("Could not save staff requests:", error);
        }
    }

    // Remove all staff requests and save an empty list
    removeAllStaffRequests(): void {
        this.staffRequests = [];
        this.saveStaffRequests();
    }

    addStaffRequest(staffRequest: StaffRequest): void {
        this.staffRequests.push(staffRequest);
        this.saveStaffRequests();
    }

    removeStaffRequest(staffRequestId: string): boolean {
        const index = this.staffRequests.findIndex(request => request.requestId === staffRequestId);
        if (index !== -1) {
            this.staffRequests.splice(index, 1);
            this.saveStaffRequests();
            return true;
        }
        return false;
    }

    updateStaffRequest(staffRequestId: string, updatedData: StaffRequest): StaffRequest | null {
        const requestIndex = this.staffRequests.findIndex(request => request.requestId === staffRequestId);
        
        if(requestIndex !== -1) {
            this.staffRequests.splice(requestIndex, 1)[0];
            const updatedRequest = new StaffRequest(updatedData.requestId, updatedData.staffId, updatedData.requestingDepartment, updatedData.yearsOfExperience, updatedData.jobTitle, updatedData.jobDescription, updatedData.contractType, updatedData.staffStatus)
            this.staffRequests.push(updatedRequest);
    
            if(!this.test) this.saveStaffRequests(); 
            return updatedRequest; 
        }
        return null; 
    }

    getAllStaffRequests(): StaffRequest[] {
        return this.staffRequests;
    }

    getStaffRequestsByContractType(contractType: string): StaffRequest[] {
        return this.staffRequests.filter(request => request.contractType === contractType);
    }

    getStaffRequestById(staffRequestId: string): StaffRequest | undefined {
        return this.staffRequests.find(request => request.requestId === staffRequestId);
    }

    getStaffRequestByStaffId(staffId: string): StaffRequest[] {
        return this.staffRequests.filter(request => request.staffId === staffId);
    }
}
