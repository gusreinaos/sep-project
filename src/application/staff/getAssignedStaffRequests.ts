import { StaffRequest } from "../../domain/staffRequest";
import { StaffRequestRepository } from "../../infrastructure/repositories/staffRequestRepository";

export class GetAssignedStaffRequests {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(userId: string): StaffRequest[]{
        const requests = this.staffRequestRepository.getStaffRequestByStaffId(userId);
        if (requests!.length === 0) return []
        return requests //since it will either return a single index array or none
    }
} 