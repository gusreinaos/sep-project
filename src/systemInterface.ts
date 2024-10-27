import { AuthSystem } from "./authSystem";

export class SystemInterface {
  private authSystem: AuthSystem;

  constructor(authSystem: AuthSystem) {
    this.authSystem = authSystem;
  }

  showOptions() {
    const user = this.authSystem.getCurrentUser();
    if (!user) {
      console.log("No user is logged in.");
      return;
    }

    const availableOptions = user.getPermissions();
    console.log(`Available options for ${user.role}:`);
    availableOptions.forEach(option => console.log(`- ${option}`));
  }

  executeAction(action: string): string {
    const user = this.authSystem.getCurrentUser();
    if (!user) return "Please log in first.";

    if (!user.getPermissions().includes(action)) {
      return "Access denied. You do not have permission to perform this action.";
    }

    // Placeholder for actual action handling
    return `Action '${action}' executed successfully.`;
  }
}
