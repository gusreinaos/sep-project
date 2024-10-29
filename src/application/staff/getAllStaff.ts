import { Staff } from "../../domain/staff";
import { StaffRepository } from "../../infrastructure/repositories/staffRepository";

export class GetAllStaff {

    constructor(private readonly staffRepository: StaffRepository) {}

    execute(): Staff[]{
        const requests = this.staffRepository.getAllStaffs();
        if (requests.length === 0) return []
        return requests

    }
} 