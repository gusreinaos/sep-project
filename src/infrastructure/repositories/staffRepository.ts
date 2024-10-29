import * as fs from 'fs';
import * as path from 'path';
import { Staff } from "../../domain/staff";
import { StaffRole } from "../../domain/types";

export class StaffRepository {
    private staff: Staff[] = [];
    

    private readonly filePath: string = path.join(__dirname, "../persistance/staff.json");

    private test: boolean = false;
    constructor(test: boolean) {
        if(!test) this.loadStaff();
    }

    removeAllRequests(): void {
        this.staff = [];
        if(!test) this.saveStaff();
    }

    private loadStaff(): void {
        try {
            const data = fs.readFileSync(this.filePath, "utf8");
            this.staff = JSON.parse(data);
        } catch (error) {
            console.error("Could not load requests:", error);
            this.staff = [];
        }
    }

    private saveStaff(): void {
        try {
            fs.writeFileSync(this.filePath, JSON.stringify(this.staff, null, 2));
        } catch (error) {
            console.error("Could not save requests:", error);
        }
    }

    // Add a new staff to the repository
    addStaff(staff: Staff): void {
        this.staff.push(staff);
    }

    // Remove a staff by their ID
    removeStaff(staffId: string): boolean {
        const index = this.staff.findIndex(staffMember => staffMember.staffId === staffId);
        if (index !== -1) {
            this.staff.splice(index, 1);
            return true;
        }
        return false;
    }

    // Update a staff's data by their ID
    updateStaff(staffId: string, updatedData: Partial<Staff>): Staff | null {
        const staff = this.staff.find(staffMember => staffMember.staffId === staffId);
        if (staff) {
            Object.assign(staff, updatedData);
            if(!test) this.saveStaff();
            return staff;
        }
        return null;
    }

    // Retrieve all staff
    getAllStaffs(): Staff[] {
        return this.staff;
    }

    // Get staff by role
    getStaffsByRole(role: StaffRole): Staff[] {
        return this.staff.filter(staffMember => staffMember.staffRole === role);
    }

    // Get a single staff by ID
    getStaffById(staffId: string): Staff | undefined {
        return this.staff.find(staffMember => staffMember.staffId === staffId);
    }

    // Get available staff
    getAvailableStaff(): Staff[] {
        return this.staff.filter(staffMember => staffMember.available);
    }
}