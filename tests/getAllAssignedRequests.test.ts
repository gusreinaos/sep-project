import { GetAssignedRequests } from "../src/application/getAssignedRequests";
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("GetAssignedRequests", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let getAssignedRequests: GetAssignedRequests;

    beforeEach(() => {
        // Mock the RequestRepository
        requestRepositoryMock = {
            test: true,
            addRequest: jest.fn(),
            getAllRequests: jest.fn(),
            removeRequest: jest.fn(),
            updateRequest: jest.fn(),
            getRequestsByClient: jest.fn(),
            getRequestsByStatus: jest.fn(),
            getRequestById: jest.fn(),
            getRequestByUserID: jest.fn(),
        } as unknown as jest.Mocked<RequestRepository>;

        // Initialize GetAssignedRequests with the mocked repository
        getAssignedRequests = new GetAssignedRequests(requestRepositoryMock);
    });

    it("should return assigned requests for the given user ID", () => {
        const userId = "staffId123";
        const mockRequests: Request[] = [
            new Request("1", "client1", userId, "Event 1", 1000, 5, new Date(), "details", Status.Created),
            new Request("2", "client2", userId, "Event 2", 1500, 8, new Date(), "details", Status.InProgress),
        ];

        // Mock the repository to return requests assigned to the user
        requestRepositoryMock.getRequestByUserID.mockReturnValue(mockRequests);

        // Execute the method
        const result = getAssignedRequests.execute(userId);

        // Verify that getRequestByUserID was called with the correct userId
        expect(requestRepositoryMock.getRequestByUserID).toHaveBeenCalledWith(userId);

        // Check that the result matches the mock requests
        expect(result).toEqual(mockRequests);
    });

    it("should return an empty array if no requests are assigned to the given user ID", () => {
        const userId = "staffId123";

        // Mock getRequestByUserID to return an empty array
        requestRepositoryMock.getRequestByUserID.mockReturnValue([]);

        // Execute the method
        const result = getAssignedRequests.execute(userId);

        // Verify that getRequestByUserID was called with the correct userId
        expect(requestRepositoryMock.getRequestByUserID).toHaveBeenCalledWith(userId);

        // Check that the result is an empty array
        expect(result).toEqual([]);
    });
});
