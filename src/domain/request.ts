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

    constructor(
        requestId: string,
        clientId: string,
        staffId: string,
        eventName: string,
        proposedBudget: number,
        staffRequirement: number,
        date: Date,
        details: string,
        status: Status
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
        this.financialFeedback = "";
    }
}

export enum Status {
    Created = "Created",
    InProgress = "InProgress",
    Closed = "Closed",
    Approved = "Approved",
    Rejected = "Rejected"
}
