import { Request } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class GetAssignedRequests {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(userId: string): Request[]{
        const requests = this.requestRepository.getRequestByUserID(userId);
        if (requests.length === 0) return []
        return requests //since it will either return a single index array or none

    }
} 