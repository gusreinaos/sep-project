import { UpdateRequest } from "../src/application/updateRequest";
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("UpdateRequest", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let updateRequest: UpdateRequest;

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

        // Initialize UpdateRequest with the mocked repository
        updateRequest = new UpdateRequest(requestRepositoryMock);
    });

    it("should update the request successfully", () => {
        const requestId = "requestId123";
        const existingRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        const updatedData = new Request(requestId, "clientId", "staffId", "updatedEventName", 1500, 8, new Date(), "updatedDetails", Status.InProgress);

        // Mock the repository to return an existing request and simulate update
        requestRepositoryMock.getRequestById.mockReturnValue(existingRequest);
        requestRepositoryMock.updateRequest.mockReturnValue(updatedData);

        // Execute the method
        const result = updateRequest.execute(requestId, updatedData);

        // Check that getRequestById was called with the correct ID
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        
        // Check that updateRequest was called with the correct parameters
        expect(requestRepositoryMock.updateRequest).toHaveBeenCalledWith(requestId, updatedData);
        
        // Check that the updated request is returned
        expect(result).toEqual(updatedData);
    });

    it("should return null if the request does not exist", () => {
        const requestId = "nonExistingRequestId";
        const updates = new Request(requestId, "clientId", "staffId", "eventName", 1500, 8, new Date(), "updatedDetails", Status.InProgress);

        // Mock getRequestById to return null (request not found)
        requestRepositoryMock.getRequestById.mockReturnValue(undefined);

        // Execute the method
        const result = updateRequest.execute(requestId, updates);

        // Verify that getRequestById was called with the correct ID
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        
        // Verify that updateRequest was not called, as there was no request to update
        expect(requestRepositoryMock.updateRequest).not.toHaveBeenCalled();
        
        // Check that the result is null
        expect(result).toBeNull();
    });
});
