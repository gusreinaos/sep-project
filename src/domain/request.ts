import { Event } from "./types";

export class Request {
    public requestId: string;
    public clientId: string;
    public staffId: string;
    public eventName: string;
    public proposedBudget: number;
    public staffRequirement: number;
    public date: Date;
    public details: string;
    public status: Status;
    public financialFeedback: string;
    public eventDetails: Event;
    public budgetApproved: boolean;

    constructor(
        requestId: string,
        clientId: string,
        staffId: string,
        eventName: string,
        proposedBudget: number,
        staffRequirement: number,
        date: Date,
        details: string,
        status: Status,
        financialFeedback: string = ""

    ) {
        this.requestId = requestId;
        this.clientId = clientId;
        this.staffId = staffId;
        this.eventName = eventName;
        this.proposedBudget = proposedBudget;
        this.staffRequirement = staffRequirement;
        this.date = date;
        this.details = details;
        this.status = status;
        this.financialFeedback = financialFeedback;
        this.eventDetails = {
            id: requestId,
            details: "",
            status: status, // "open", "in_progress", "closed"
            budget: 0,
        }
        this.budgetApproved = false;
    }
}

export enum Status {
    Created = "Created",
    InProgress = "InProgress",
    Closed = "Closed",
    Approved = "Approved",
    Rejected = "Rejected"
}
