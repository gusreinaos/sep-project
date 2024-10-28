export enum Role {
    CustomerService = "CS",
    SeniorCustomerService = "SCS",
    FinancialManager = "FM",
    AdminManager = "AM",
    HR = "HR",
    ProductionManager = "PM",
    ServiceManager = "SM",
    VP = "VP"
}

export enum StaffRole {
    Cook = "Cook",
    Waiter = "Waiter",
    Cleaner = "Cleaner",
    //TODO add more roles based on use case
}

export interface Permission {
    [key: string]: string[];
}

// Entity Definitions
export interface Client {
    id: string;
    name: string;
    events: Event[];
}

export interface Event {
    id: string;
    details: string;
    status: string; // "open", "in_progress", "closed"
    budget: number;
}

export interface StaffMember {
    id: string;
    name: string;
    role: Role;
    schedule: string[]; // List of event IDs
}

export interface Request {
    id: string;
    clientId: string;
    details: string;
    assignedTo: Role;
    status: string; // "pending", "approved", "rejected"
}
