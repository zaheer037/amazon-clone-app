Mini Amazon Project
This is a simple full-stack e-commerce web application, similar to Amazon, where users can register, log in, view products, and make purchases. The project is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and supports user authentication and item management with file upload functionality.

Features
User Authentication: Users can register, log in, and log out using Passport.js and sessions.
Item Management: Authenticated users can view and add new items with images, names, and prices.
Purchases: Users can buy items and the purchases are stored in the backend.
File Uploads: Item images are uploaded using Multer and stored locally.
Admin/User View: Admins can add items, and users can browse and purchase them.
Tech Stack
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB (Mongoose)
Authentication: Passport.js (Local strategy)
File Uploads: Multer
Session Management: Express-session
Project Structure
php
Copy code
├── client/               # React frontend
│   ├── public/
│   ├── src/
│       ├── components/
│           ├── AddItem.js
│           ├── Item.js
│           ├── ItemList.js
│       ├── App.js
│       ├── index.js
├── models/               # MongoDB models
│   ├── Customer.js
│   ├── Item.js
│   ├── Purchase.js
│   └── User.js
├── uploads/              # Uploaded item images
├── server.js             # Main Express backend file
├── package.json          # Backend dependencies
└── README.md             # Project README
Installation and Setup
Backend Setup
Clone the repository:

bash
Copy code
git clone https://github.com/jaheer037/amazon-clone-app.git
Install backend dependencies:

bash
Copy code
cd mini-amazon-project
npm install
Set up MongoDB: Make sure you have MongoDB installed and running on your local machine. The database name is set to Amazon.

Start the server:

bash
Copy code
node server.js
The backend will run on http://localhost:3000.

Frontend Setup
Navigate to the client folder:

bash
Copy code
cd client
Install frontend dependencies:

bash
Copy code
npm install
Start the React app:

bash
Copy code
npm start
The React frontend will run on http://localhost:3001.

Usage
Visit http://localhost:3001 to access the application.
Home Page: You can view available items. If logged in, you can add items to the store.
Register/Login: Create an account and log in to purchase items.
Add Items: Authenticated users can add items with a name, price, and image.
Routes
Backend API
GET /items: Fetch all items available in the store.
POST /add-item: Add a new item (Admin only, requires authentication).
POST /purchase: Purchase an item (Requires authentication).
GET /login: Show the login form.
POST /login: Handle user login.
GET /register: Show the registration form.
POST /register: Handle user registration.
GET /logout: Log out the user.
Models
User
username: String
password: String (handled by Passport Local Mongoose)
Item
name: String
price: Number
image: String (path to the uploaded image)
Purchase
cname: String (Customer username)
itemname: String
price: Number
Customer
name: String
email: String
phone: String
Dependencies
Backend
Express: Fast, unopinionated, minimalist web framework for Node.js.
Mongoose: Elegant MongoDB object modeling for Node.js.
Passport: Simple and secure authentication middleware for Node.js.
Passport-Local: Username and password authentication strategy for Passport.js.
Multer: Middleware for handling multipart/form-data (for image uploads).
Frontend
React: A JavaScript library for building user interfaces.
Axios: Promise-based HTTP client for the browser and Node.js.
Screenshots
Home Page

Add Item Page

Purchase Item

Contributing
If you'd like to contribute to this project, please fork the repository and submit a pull request. For any questions, feel free to open an issue.

License
This project is licensed under the MIT License - see the LICENSE file for details.

