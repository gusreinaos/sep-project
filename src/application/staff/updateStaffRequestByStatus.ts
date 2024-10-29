import { StaffRequest, StaffStatus } from "../../domain/staffRequest";
import { StaffRequestRepository } from "../../infrastructure/repositories/staffRequestRepository";

export class UpdateStaffRequestByStatus {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(requestId: string, status: StaffStatus): StaffRequest | null{
        
        const requestToUpdate = this.staffRequestRepository.getStaffRequestById(requestId);
        if (!requestToUpdate) return null;

        const newRequest = new StaffRequest(requestToUpdate.requestId, requestToUpdate.staffId, requestToUpdate.requestingDepartment, requestToUpdate.yearsOfExperience, requestToUpdate.jobTitle, requestToUpdate.jobDescription, requestToUpdate.contractType, status)
        const updatedRequest = this.staffRequestRepository.updateStaffRequest(requestId, newRequest)
        return updatedRequest;
    }
}