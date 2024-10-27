import { Role, Permission } from "./types";

export const permissions: Permission = {
    [Role.CustomerService]: ["registerClient", "createRequest"],
    [Role.SeniorCustomerService]: ["approveRequest", "rejectRequest", "viewAllRequests", "redirectRequest"],
    [Role.FinancialManager]: ["applyDiscount", "viewClientFinances", "negotiateBudget"],
    [Role.AdminManager]: ["approveBudget", "manageSchedule"],
    [Role.HR]: ["viewEmployeeHistory", "updateEmployeeRecords", "requestAdditionalStaff"],
    [Role.ProductionManager]: ["checkAvailability", "assignTasks", "reviewComments"],
    [Role.ServiceManager]: ["manageServiceTasks", "requestAdditionalResources"],
    [Role.VP]: ["generateReports"]
};