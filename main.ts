import { AuthSystem } from "./src/authSystem";
import { SystemInterface } from "./src/systemInterface";
import { UserManager } from "./src/UserManager";

const userManager = new UserManager();
const authSystem = new AuthSystem(userManager);
const systemInterface = new SystemInterface(authSystem);

authSystem.users.forEach(user => userManager.addUser(user));

console.log(authSystem.login("jane")); // Logs in as SeniorCustomerService
systemInterface.showOptions(); // Shows available options for SeniorCustomerService

console.log(systemInterface.executeAction("approveRequest")); // Executes an allowed action
console.log(systemInterface.executeAction("applyDiscount")); // Denied action

console.log(authSystem.logout()); // Logs out
systemInterface.showOptions(); // Should indicate no user is logged in
