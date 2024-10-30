# Sep Project

The sep management system is desinged to manage staff-related requests, tracking everything from initial requests to approvals and task assignments. This system is built using Node.js, and it includes JSON file persistence for storing request data.

## Installation and Requirements

Ensure you have **Node.js** installed. If not, download and install it from [https://nodejs.org](https://nodejs.org).

### Setting Up the Project

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/staff-management-system.git
   cd project
   ```

2. Install dependencies
    ```bash
    npm install
    ````

## Usage

The system can run in multiple modes based on your needs

### Commands

- **Initialize and Run (Production):**
    ```bash
    npm run prod
    ```
    This command is used for the first-time setup, making sure that all necessary files are created and the program is started.

- **Run in Development Mode:**
    ```bash
    npm run dev
    ```
    This command is used to tun the system in development mode. It allows you to recompile after making changes by running the command again.

- **Populate database:**
    ```bash
    tsc dataInitializer.ts
    node dataInitializer.js
    ```
    This command is used to populate the database before running it manually.

- **Manual Run:**
    ```bash
    tsc main.ts
    node main.js
    ```
    This command runs the main application directly without any recompilation or initialization steps. Use this when the system has been already initialized

- **Run tests:**
    ```bash
    npm test
    ```
    This command runs all the tests in the project to verify the functionality.