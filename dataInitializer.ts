import { Role } from "./src/domain/types";
import { User } from "./src/domain/user";
import { RequestRepository } from "./src/infrastructure/repositories/requestRepository";
import { StaffRepository } from "./src/infrastructure/repositories/staffRepository";
import { StaffRequestRepository } from "./src/infrastructure/repositories/staffRequestRepository";
import { UserRepository } from "./src/infrastructure/repositories/userRepository";

const userRepository = new UserRepository();
const requestRepository = new RequestRepository()
const staffRepository = new StaffRepository()
const staffRequestRepository = new StaffRequestRepository()

userRepository.removeAllUsers()
requestRepository.removeAllRequests()

userRepository.addUser(new User("1", "csUser", Role.CustomerService));
userRepository.addUser(new User("2", "scsUser", Role.SeniorCustomerService));
userRepository.addUser(new User("3", "fmUser", Role.FinancialManager));
userRepository.addUser(new User("4", "amUser", Role.AdminManager));
userRepository.addUser(new User("5", "pmUser", Role.ProductionManager));
userRepository.addUser(new User("6", "smUser", Role.ServiceManager));