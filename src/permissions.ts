import { Role, Permission } from "./types";

export const permissions: Permission = {
  [Role.CustomerService]: ["registerClient", "createRequest"],
  [Role.SeniorCustomerService]: ["approveRequest", "rejectRequest", "viewAllRequests"],
  [Role.FinancialManager]: ["applyDiscount", "viewClientFinances"],
  [Role.AdminManager]: ["approveBudget", "manageSchedule"],
  [Role.HR]: ["viewEmployeeHistory", "updateEmployeeRecords"],
  [Role.Marketing]: ["generateReports"],
  [Role.VicePresident]: ["viewSummaryReports"]
};
