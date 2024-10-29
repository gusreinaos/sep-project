import { RedirectRequest } from "../src/application/redirectRequest";
import { Request, Status } from "../src/domain/request";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("RedirectRequest", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let redirectRequest: RedirectRequest;

    beforeEach(() => {
        // Mock the RequestRepository
        requestRepositoryMock = {
            addRequest: jest.fn(),
            getAllRequests: jest.fn(),
            removeRequest: jest.fn(),
            updateRequest: jest.fn(),
            getRequestsByClient: jest.fn(),
            getRequestsByStatus: jest.fn(),
            getRequestById: jest.fn(),
            getRequestByUserID: jest.fn(),
        } as unknown as jest.Mocked<RequestRepository>;

        // Initialize RedirectRequest with the mocked repository
        redirectRequest = new RedirectRequest(requestRepositoryMock);
    });

    it("should redirect a request when the request exists", () => {
        const requestId = "requestId123";
        const targetId = "newStaffId";
        
        // Mock the existing request to be returned from the repository
        const mockRequest = new Request(requestId, "clientId", "oldStaffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);
        
        // Mock the updateRequest to simulate a successful update
        requestRepositoryMock.updateRequest.mockReturnValue({ ...mockRequest, staffId: targetId });

        // Execute the method
        const result = redirectRequest.execute(targetId, requestId);

        // Verify that getRequestById and updateRequest were called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(requestRepositoryMock.updateRequest).toHaveBeenCalledWith(requestId, expect.any(Request));

        // Verify the confirmation message
        expect(result).toBe(`Request ${requestId} has been redirected.`);
    });

    it("should return 'Request not found.' if the request does not exist", () => {
        const requestId = "nonExistingRequestId";
        const targetId = "newStaffId";

        // Mock the request to return null from the repository
        requestRepositoryMock.getRequestById.mockReturnValue(undefined);

        // Execute the method
        const result = redirectRequest.execute(targetId, requestId);

        // Verify that getRequestById was called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(result).toBe("Request not found.");
    });

    it("should return 'Request not updated' if the update fails", () => {
        const requestId = "requestId123";
        const targetId = "newStaffId";

        // Mock the existing request to be returned from the repository
        const mockRequest = new Request(requestId, "clientId", "oldStaffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);
        
        // Mock the updateRequest to simulate a failed update
        requestRepositoryMock.updateRequest.mockReturnValue(null); // Simulating update failure

        // Execute the method
        const result = redirectRequest.execute(targetId, requestId);

        // Verify that getRequestById and updateRequest were called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(requestRepositoryMock.updateRequest).toHaveBeenCalledWith(requestId, expect.any(Request));

        // Verify the failure message
        expect(result).toBe("Request not updated");
    });
});
