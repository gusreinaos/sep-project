import { Status } from "../domain/request";
import { Role } from "../domain/types";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";
import { Request } from "../domain/request";

export class GetAllRequests {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(): Request[]{
        const requests = this.requestRepository.getAllRequests();
        if (requests.length === 0) return []
        return requests

    }
}