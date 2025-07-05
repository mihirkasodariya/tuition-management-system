# 🎓 AcademIQ Tuition Management System

> A custom-built tuition management system designed to automate and streamline the workflow of small-scale tutors.

**AcademIQ** is a full-stack solution for educators, automating class scheduling, attendance, progress tracking, and communication. It brings structure, automation, and ease-of-use to the tutoring process, supporting both admins and students with dedicated dashboards.

---

## 🧩 Features

- ✅ **Automated Google Meet Link Generation**
- ✅ **Scheduled Email Notifications (AWS SES, Nodemailer)**
- ✅ **Batch, Board, Subject & Chapter Management**
- ✅ **Attendance Tracking**
- ✅ **Student Progress Monitoring (Chapter-wise)**
- ✅ **Notes Builder & Sharing**
- ✅ **Admin & Student Dashboards**
- ✅ **AI Agent Backend (LangChain, OpenAI, Google GenAI)**
- ✅ **Real-time Communication (Socket.io)**
- ✅ **File Uploads (Cloudinary Integration)**
- ✅ **Secure Authentication & Role Management**
- ✅ **Responsive UI (React, TailwindCSS, Shadcn, Radix UI)**

---

## ⚙️ Tech Stack

**Frontend:**
- React 19, Vite, Redux Toolkit
- TailwindCSS, Shadcn, Radix UI, Lucide Icons
- Axios, Formik, Yup, GSAP, React Big Calendar, ApexCharts
- Socket.io-client for real-time features

**Backend:**
- Node.js, Express.js
- MongoDB (Mongoose)
- Redis (for caching/session)
- Socket.io (real-time)
- Nodemailer, AWS SES (email)
- Google APIs (Meet integration)
- Cloudinary (file uploads)
- JWT Auth, Helmet, Rate Limiting, Winston Logging

**AI Agent Backend:**
- Node.js, Express.js
- LangChain, OpenAI, Google GenAI, Zod, Twilio

**DevOps:**
- Docker, Docker Compose
- Environment-based config (.env)
- Production-ready Dockerfiles for all services

---

## 🏗️ Architecture Overview

```mermaid
graph TD
  A[Frontend (React)] --REST/Socket.io--> B[Backend API (Node/Express)]
  B --MongoDB--> C[(MongoDB)]
  B --Redis--> D[(Redis)]
  B --Cloudinary--> E[(Cloudinary)]
  B --Google Meet API--> F[(Google)]
  B --AWS SES/Nodemailer--> G[(Email)]
  B --Socket.io--> A
  B --AI API--> H[Agent Backend (LangChain, OpenAI, Google GenAI)]
```

---

## 🛠️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/mihirkasodariya/tuition-management-system.git
cd tutuion_management
```

### 2. Environment Variables

- Copy `.env.example` to `.env` in each of `backend/`, `frontend/`, and `agent-backend/`.
- Fill in your MongoDB, Redis, Cloudinary, Google, AWS SES, and email credentials.

### 3. Using Docker (Recommended)

Make sure you have Docker and Docker Compose installed.

```bash
docker-compose up --build
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:8000](http://localhost:8000)
- Agent Backend: [http://localhost:8002](http://localhost:8002)

### 4. Manual Setup

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

#### Agent Backend

```bash
cd agent-backend
npm install
npm run dev
```

---

## 🚀 Usage

- Access the frontend at [http://localhost:5173](http://localhost:5173)
- Register or login as Admin/Student.
- Manage batches, boards, subjects, chapters, attendance, and notes.
- Automated Google Meet links and email notifications are handled by the backend.
- Real-time features (chat, notifications) require backend and frontend to be running.

---

## 🔑 Environment Variables

Each service requires a `.env` file. Example keys:

- `PORT`, `DEVELOPMENT_MODE`, `DB_URL`, `REDIS_URL`
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET_KEY`
- `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALL_BACK_URL`
- `NODEMAILER_USER`, `NODEMAILER_PASS`
- `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_SES_SENDER`
- `ACCESS_TOKEN_KEY`, `ENCRYPTION_KEY`
- See `/backend/README.md` and `/agent-backend/README.md` for full lists.

---

## 📬 API & Integrations

- **Google Meet API:** Automated meeting link generation for classes.
- **AWS SES & Nodemailer:** Scheduled and transactional emails.
- **Cloudinary:** Secure file uploads for notes and resources.
- **Socket.io:** Real-time chat and notifications.
- **AI Agent Backend:** Integrates with LangChain, OpenAI, Google GenAI for advanced features.

---

## 🤝 Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements or bug fixes.

---

## 📄 License

This project is licensed under the MIT License.

---

## 👤 Author & Contact

**Developed by:** Mihir Kasodariya  
**Contact:** [LinkedIn](https://www.linkedin.com/in/mihirkasodariya) | [Email](mailto:your-email@example.com)

---

**AcademIQ** – Empowering educators with automation and insight.

---