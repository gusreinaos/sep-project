import { Request } from "../domain/request";
import { RequestRepository } from "../infrastructure/repositories/requestRepository";

export class UpdateRequest {

    constructor(private readonly requestRepository: RequestRepository) {}

    execute(requestId: string, updates: Request): Request | null{

        //console.log("Application: ", updates)

        const requestToUpdate = this.requestRepository.getRequestById(requestId);
        if (!requestToUpdate) return null;
        const updatedRequest = this.requestRepository.updateRequest(requestId, updates)
        return updatedRequest
    }
}