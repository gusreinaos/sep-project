import { ArchiveRequest } from "../src/application/archiveRequest";
import { Request, Status } from "../src/domain/request";
import { Role } from "../src/domain/types";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("ArchiveRequest", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let archiveRequest: ArchiveRequest;

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

        // Initialize ArchiveRequest with the mocked repository
        archiveRequest = new ArchiveRequest(requestRepositoryMock);
    });

    it("should archive a request when the role is SeniorCustomerService", () => {
        const requestId = "requestId123";
        const updatedData = { status: Status.Closed };
        const role = Role.SeniorCustomerService;

        // Mock the request to be returned from the repository
        const mockRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);

        const updatedRequest = Object.assign(mockRequest, updatedData);
        requestRepositoryMock.updateRequest.mockReturnValue(updatedRequest);

        // Execute the method
        const result = archiveRequest.execute(requestId, updatedRequest, role);


        // Verify that getRequestById and updateRequest were called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(requestRepositoryMock.updateRequest).toHaveBeenCalledWith(requestId, updatedRequest);

        // Verify the confirmation message
        expect(result).toBe(`Request ${requestId} has been archived.`);
    });

    it("should return 'Request not found.' if the request does not exist", () => {
        const requestId = "nonExistingRequestId";
        const updatedData = { status: Status.Closed };
        const role = Role.SeniorCustomerService;

        const mockRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        const updatedRequest = Object.assign(mockRequest, updatedData);

        // Mock the request to return null from the repository
        requestRepositoryMock.getRequestById.mockReturnValue(undefined);

        // Execute the method
        const result = archiveRequest.execute(requestId, updatedRequest, role);

        // Verify that getRequestById was called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(result).toBe("Request not found.");
    });

    it("should return 'Request could not get updated.' if the update fails", () => {
        const requestId = "requestId123";
        const updatedData = { status: Status.Closed };
        const role = Role.SeniorCustomerService;

        // Mock the request to be returned from the repository
        const mockRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);
        requestRepositoryMock.updateRequest.mockReturnValue(null); // Simulating update failure
        
        const updatedRequest = Object.assign(mockRequest, updatedData);
        
        // Execute the method
        const result = archiveRequest.execute(requestId, updatedRequest, role);


        // Verify that getRequestById and updateRequest were called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(requestRepositoryMock.updateRequest).toHaveBeenCalledWith(requestId, updatedRequest);

        // Verify the failure message
        expect(result).toBe("Request could not get updated.");
    });

    it("should deny permission when the role is not SeniorCustomerService", () => {
        const requestId = "requestId123";
        const updatedData = { status: Status.Closed };
        const role = Role.CustomerService; // Role without permission

        const mockRequest = new Request(requestId, "clientId", "staffId", "eventName", 1000, 5, new Date(), "details", Status.Created);
        const updatedRequest = Object.assign(mockRequest, updatedData);

        // Execute the method
        const result = archiveRequest.execute(requestId, updatedRequest, role);

        // Verify that addRequest was not called
        expect(requestRepositoryMock.getRequestById).not.toHaveBeenCalled();
        expect(requestRepositoryMock.updateRequest).not.toHaveBeenCalled();

        // Verify the permission denial message
        expect(result).toBe("You do not have permission to reject requests.");
    });
});
