import { GetAllRequests } from "../src/application/getAllRequests";
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("GetAllRequests", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let getAllRequests: GetAllRequests;

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

        // Initialize GetAllRequests with the mocked repository
        getAllRequests = new GetAllRequests(requestRepositoryMock);
    });

    it("should return all requests if they exist", () => {
        const mockRequests: Request[] = [
            new Request("1", "client1", "staff1", "Event 1", 1000, 5, new Date(), "details", Status.Created),
            new Request("2", "client2", "staff2", "Event 2", 1500, 8, new Date(), "details", Status.InProgress),
        ];

        // Mock getAllRequests to return the mockRequests
        requestRepositoryMock.getAllRequests.mockReturnValue(mockRequests);

        // Execute the method
        const result = getAllRequests.execute();

        // Verify that getAllRequests was called once
        expect(requestRepositoryMock.getAllRequests).toHaveBeenCalledTimes(1);

        // Check that the result matches the mock requests
        expect(result).toEqual(mockRequests);
    });

    it("should return an empty array if no requests exist", () => {
        // Mock getAllRequests to return an empty array
        requestRepositoryMock.getAllRequests.mockReturnValue([]);

        // Execute the method
        const result = getAllRequests.execute();

        // Verify that getAllRequests was called once
        expect(requestRepositoryMock.getAllRequests).toHaveBeenCalledTimes(1);

        // Check that the result is an empty array
        expect(result).toEqual([]);
    });
});
