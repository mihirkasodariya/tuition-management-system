# MyClasses Management System Project

# Backend Project Setup

This guide will help you set up the backend environment for development or production. The project uses MongoDB, and logging through Morgan and Winston etc....

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Docker](https://www.docker.com/) (for Redis setup)
- MongoDB (either locally installed or a production database)
- [Cloudinary Account](https://cloudinary.com/) (for media storage)
- [Razorpay Account](https://razorpay.com/) (for handling payments)
- Gmail account for sending emails via Nodemailer

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mihirkasodariya/tuition-management-system.git
cd MyClasses_management
cd Backend
```

### 2. Set Up MongoDB

First, you need to create a MongoDB database locally or use a production MongoDB instance.

- To install MongoDB locally, follow the [official guide](https://docs.mongodb.com/manual/installation/).
- Alternatively, you can use a service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a production database.

### 3. Installation of Modules

```bash
npm install
```

### 4. Adding Env

- create a .env file and keep in the root folder

```plaintext
Backend Folder/
│
├── public/
├── src/
│   ├── controllers
│   ├── models
│   ├── Routes
├── .env
├── .gitignore
├── package.json
└── app.js
└── server.js
```

### 5. Starting a Server

- make sure your redis server is also running
- default Mongodb URL: "mongodb://127.0.0.1:27017/MyClassesManagement"

```bash

npm start (node script)
or
npm run dev (nodemon script)
```

## Environment Variables

The project uses the following environment variables, which need to be configured in a `.env` file located in the root directory of the project.

```plaintext
# port
PORT = 8000
DEVELOPMENT_MODE = development
# DEVELOPMENT_MODE = production

# mongo db
DB_URL =
DB_URL_DEV = mongodb://127.0.0.1:27017/MyClassesManagement

# Jwt Token
ACCESS_TOKEN_KEY = hVqttccSt2SWw53GMCnD
ACCESS_TOKEN_KEY_TIME =  3D  # 3 Days

# Access Origins
ALLOW_ORIGINS_ACCESS =["http://localhost:5173","http://localhost:3000"]

```
