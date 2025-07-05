# Tuition Management Project

# Backend Project Setup

This guide will help you set up the backend environment for development or production. The project uses MongoDB, Redis, and logging through Morgan and Winston etc....

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [Docker](https://www.docker.com/) (for Redis setup)
- MongoDB (either locally installed or a production database)
- [Cloudinary Account](https://cloudinary.com/) (for media storage)

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/mihirkasodariya/tuition-management-system.git
cd tutuion_management
cd backend
```

### 2. Set Up MongoDB

First, you need to create a MongoDB database locally or use a production MongoDB instance.

- To install MongoDB locally, follow the [official guide](https://docs.mongodb.com/manual/installation/).
- Alternatively, you can use a service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for a production database.

### 3. Set Up Redis

You will need Redis for caching and session management. You can either install Redis locally or use a cloud-based solution like [Redis Cloud](https://redis.com/solutions/cloud/).

##### To set up Redis locally using Docker:

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

### 4. Installation of Modules

```bash
npm install
```

### 5. Adding Env

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

### 4. Starting a Server

- make sure your redis server is also running
- default Mongodb URL: "mongodb://127.0.0.1:27017/tuition_management"
- default Redis URL: "redis://default:authpassword@127.0.0.1:6379"

```bash

npm start (node script)
or
npm run dev (nodemon script)
```

## Environment Variables

The project uses the following environment variables, which need to be configured in a `.env` file located in the root directory of the project.

```plaintext
# PORT
PORT = 8000

# Development (development | production)
DEVELOPMENT_MODE = development


#  MongoDB
# DB_URL_DEV = mongodb://127.0.0.1:27017/TuitionManagement
DB_URL =

# redis db
REDIS_URL =
REDIS_URL_DEV = redis://default:authpassword@127.0.0.1:6379

# Cors
ALLOW_ORIGINS_ACCESS =["http://localhost:5173","http://localhost:3000"]


# Jwt Token
ACCESS_TOKEN_KEY = something_key
ACCESS_TOKEN_KEY_TIME =  3D  # 3 Days
ENCRYPTION_KEY = something_key



# cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY =
CLOUDINARY_API_SECRET_KEY =


# google console
GOOGLE_CLIENT_ID =
GOOGLE_CLIENT_SECRET =
GOOGLE_CALL_BACK_URL = http://localhost:8000/auth/google/callback




# nodemailer
NODEMAILER_SERVICE=gmail
NODEMAILER_HOST=smtp.gmail.com
NODEMAILER_PORT=587
NODEMAILER_USER=
NODEMAILER_PASS=

# account user id for the cron job creating a meets
# USER_ACCOUNT_ID = admin(_id for automation email)

# open_router_api_key
OPEN_ROUTER_API_KEY =

```
