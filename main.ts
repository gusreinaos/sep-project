import { AuthSystem } from "./src/authSystem";
import { SystemInterface } from "./src/systemInterface";

const authSystem = new AuthSystem();
const systemInterface = new SystemInterface(authSystem);

console.log(authSystem.login("jane")); // Logs in as SeniorCustomerService
systemInterface.showOptions(); // Shows available options for SeniorCustomerService

console.log(systemInterface.executeAction("approveRequest")); // Executes an allowed action
console.log(systemInterface.executeAction("applyDiscount")); // Denied action

console.log(authSystem.logout()); // Logs out
systemInterface.showOptions(); // Should indicate no user is logged in
