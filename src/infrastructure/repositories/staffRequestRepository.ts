import { StaffRequest } from "../../domain/staffRequest";

export class StaffRequestRepository {
    private staffRequests: StaffRequest[] = [];

    addStaffRequest(StaffRequest: StaffRequest): void {
        this.staffRequests.push(StaffRequest);
    }

    removeStaffRequest(StaffRequestId: string): boolean {
        const index = this.staffRequests.findIndex(StaffRequest => StaffRequest.requestId === StaffRequestId);
        if (index !== -1) {
            this.staffRequests.splice(index, 1);
            return true; 
        }
        return false; 
    }

    updateStaffRequest(StaffRequestId: string, updatedData: Partial<StaffRequest>): StaffRequest | null {
        const StaffRequest = this.staffRequests.find(StaffRequest => StaffRequest.requestId === StaffRequestId);
        if (StaffRequest) {
            Object.assign(StaffRequest, updatedData);
            return StaffRequest; 
        }
        return null; 
    }

    getAllstaffStaffRequests(): StaffRequest[] {
        return this.staffRequests;
    }

    getstaffStaffRequestsByContractType(contractType: string): StaffRequest[] {
        return this.staffRequests.filter(StaffRequest => StaffRequest.contractType === contractType);
    }

    getStaffRequestById(StaffRequestId: string): StaffRequest | undefined {
        return this.staffRequests.find(StaffRequest => StaffRequest.requestId === StaffRequestId);
    }

    getStaffRequestByStaffId(staffId: string): StaffRequest[] {
        return this.staffRequests.filter(StaffRequest => StaffRequest.staffId === staffId);
    }
}
