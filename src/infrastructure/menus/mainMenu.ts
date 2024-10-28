import * as readline from "readline";
import { AuthSystem } from "../../authSystem";
import { AdministrationManagerMenu } from "./administrationManagerMenu";
import { CustomerServiceMenu } from "./customerServiceMenu";
import { FinancialManagerMenu } from "./financialManagerMenu";
import { ProductionManagerMenu } from "./productionManagerMenu";
import { SeniorCustomerServiceMenu } from "./seniorCustomerServiceMenu";
import { ServiceManagerMenu } from "./serviceManagerMenu";

export class MainMenu {
    constructor(
        private readonly authSystem: AuthSystem,
        // Menu types
        private readonly customerServiceMenu: CustomerServiceMenu,
        private readonly seniorCustomerServiceMenu: SeniorCustomerServiceMenu,
        private readonly financialManagerMenu: FinancialManagerMenu,
        private readonly administrationManagerMenu: AdministrationManagerMenu,
        private readonly productionManagerMenu: ProductionManagerMenu,
        private readonly serviceManagerMenu: ServiceManagerMenu,
    ) {}

    displayMenu(): void {
        console.log("\n--- Main Menu ---");
        console.log("1. Login");
        console.log("2. Exit");
        this.getUserSelection();
    }

    private getUserSelection(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Select an option: ", (selection) => {
            switch (selection.trim()) {
                case "1":
                    this.startLogin();
                    break;
                case "2":
                    console.log("Exiting Application.");
                    rl.close();
                    return;
                default:
                    console.log("Invalid option. Please select again.");
                    this.displayMenu();
                    break;
            }
            rl.close();
        });
    }

    private startLogin(): void {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        rl.question("Enter username: ", (username) => {
                const result = this.authSystem.login(username);
                console.log(result);
                rl.close();

                const curr_user = this.authSystem.getCurrentUser();
                switch(curr_user?.role) {
                        case "CS":
                            this.customerServiceMenu.displayMenu();
                            return;
                        case "SCS":
                            this.seniorCustomerServiceMenu.displayMenu();
                            return;
                        case "FM":
                            this.financialManagerMenu.displayMenu(curr_user);
                            return;
                        case "AM":
                            this.administrationManagerMenu.displayMenu(curr_user);
                            return;
                        case "HR":
                            // this._.displayMenu();
                            // return;
                        case "PM":
                            this.productionManagerMenu.displayMenu(curr_user);
                            return;
                        case "SM":
                            this.serviceManagerMenu.displayMenu(curr_user);
                            return;
                        case "VP":
                            // this.vicePresidentMenu.displayMenu();
                            // return;
                        default:
                            console.log("Invalid role. Please contact system admin.");
                            break;
                    }
                
                    // fall back 
                this.displayMenu();
        });
    }

}