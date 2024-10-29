import { RejectRequest } from "../src/application/rejectRequest";
import { Request, Status } from "../src/domain/request";
import { Role } from "../src/domain/types";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("RejectRequest", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let rejectRequest: RejectRequest;

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

        // Initialize RejectRequest with the mocked repository
        rejectRequest = new RejectRequest(requestRepositoryMock);
    });

    it("should reject a request when the role is SeniorCustomerService", () => {
        const requestId = "requestId123";
        const role = Role.SeniorCustomerService;

        // Mock the request to be returned from the repository
        const mockRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);

        // Execute the method
        const result = rejectRequest.execute(requestId, role);

        // Verify that getRequestById and removeRequest were called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(requestRepositoryMock.removeRequest).toHaveBeenCalledWith(requestId);

        // Verify the confirmation message
        expect(result).toBe(`Request ${requestId} has been rejected.`);
    });

    it("should return 'Request not found.' if the request does not exist", () => {
        const requestId = "nonExistingRequestId";
        const role = Role.SeniorCustomerService;

        // Mock the request to return null from the repository
        requestRepositoryMock.getRequestById.mockReturnValue(undefined);

        // Execute the method
        const result = rejectRequest.execute(requestId, role);

        // Verify that getRequestById was called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(result).toBe("Request not found.");
    });

    it("should deny permission when the role is not SeniorCustomerService", () => {
        const requestId = "requestId123";
        const role = Role.CustomerService; // Role without permission

        // Execute the method
        const result = rejectRequest.execute(requestId, role);

        // Verify that getRequestById and removeRequest were not called
        expect(requestRepositoryMock.getRequestById).not.toHaveBeenCalled();
        expect(requestRepositoryMock.removeRequest).not.toHaveBeenCalled();

        // Verify the permission denial message
        expect(result).toBe("You do not have permission to reject requests.");
    });
});
