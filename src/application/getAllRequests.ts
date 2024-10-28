import { Request } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class GetAllRequests {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(): Request[]{
        const requests = this.requestRepository.getAllRequests();
        if (requests.length === 0) return []
        return requests

    }
} 