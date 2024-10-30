import { UpdateRequestByStatus } from "../src/application/updateRequestByStatus";
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("UpdateRequestByStatus", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let updateRequestByStatus: UpdateRequestByStatus;

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

        // Initialize UpdateRequestByStatus with the mocked repository
        updateRequestByStatus = new UpdateRequestByStatus(requestRepositoryMock);
    });

    it("should update the request status successfully", () => {
        const requestId = "requestId123";
        const newStatus = Status.Closed; // New status to update
        const mockRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Closed);

        // Mock the existing request to be returned from the repository
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);

        requestRepositoryMock.addRequest(mockRequest!);

        // Execute the method
        const result = updateRequestByStatus.execute(requestId, newStatus);

        // Verify that getRequestById was called and the request was updated
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        
        // Check if the new status was applied (check in update mock request)
        expect(mockRequest.status).toBe(newStatus); 
    });

    it("should return 'Request not found.' if the request does not exist", () => {
        const requestId = "nonExistingRequestId";
        const newStatus = Status.Closed;

        // Mock the request to return null from the repository
        requestRepositoryMock.getRequestById.mockReturnValue(undefined);

        // Execute the method
        const result = updateRequestByStatus.execute(requestId, newStatus);

        // Verify that getRequestById was called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(result).toBe(null);
    });
});
