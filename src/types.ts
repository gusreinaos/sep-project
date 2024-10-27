export enum Role {
    CustomerService = "CustomerService",
    SeniorCustomerService = "SeniorCustomerService",
    FinancialManager = "FinancialManager",
    AdminManager = "AdminManager",
    HR = "HR",
    Marketing = "Marketing",
    VicePresident = "VicePresident"
  }
  
  export interface Permission {
    [key: string]: string[];
  }
  