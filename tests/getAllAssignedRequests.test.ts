import { GetAssignedRequests } from "../src/application/getAssignedRequests";
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("GetAssignedRequests", () => {
    let requestRepository: RequestRepository;
    let getAssignedRequests: GetAssignedRequests;

    beforeEach(() => {
        // Initialize a new instance of RequestRepository
        requestRepository = new RequestRepository();

        // Initialize GetAssignedRequests with the RequestRepository instance
        getAssignedRequests = new GetAssignedRequests(requestRepository);
    });

    it("should return an empty array if there are no requests assigned to the user", () => {
        const userId = "staffId123";

        // Execute the method
        const result = getAssignedRequests.execute(userId);

        // Verify the result is an empty array
        expect(result).toEqual([]);
    });

    it("should return only requests assigned to the specified user", () => {
        const userId = "staffId"; // User ID for which requests will be filtered

        // Mock data with the new Request constructor structure
        const mockRequests: Request[] = [
            new Request("1", "Request 1", userId, "eventName", 80, 10, new Date(), "details", Status.Created),
            new Request("2", "Request 2", "otherStaffId", "eventName", 200, 5, new Date(), "details", Status.Created),
            new Request("3", "Request 3", userId, "eventName", 100, 15, new Date(), "details", Status.Created),
        ];

        // Add the mock requests to the repository
        requestRepository.addRequest(mockRequests[0]);
        requestRepository.addRequest(mockRequests[1]);
        requestRepository.addRequest(mockRequests[2]);

        // Execute the method
        const result = getAssignedRequests.execute(userId);

        // Verify the result includes only the requests assigned to the specified user
        expect(result).toEqual([
            mockRequests[0],
            mockRequests[2]
        ]);
    });
});
