import { CreateEventRequest } from "./src/application/createEventRequest";
import { CreateStaffRequest } from "./src/application/createStaffRequest";
import { GetAllRequests } from "./src/application/getAllRequests";
import { GetAssignedRequests } from "./src/application/getAssignedRequests";
import { RedirectRequest } from "./src/application/redirectRequest";
import { GetAvailableStaff } from "./src/application/staff/getAvailableStaff";
import { UpdateRequest } from "./src/application/updateRequest";
import { UpdateRequestByStatus } from "./src/application/updateRequestByStatus";
import { AuthSystem } from "./src/authSystem";
import { Role } from "./src/domain/types";
import { User } from "./src/domain/user";
import { AdministrationManagerMenu } from "./src/infrastructure/menus/administrationManagerMenu";
import { CustomerServiceMenu } from "./src/infrastructure/menus/customerServiceMenu";
import { FinancialManagerMenu } from "./src/infrastructure/menus/financialManagerMenu";
import { MainMenu } from "./src/infrastructure/menus/mainMenu";
import { ProductionManagerMenu } from "./src/infrastructure/menus/productionManagerMenu";
import { SeniorCustomerServiceMenu } from "./src/infrastructure/menus/seniorCustomerServiceMenu";
import { ServiceManagerMenu } from "./src/infrastructure/menus/serviceManagerMenu";
import { RequestRepository } from "./src/infrastructure/repositories/requestRepository";
import { StaffRepository } from "./src/infrastructure/repositories/staffRepository";
import { StaffStaffRequestRepository } from "./src/infrastructure/repositories/staffRequestRepository";
import { UserRepository } from "./src/infrastructure/repositories/userRepository";

const userRepository = new UserRepository();
const requestRepository = new RequestRepository()
const staffRepository = new StaffRepository()
const staffRequestRepository = new StaffStaffRequestRepository()

const createEventRequest = new CreateEventRequest(requestRepository)
const getAllRequests = new GetAllRequests(requestRepository)
const updateRequestByStatus = new UpdateRequestByStatus(requestRepository)
const getAssignedRequests = new GetAssignedRequests(requestRepository)
const redirectRequest = new RedirectRequest(requestRepository)
const updateRequest = new UpdateRequest(requestRepository)
const getAvailableStaff = new GetAvailableStaff(staffRepository)
const createStaffRequest = new CreateStaffRequest(staffRequestRepository)

// Create instances of each menu
const authSystem = new AuthSystem(userRepository);
const customerServiceMenu = new CustomerServiceMenu(createEventRequest);
const seniorCustomerServiceMenu = new SeniorCustomerServiceMenu(getAllRequests, updateRequestByStatus);
const financialManagerMenu = new FinancialManagerMenu(getAssignedRequests, redirectRequest, userRepository, updateRequest);
const administrationManagerMenu = new AdministrationManagerMenu(getAssignedRequests, updateRequestByStatus);
const productionManagerMenu = new ProductionManagerMenu(getAvailableStaff, getAssignedRequests, redirectRequest, userRepository, updateRequestByStatus);
const serviceManagerMenu = new ServiceManagerMenu(getAvailableStaff, getAssignedRequests, redirectRequest, userRepository,  updateRequestByStatus, createStaffRequest);

// Instantiate the main menu
const mainMenu = new MainMenu(
    authSystem,
    customerServiceMenu,
    seniorCustomerServiceMenu,
    financialManagerMenu,
    administrationManagerMenu,
    productionManagerMenu,
    serviceManagerMenu
);

// Set up users with different roles in the AuthSystem
userRepository.addUser(new User("1", "csUser", Role.CustomerService));
userRepository.addUser(new User("2", "scsUser", Role.SeniorCustomerService));
userRepository.addUser(new User("3", "fmUser", Role.FinancialManager));
userRepository.addUser(new User("4", "amUser", Role.AdminManager));
userRepository.addUser(new User("5", "pmUser", Role.ProductionManager));
userRepository.addUser(new User("6", "smUser", Role.ServiceManager));

// Display the main menu
mainMenu.displayMenu();
