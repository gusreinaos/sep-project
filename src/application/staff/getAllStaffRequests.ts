import { StaffRequest } from "../../domain/staffRequest";
import { StaffRequestRepository } from "../../infrastructure/repositories/staffRequestRepository";

export class GetAllStaffRequests {

    constructor(private readonly staffRequestRepository: StaffRequestRepository) {}

    execute(): StaffRequest[]{
        const requests = this.staffRequestRepository.getAllStaffRequests();
        if (requests.length === 0) return []
        return requests
    }
} 