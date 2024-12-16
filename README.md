# Ticketing Backend for Cellpay

## Description
The **Ticketing Backend** is a RESTful API designed to allow **Cellpay** customers to create tickets for reporting issues, complaints, and inquiries. It provides functionality for users to submit, track, and manage complaints related to their services. The system is integrated with **Cellpay's backend** to offer seamless support for customers.

This backend API helps **Cellpay** streamline customer service processes by organizing complaints and providing tools for agents to track, resolve, and follow up on customer issues.

## Features
- **Api Authentication**: Secret-Key verification.
- **Ticket Creation**: Customers can create tickets for issues or complaints related to Cellpay services.
- **Ticket Tracking**: Customers and agents can track the status of submitted tickets.
- **Ticket Categories**: Support for different types of tickets, such as billing issues, service outages, technical problems, etc.
- **Admin Dashboard**: Admins can manage and resolve tickets submitted by customers.
- **Role-Based Admin Access**: Implemented role-based access control (RBAC) with three distinct roles:
  - **Super Admin**: Full access to all system features, including user management, role assignments, and system configuration.
  - **Admin**: Can manage operators and resolve all tickets, but cannot change system settings or perform super-admin role.
  - **Operator**: Can view and resolve tickets assigned to them, but has no access to  administrative features.

## Installation

### Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (version 20.x or higher)
- **npm** (Node Package Manager)
- **MongoDB** (for database storage)

### Steps
1. Clone the repository to your local machine:
   ```bash
   git clone https://gitlab.cellpay.com.np/cellpay-group/ticketing-backend.git
2. npm install
3. configure mongodb connection string in config.env file
4. npm run dev for development mode or npm run prod for production mode


### Deployment
1. Pull Latest Code
First, ensure you have the latest version of the project. Navigate to the project folder and run: (/var/www/ticketin-backend)
2. Update package.json for Production
If you have previously been using nodemon for development, switch it to node for production. In your package.json file, update the start script to use node instead of nodemon:
3. Verify CORS Configuration
Ensure that your CORS (Cross-Origin Resource Sharing) settings are configured correctly in the app.js or server.js file. You should update the allowed origins to reflect your production domain (instead of localhost).
4. Restart the Application in Production with PM2
After making the necessary changes, you can start the application using PM2 to keep it running in the background and manage the process in production:
pm2 restart id/process name