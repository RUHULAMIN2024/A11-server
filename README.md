# Flavor Fusion (Server)

This is the server-side codebase for **Flavor Fusion**, a modern and responsive restaurant management website. The server handles all backend operations, including user authentication, data management, and API functionalities to support the client-side application. 

[Live Website](http://flavor-fusion-11.surge.sh/)

---

## Features

- **User Authentication:** Secure login and registration with JWT-based authentication.
- **Third-Party Authentication:** Login with Google and GitHub for seamless access.
- **Food Management:** APIs to handle adding, updating, and deleting food items.
- **Feedback Management:** Endpoints for collecting and storing user feedback.
- **Purchase Operations:** Handles order placements and tracks user purchases.
- **Role-Based Access Control:** Differentiated permissions for Admin and Users.

---

## Technologies Used

- **Backend Framework:** Node.js with Express.js
- **Database:** MongoDB for data storage and management
- **Authentication:** JSON Web Tokens (JWT), Firebase
- 
## Installation and Setup

Follow these steps to set up the server locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/flavor-fusion-server.git

2. **Navigate to the project directory:**
   ```bash
   cd flavor-fusion-server

3. **Install dependencies:**
    ```bash
    npm install

4. **Set up environment variables:** Create a .env file in the root directory.
5. **Run the project:**
    ```bash
    npm run dev
The website should now be running on http://localhost:5000.
