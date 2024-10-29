import { GetAllRequests } from "../src/application/getAllRequests"; // Adjust the import path
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("GetAllRequests", () => {
    let requestRepository: RequestRepository;
    let getAllRequests: GetAllRequests; 

    beforeEach(() => {
        // Initialize a real instance of RequestRepository
        requestRepository = new RequestRepository();

        // Initialize GetAllRequests with the RequestRepository instance
        getAllRequests = new GetAllRequests(requestRepository);
    });

    it("should return an empty array if there are no requests", () => {
        // Execute the method
        const result = getAllRequests.execute();

        // Verify the result is an empty array
        expect(result).toEqual([]);
    });

    it("should return all requests if they exist", () => {
        // Mock data
        const mockRequests: Request[] = [
            new Request("1", "Request 1", "staffId", "eventName", 80, 10, new Date(), "details", Status.Created),
            new Request("2", "Request 2", "staffId", "eventName", 200, 5, new Date(), "details", Status.Created),
        ];

        // Add the mock requests to the repository
        requestRepository.addRequest(mockRequests[0]);
        requestRepository.addRequest(mockRequests[1]);

        // Execute the method
        const result = getAllRequests.execute();

        // Verify the result is the same as the mocked data
        expect(result).toEqual(mockRequests);
    });
});
