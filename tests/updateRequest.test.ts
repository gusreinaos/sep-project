import { UpdateRequest } from "../src/application/updateRequest";
import { Request, Status } from "../src/domain/request";
import { Role } from "../src/domain/types";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("UpdateRequest", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let updateRequest: UpdateRequest;

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

        // Initialize UpdateRequest with the mocked repository
        updateRequest = new UpdateRequest(requestRepositoryMock);
    });

    it("should update a request when the role is SeniorCustomerService", () => {
        const requestId = "requestId123";
        const updates = { eventName: "Updated Event" };
        const role = Role.SeniorCustomerService;

        // Mock the existing request to be returned from the repository
        const mockRequest = new Request(requestId, "clientId", "staffId", "Old Event", 1000, 5, new Date(), "details", Status.Created);
        requestRepositoryMock.getRequestById.mockReturnValue(mockRequest);

        // Execute the method
        const result = updateRequest.execute(requestId, updates, role);

        // Verify that getRequestById was called and the updates were applied
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(mockRequest.eventName).toBe("Updated Event"); // Check if the update was applied

        // Verify the confirmation message
        expect(result).toBe(`Request ${requestId} updated successfully.`);
    });

    it("should return 'Request not found.' if the request does not exist", () => {
        const requestId = "nonExistingRequestId";
        const updates = { eventName: "Updated Event" };
        const role = Role.SeniorCustomerService;

        // Mock the request to return null from the repository
        requestRepositoryMock.getRequestById.mockReturnValue(undefined);

        // Execute the method
        const result = updateRequest.execute(requestId, updates, role);

        // Verify that getRequestById was called
        expect(requestRepositoryMock.getRequestById).toHaveBeenCalledWith(requestId);
        expect(result).toBe("Request not found. ");
    });

    it("should deny permission when the role is not SeniorCustomerService", () => {
        const requestId = "requestId123";
        const updates = { eventName: "Updated Event" };
        const role = Role.CustomerService; // Role without permission

        // Execute the method
        const result = updateRequest.execute(requestId, updates, role);

        // Verify that getRequestById was not called
        expect(requestRepositoryMock.getRequestById).not.toHaveBeenCalled();

        // Verify the permission denial message
        expect(result).toBe("You do now have permission to update requests.");
    });
});
