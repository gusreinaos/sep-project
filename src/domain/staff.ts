import { StaffRole } from "./types";

export class Staff {
    public staffId: string;
    public available: boolean;
    public staffRole: StaffRole;


    constructor(staffId: string, available: boolean, staffRole: StaffRole) {
        this.staffId = staffId;
        this.available = available;
        this.staffRole = staffRole;
    }

}