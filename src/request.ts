export class Request {
    public id: string; 

    constructor(
        public clientId: string,
        public eventName: string,
        public proposedBudget: number,
        public staffRequirement: number,
        public date: Date,
        public details: string,
        public status: Status
    ) {
        this.id = this.generateId();
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}

export enum Status {
    Created = "Created",
    Closed = "Closed",
    Going = "Goind"
}
