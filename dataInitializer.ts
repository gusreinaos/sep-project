import { Role } from "./src/domain/types";
import { User } from "./src/domain/user";
import { RequestRepository } from "./src/infrastructure/repositories/requestRepository";
import { UserRepository } from "./src/infrastructure/repositories/userRepository";

const test: boolean = false

const userRepository = new UserRepository(test);
const requestRepository = new RequestRepository(test)

userRepository.removeAllUsers()
//requestRepository.removeAllRequests()

userRepository.addUser(new User("1", "csUser", Role.CustomerService));
userRepository.addUser(new User("2", "scsUser", Role.SeniorCustomerService));
userRepository.addUser(new User("3", "fmUser", Role.FinancialManager));
userRepository.addUser(new User("4", "amUser", Role.AdminManager));
userRepository.addUser(new User("5", "pmUser", Role.ProductionManager));
userRepository.addUser(new User("6", "smUser", Role.ServiceManager));
userRepository.addUser(new User("7", "stUser", Role.SubTeamUser));
userRepository.addUser(new User("8", "hrUser", Role.HR))