import { CreateEventRequest } from "./src/application/createEventRequest";
import { GetAllRequests } from "./src/application/getAllRequests";
import { GetAssignedRequests } from "./src/application/getAssignedRequests";
import { RedirectRequest } from "./src/application/redirectRequest";
import { RedirectStaffRequest } from "./src/application/redirectStaffRequest";
import { CreateStaffRequest } from "./src/application/staff/createStaffRequest";
import { GetAllStaff } from "./src/application/staff/getAllStaff";
import { GetAllStaffRequests } from "./src/application/staff/getAllStaffRequests";
import { GetAssignedStaffRequests } from "./src/application/staff/getAssignedStaffRequests";
import { GetAvailableStaff } from "./src/application/staff/getAvailableStaff";
import { UpdateStaffRequestByStatus } from "./src/application/staff/updateStaffRequestByStatus";
import { UpdateRequest } from "./src/application/updateRequest";
import { UpdateRequestByStatus } from "./src/application/updateRequestByStatus";
import { AuthSystem } from "./src/authSystem";
import { AdministrationManagerMenu } from "./src/infrastructure/menus/administrationManagerMenu";
import { CustomerServiceMenu } from "./src/infrastructure/menus/customerServiceMenu";
import { FinancialManagerMenu } from "./src/infrastructure/menus/financialManagerMenu";
import { HumanResourceMenu } from "./src/infrastructure/menus/humanResourceMenu";
import { MainMenu } from "./src/infrastructure/menus/mainMenu";
import { ProductionManagerMenu } from "./src/infrastructure/menus/productionManagerMenu";
import { SeniorCustomerServiceMenu } from "./src/infrastructure/menus/seniorCustomerServiceMenu";
import { ServiceManagerMenu } from "./src/infrastructure/menus/serviceManagerMenu";
import { SubTeamMenu } from "./src/infrastructure/menus/subTeamMenu";
import { RequestRepository } from "./src/infrastructure/repositories/requestRepository";
import { StaffRepository } from "./src/infrastructure/repositories/staffRepository";
import { StaffRequestRepository } from "./src/infrastructure/repositories/staffRequestRepository";
import { UserRepository } from "./src/infrastructure/repositories/userRepository";

const test: boolean = false

const userRepository = new UserRepository(test);
const requestRepository = new RequestRepository(test)
const staffRepository = new StaffRepository(test)
const staffRequestRepository = new StaffRequestRepository(test)

const createEventRequest = new CreateEventRequest(requestRepository)
const getAllRequests = new GetAllRequests(requestRepository)
const updateRequestByStatus = new UpdateRequestByStatus(requestRepository)
const getAssignedRequests = new GetAssignedRequests(requestRepository)
const redirectRequest = new RedirectRequest(requestRepository)
const updateRequest = new UpdateRequest(requestRepository)
const getAvailableStaff = new GetAvailableStaff(staffRepository)
const getAllStaff = new GetAllStaff(staffRepository)
const createStaffRequest = new CreateStaffRequest(staffRequestRepository)
const getAllStaffRequests = new GetAllStaffRequests(staffRequestRepository)
const updateStaffRequestByStatus = new UpdateStaffRequestByStatus(staffRequestRepository)
const redirectStaffRequest = new RedirectStaffRequest(staffRequestRepository)
const getAssignedStaffRequests = new GetAssignedStaffRequests(staffRequestRepository)

// Create instances of each menu
const authSystem = new AuthSystem(userRepository);
const customerServiceMenu = new CustomerServiceMenu(createEventRequest, userRepository);
const seniorCustomerServiceMenu = new SeniorCustomerServiceMenu(getAllRequests, updateRequestByStatus, redirectRequest, requestRepository, userRepository);
const financialManagerMenu = new FinancialManagerMenu(getAssignedRequests, redirectRequest, userRepository, updateRequest);
const administrationManagerMenu = new AdministrationManagerMenu(getAssignedRequests, updateRequestByStatus, redirectRequest, userRepository);
const productionManagerMenu = new ProductionManagerMenu(getAvailableStaff, getAllStaff, getAssignedRequests, redirectRequest, userRepository, updateRequestByStatus, createStaffRequest, requestRepository);
const serviceManagerMenu = new ServiceManagerMenu(getAvailableStaff,getAllStaff, getAssignedRequests, redirectRequest, userRepository,  updateRequestByStatus, createStaffRequest, requestRepository, getAssignedStaffRequests);
const subTeamMenu = new SubTeamMenu(updateRequest, redirectRequest, userRepository, getAssignedRequests);
const humanResourceMenu = new HumanResourceMenu(getAvailableStaff, getAllStaff, userRepository, getAllStaffRequests, updateStaffRequestByStatus, redirectStaffRequest)

// Instantiate the main menu
const mainMenu = new MainMenu(
    authSystem,
    customerServiceMenu,
    seniorCustomerServiceMenu,
    financialManagerMenu,
    administrationManagerMenu,
    productionManagerMenu,
    serviceManagerMenu,
    subTeamMenu,
    humanResourceMenu
);

// Set up users with different roles in the AuthSystem

// Display the main menu
mainMenu.displayMenu();
