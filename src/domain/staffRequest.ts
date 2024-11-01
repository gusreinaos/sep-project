
export class StaffRequest {
    public requestId: string;
    public staffId: string;
    public requestingDepartment: string;
    public yearsOfExperience: number;
    public jobTitle: string;
    public jobDescription: string;
    public contractType: string;
    public staffStatus: StaffStatus;

    constructor(
        requestId: string,
        staffId: string,
        requestingDepartment: string,
        yearsOfExperience: number,
        jobTitle: string,
        jobDescription: string,
        contractType: string,
        staffStatus: StaffStatus = StaffStatus.Pending
    ) {
        this.requestId = requestId;
        this.staffId = staffId;
        this.requestingDepartment = requestingDepartment;
        this.yearsOfExperience = yearsOfExperience;
        this.jobTitle = jobTitle;
        this.jobDescription = jobDescription;
        this.contractType = contractType;
        this.staffStatus = staffStatus;
    }
}

export enum ContractType {
    FullTime = "Full time",
    PartTime = "Part time",
}

export enum StaffStatus {
    Accepted = "Accepted",
    Pending = "Pending",
    Rejected = "Rejected"
}
