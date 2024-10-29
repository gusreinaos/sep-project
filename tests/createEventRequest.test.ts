import { CreateEventRequest } from "../src/application/createEventRequest";
import { Request, Status } from "../src/domain/request";
import { Role } from "../src/domain/types";
import { RequestRepository } from "../src/infrastructure/repositories/requestRepository";

describe("CreateEventRequest", () => {
    let requestRepositoryMock: jest.Mocked<RequestRepository>;
    let createEventRequest: CreateEventRequest;

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

        requestRepositoryMock

        // Initialize CreateEventRequest with the mocked repository
        createEventRequest = new CreateEventRequest(requestRepositoryMock);
    });

    it("should create a request when the role is CustomerService and return a confirmation message", () => {
        const clientId = "client123";
        const staffId = "staff456";
        const eventName = "Annual Gala";
        const proposedBudget = 1000;
        const staffRequirement = 5;
        const date = new Date();
        const details = "An annual celebration gala event";
        const role = Role.CustomerService;

        // Execute the method
        const result = createEventRequest.execute(
            clientId,
            staffId,
            eventName,
            proposedBudget,
            staffRequirement,
            date,
            details,
            Status.Created,
            role
        );

        // Verify that addRequest was called with a Request object
        expect(requestRepositoryMock.addRequest).toHaveBeenCalledTimes(1);
        const createdRequest: Request = requestRepositoryMock.addRequest.mock.calls[0][0];
        expect(createdRequest.clientId).toBe(clientId);
        expect(createdRequest.staffId).toBe(staffId);
        expect(createdRequest.eventName).toBe(eventName);
        expect(createdRequest.proposedBudget).toBe(proposedBudget);
        expect(createdRequest.staffRequirement).toBe(staffRequirement);
        expect(createdRequest.details).toBe(details);
        expect(createdRequest.status).toBe(Status.Created);

        // Verify the confirmation message
        expect(result).toBe(`Request created for event ${eventName} with ID: ${createdRequest.requestId}`);
    });

    it("should deny permission when the role is not CustomerService", () => {
        const clientId = "client123";
        const staffId = "staff456";
        const eventName = "Annual Gala";
        const proposedBudget = 1000;
        const staffRequirement = 5;
        const date = new Date();
        const details = "An annual celebration gala event";
        const role = Role.AdminManager; // Role without permission

        // Execute the method
        const result = createEventRequest.execute(
            clientId,
            staffId,
            eventName,
            proposedBudget,
            staffRequirement,
            date,
            details,
            Status.Created,
            role
        );

        // Verify that addRequest was not called
        expect(requestRepositoryMock.addRequest).not.toHaveBeenCalled();

        // Verify the permission denial message
        expect(result).toBe("You do not have permission to create an event request.");
    });
});
